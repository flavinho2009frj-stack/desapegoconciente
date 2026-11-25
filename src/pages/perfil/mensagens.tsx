import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { T, ff, type Page } from "../../tokens"
import {
  Btn,
  H2,
  EmptyState,
  Avatar,
  Alert,
} from "../../components/ui"
import { Icons } from "../../components/icons"
import { SidebarLayout, UserSidebar } from "../../components/layout"
import {
  apiRequest,
  getAuthToken,
  type ApiConversation,
  type ApiMessage,
} from "../../lib/api"

export function MensagensPage({
  nav,
  initialAdId,
}: {
  nav: (p: Page) => void
  initialAdId?: number | null
}) {
  const [conversations, setConversations] = useState<ApiConversation[]>([])
  const [active, setActive] = useState(0)
  const [conversationMessages, setConversationMessages] = useState<ApiMessage[]>([])
  const [messagesConversationId, setMessagesConversationId] = useState<number | null>(null)
  const activeConversationIdRef = useRef<number | null>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const shouldScrollToBottomRef = useRef(true)
  const latestMessageIdRef = useRef(0)
  const loadingOlderRef = useRef(false)
  const pendingScrollAdjustmentRef = useRef<{ height: number; top: number } | null>(null)
  const [hasOlderMessages, setHasOlderMessages] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [msg, setMsg] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const conv = conversations[active]
  const conversationId = conv?.id ?? null

  useEffect(() => {
    if (!getAuthToken()) {
      nav("login")
      return
    }
    let mounted = true
    apiRequest<{ conversations: ApiConversation[] }>("/messages/conversations")
      .then((result) => {
        if (!mounted) return
        setConversations(result.conversations)
        let selectedIndex = 0
        if (initialAdId !== null && initialAdId !== undefined) {
          const conversationIndex = result.conversations.findIndex(
            (conversation) => conversation.adId === initialAdId,
          )
          if (conversationIndex >= 0) selectedIndex = conversationIndex
        }
        setActive(selectedIndex)
        activeConversationIdRef.current = result.conversations[selectedIndex]?.id ?? null
      })
      .catch((requestError) => {
        if (mounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "NÃƒÂ£o foi possÃƒÂ­vel carregar suas conversas.",
          )
        }
      })
      .finally(() => mounted && setIsLoading(false))
    return () => {
      mounted = false
    }
  }, [nav])

  useEffect(() => {
    if (conversationId === null) return
    let mounted = true
    latestMessageIdRef.current = 0
    shouldScrollToBottomRef.current = true
    setHasOlderMessages(false)
    setMessagesConversationId(null)

    const loadLatestMessages = () => {
      apiRequest<{ messages: ApiMessage[]; hasMore: boolean }>(
        `/messages?conversationId=${conversationId}&limit=50`,
      )
        .then((result) => {
          if (!mounted || activeConversationIdRef.current !== conversationId) return
          setConversationMessages((current) => {
            const knownIds = new Set(current.map((message) => message.id))
            return [...current, ...result.messages.filter((message) => !knownIds.has(message.id))]
              .sort((left, right) => left.id - right.id)
          })
          latestMessageIdRef.current =
            result.messages[result.messages.length - 1]?.id ?? 0
          setHasOlderMessages(result.hasMore)
          setMessagesConversationId(conversationId)
        })
        .catch((requestError) => {
          if (mounted && activeConversationIdRef.current === conversationId) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "NÃƒÂ£o foi possÃƒÂ­vel carregar as mensagens.",
            )
          }
        })
    }
    const loadNewMessages = () => {
      apiRequest<{ messages: ApiMessage[]; hasMore: boolean }>(
        `/messages?conversationId=${conversationId}&afterId=${latestMessageIdRef.current}&limit=50`,
      )
        .then((result) => {
          if (!mounted || activeConversationIdRef.current !== conversationId) return
          if (result.messages.length === 0) return
          latestMessageIdRef.current =
            result.messages[result.messages.length - 1].id
          setConversationMessages((current) => {
            const knownIds = new Set(current.map((message) => message.id))
            return [
              ...current,
              ...result.messages.filter((message) => !knownIds.has(message.id)),
            ]
          })
          setConversations((current) =>
            current.map((item) =>
              item.id === conversationId
                ? {
                    ...item,
                    lastMessage:
                      result.messages[result.messages.length - 1].body,
                    lastMessageAt:
                      result.messages[result.messages.length - 1].createdAt,
                  }
                : item,
            ),
          )
        })
        .catch((requestError) => {
          if (mounted && activeConversationIdRef.current === conversationId) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "NÃ£o foi possÃ­vel atualizar as mensagens.",
            )
          }
        })
    }

    setConversationMessages([])
    loadLatestMessages()
    const interval = window.setInterval(loadNewMessages, 5000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [conversationId])

  useLayoutEffect(() => {
    const list = messageListRef.current
    if (!list || messagesConversationId !== conversationId) return

    const adjustment = pendingScrollAdjustmentRef.current
    if (adjustment) {
      list.scrollTop =
        adjustment.top + (list.scrollHeight - adjustment.height)
      pendingScrollAdjustmentRef.current = null
      return
    }

    if (shouldScrollToBottomRef.current) {
      list.scrollTop = list.scrollHeight
    }
  }, [conversationMessages, messagesConversationId, conversationId])

  const loadOlderMessages = async () => {
    const firstMessage = conversationMessages[0]
    if (
      !conversationId ||
      !firstMessage ||
      !hasOlderMessages ||
      loadingOlderRef.current
    ) {
      return
    }

    loadingOlderRef.current = true
    setIsLoadingOlder(true)
    const list = messageListRef.current
    try {
      const result = await apiRequest<{
        messages: ApiMessage[]
        hasMore: boolean
      }>(
        `/messages?conversationId=${conversationId}&beforeId=${firstMessage.id}&limit=50`,
      )
      if (activeConversationIdRef.current !== conversationId) return
      setHasOlderMessages(result.hasMore)
      if (result.messages.length > 0 && list) {
        pendingScrollAdjustmentRef.current = {
          height: list.scrollHeight,
          top: list.scrollTop,
        }
        setConversationMessages((current) => {
          const knownIds = new Set(current.map((message) => message.id))
          return [
            ...result.messages.filter((message) => !knownIds.has(message.id)),
            ...current,
          ]
        })
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "NÃ£o foi possÃ­vel carregar mensagens anteriores.",
      )
    } finally {
      loadingOlderRef.current = false
      setIsLoadingOlder(false)
    }
  }

  const handleMessageListScroll = () => {
    const list = messageListRef.current
    if (!list) return
    shouldScrollToBottomRef.current =
      list.scrollHeight - list.scrollTop - list.clientHeight < 80
    if (
      list.scrollTop < 80 &&
      hasOlderMessages &&
      !loadingOlderRef.current
    ) {
      void loadOlderMessages()
    }
  }

  const sendMsg = async () => {
    if (!conv || !msg.trim() || isSending) return
    setIsSending(true)
    setError("")
    try {
      const conversationId = conv.id
      const result = await apiRequest<{ message: ApiMessage }>("/messages", {
        method: "POST",
        body: JSON.stringify({ conversationId, body: msg.trim() }),
      })
      if (activeConversationIdRef.current === conversationId) {
        setConversationMessages((current) => [...current, result.message])
        setMessagesConversationId(conversationId)
      }
      setConversations((current) =>
        current.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                lastMessage: result.message.body,
                lastMessageAt: result.message.createdAt,
              }
            : item,
        ),
      )
      setMsg("")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "NÃƒÂ£o foi possÃƒÂ­vel enviar a mensagem.",
      )
    } finally {
      setIsSending(false)
    }
  }

  const sidebar = <UserSidebar nav={nav} active="mensagens" />
  const hasActiveConversation = !isLoading && Boolean(conv)

  return (
    <div
      className={`eo-chat-screen${hasActiveConversation ? " eo-chat-active" : ""}`}
    >
      <SidebarLayout
        className={`eo-chat-layout${hasActiveConversation ? " eo-chat-active-layout" : ""}`}
        style={{
          gridTemplateColumns: hasActiveConversation
            ? "240px minmax(0, 1fr)"
            : "220px minmax(0, 1fr)",
          gap: hasActiveConversation ? 24 : 18,
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
        }}
        sidebar={<aside className="eo-chat-sidebar">{sidebar}</aside>}
      >
        {isLoading ? (
          <div className="eo-chat-content eo-chat-state">
            <H2 style={{ marginBottom: 16 }}>Mensagens</H2>
            <p style={{ color: T.muted, fontFamily: ff.body }}>
              Carregando conversas...
            </p>
          </div>
        ) : !conv ? (
          <div
            className="eo-chat-content eo-chat-state"
            style={{ alignItems: "center", textAlign: "center" }}
          >
            <H2 style={{ marginBottom: 16 }}>Mensagens</H2>
            <EmptyState
              icon={<Icons.MessageCircle size={28} color={T.lilac} />}
              title="Nenhuma conversa"
              subtitle="As conversas sobre seus anÃºncios aparecerÃ£o aqui."
              action="Explorar itens"
              onAction={() => nav("explorar")}
            />
          </div>
        ) : (
          <div className="eo-chat-content">
          <div className="eo-chat-page-heading">
            <H2>Mensagens</H2>
          </div>
          {error && <Alert type="error">{error}</Alert>}
          <div
            className="eo-chat-card"
            style={{
              background: T.white,
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div className="eo-chat-conversations">
              {conversations.map((item, index) => (
                <button
                  key={item.id}
                  className="eo-chat-conversation"
                  onClick={() => {
                    activeConversationIdRef.current = item.id
                    shouldScrollToBottomRef.current = true
                    setConversationMessages([])
                    setMessagesConversationId(null)
                    setError("")
                    setActive(index)
                  }}
                  style={{
                    background:
                      active === index ? T.lilacFaint : "transparent",
                  }}
                >
                  <Avatar name={item.counterpartName} size={42} />
                  <div className="eo-chat-conversation-copy">
                    <div className="eo-chat-conversation-title">
                      <span>{item.counterpartName}</span>
                      <span>{item.lastMessageAt || "Agora"}</span>
                    </div>
                    <p className="eo-chat-item-name">{item.item}</p>
                    <p className="eo-chat-preview">
                      {item.lastMessage || "Inicie a conversa sobre esta troca."}
                    </p>
                  </div>
                </button>
              ))}
              {conversations.length === 0 && (
                <div className="eo-chat-no-conversations">
                  Nenhuma conversa
                </div>
              )}
            </div>

            <section className="eo-chat-panel">
              <header className="eo-chat-header">
                <Avatar name={conv.counterpartName} size={38} />
                <div className="eo-chat-contact">
                  <p>{conv.counterpartName}</p>
                  <span>Item: {conv.item}</span>
                </div>
                <Btn
                  size="sm"
                  variant="soft"
                  style={{ marginLeft: "auto", flexShrink: 0 }}
                  onClick={() => nav("detalhes-anuncio")}
                >
                  Ver anÃºncio
                </Btn>
              </header>

              <div
                className="eo-chat-messages"
                ref={messageListRef}
                onScroll={handleMessageListScroll}
              >
                {hasOlderMessages && (
                  <button
                    className="eo-chat-load-older"
                    onClick={() => void loadOlderMessages()}
                    disabled={isLoadingOlder}
                  >
                    {isLoadingOlder
                      ? "Carregando mensagens anteriores..."
                      : "Carregar mensagens anteriores"}
                  </button>
                )}
                {messagesConversationId !== conv.id ||
                conversationMessages.length === 0 ? (
                  <p className="eo-chat-empty">
                    Nenhuma mensagem ainda. Diga olÃ¡ e combine os detalhes da troca.
                  </p>
                ) : (
                  conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className="eo-chat-message-row"
                      style={{
                        justifyContent:
                          message.senderId === conv.counterpartId
                            ? "flex-start"
                            : "flex-end",
                      }}
                    >
                      <div
                        className="eo-chat-message"
                        style={{
                          background:
                            message.senderId === conv.counterpartId
                              ? T.surface
                              : T.purple,
                          color:
                            message.senderId === conv.counterpartId
                              ? T.text
                              : "#fff",
                          borderRadius:
                            message.senderId === conv.counterpartId
                              ? "4px 16px 16px 16px"
                              : "16px 4px 16px 16px",
                        }}
                      >
                        {message.body}
                        <span>{message.createdAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="eo-chat-composer">
                <input
                  value={msg}
                  onChange={(event) => setMsg(event.target.value)}
                  placeholder="Digite sua mensagem..."
                  aria-label="Digite sua mensagem"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      void sendMsg()
                    }
                  }}
                />
                <button
                  onClick={() => void sendMsg()}
                  disabled={isSending || !msg.trim()}
                  aria-label="Enviar mensagem"
                  style={{
                    opacity: isSending || !msg.trim() ? 0.55 : 1,
                  }}
                >
                  <Icons.Send size={18} color="#fff" />
                </button>
              </div>
            </section>
          </div>
          </div>
        )}
      </SidebarLayout>
    </div>
  )
}
