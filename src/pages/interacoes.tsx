import { useEffect, useState } from "react"
import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  H2,
  SectionLabel,
  PageWrap,
  Tag,
  EmptyState,
  Avatar,
  Alert,
} from "../components/ui"
import { Icons } from "../components/icons"
import { SidebarLayout, UserSidebar } from "../components/layout"
import {
  apiRequest,
  getAuthToken,
  type ApiAdRequest,
  type ApiConversation,
  type ApiMessage,
} from "../lib/api"

export function MeusInteressesPage({ nav }: { nav: (p: Page) => void }) {
  const [requests, setRequests] = useState<ApiAdRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!getAuthToken()) {
      nav("login")
      return
    }
    let active = true
    apiRequest<{ requests: ApiAdRequest[] }>("/requests/mine?type=INTERESSE")
      .then((result) => {
        if (active) setRequests(result.requests)
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar seus interesses.",
          )
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [nav])

  return (
    <PageWrap>
      <SidebarLayout
        sidebar={<UserSidebar nav={nav} active="meus-interesses" />}
      >
        <div>
          <SectionLabel>Interesses</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>Meus interesses</H2>
          <p
            style={{
              color: T.muted,
              marginBottom: 32,
              fontSize: 15,
              fontFamily: ff.body,
            }}
          >
            Anúncios nos quais você demonstrou interesse.
          </p>

          {error && <Alert type="error">{error}</Alert>}
          {isLoading ? (
            <p style={{ padding: 32, textAlign: "center", color: T.muted }}>
              Carregando interesses...
            </p>
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<Icons.Heart size={28} color={T.lilac} />}
              title="Nenhum interesse registrado"
              subtitle="Demonstre interesse em um anúncio ativo para registrar uma solicitação."
              action="Explorar anúncios"
              onAction={() => nav("explorar")}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {requests.map((item) => (
                <Card
                  key={item.id}
                  style={{
                    padding: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <Icons.Heart size={20} color={T.purple} />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: ff.heading,
                        fontWeight: 600,
                        color: T.text,
                      }}
                    >
                      {item.adTitle}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: T.muted,
                        fontFamily: ff.body,
                      }}
                    >
                      Anunciante: {item.counterpartName} · {item.createdAt}
                    </p>
                  </div>
                  <Tag
                    label={
                      item.status === "PENDENTE" ? "Pendente" : item.status
                    }
                    color={item.status === "PENDENTE" ? "amber" : "gray"}
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

export function SolicitacaoTrocaPage({ nav }: { nav: (p: Page) => void }) {
  const [tab, setTab] = useState("Recebidas")
  const [requests, setRequests] = useState<ApiAdRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [receivedCount, setReceivedCount] = useState(0)
  const [sentCount, setSentCount] = useState(0)

  useEffect(() => {
    if (!getAuthToken()) {
      nav("login")
      return
    }
    let active = true
    setIsLoading(true)
    setError("")
    Promise.all([
      apiRequest<{ requests: ApiAdRequest[] }>(
        "/requests/mine?direction=received&type=TROCA",
      ),
      apiRequest<{ requests: ApiAdRequest[] }>(
        "/requests/mine?direction=sent&type=TROCA",
      ),
    ])
      .then(([received, sent]) => {
        if (!active) return
        setReceivedCount(received.requests.length)
        setSentCount(sent.requests.length)
        setRequests(tab === "Recebidas" ? received.requests : sent.requests)
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar as solicitações de troca.",
          )
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [nav, tab])

  return (
    <PageWrap>
      <SidebarLayout
        sidebar={<UserSidebar nav={nav} active="solicitacao-troca" />}
      >
        <div>
          <SectionLabel>Trocas</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>Solicitacoes de troca</H2>
          <p
            style={{
              color: T.muted,
              marginBottom: 32,
              fontSize: 15,
              fontFamily: ff.body,
            }}
          >
            Gerencie as propostas de troca que você recebeu ou enviou.
          </p>

          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 24,
              background: T.surface,
              borderRadius: 12,
              padding: 4,
              width: "fit-content",
            }}
          >
            {[["Recebidas", receivedCount], ["Enviadas", sentCount]].map(([t, count]) => (
              <button
                key={t}
                onClick={() => setTab(String(t))}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: tab === t ? T.white : "transparent",
                  color: tab === t ? T.purple : T.muted,
                  fontWeight: tab === t ? 600 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: ff.body,
                  transition: "all 0.15s",
                }}
              >
                {t} ({count})
              </button>
            ))}
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {isLoading ? (
            <p style={{ padding: 32, textAlign: "center", color: T.muted }}>
              Carregando solicitações...
            </p>
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<Icons.Repeat size={28} color={T.lilac} />}
              title={tab === "Recebidas" ? "Nenhuma proposta recebida" : "Nenhuma proposta enviada"}
              subtitle={
                tab === "Recebidas"
                  ? "Quando alguém propuser uma troca em um dos seus anúncios, a proposta aparecerá aqui."
                  : "As propostas de troca que você enviar a outros anúncios aparecerão aqui."
              }
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {requests.map((item) => (
                <Card key={item.id} style={{ padding: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <Avatar name={item.counterpartName} size={40} />
                      <div>
                        <p
                          style={{
                            fontFamily: ff.heading,
                            fontWeight: 600,
                            fontSize: 15,
                            color: T.text,
                          }}
                        >
                          {item.adTitle}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: T.muted,
                            fontFamily: ff.body,
                          }}
                        >
                          {tab === "Recebidas" ? "De" : "Para"}:{" "}
                          {item.counterpartName} · {item.createdAt}
                        </p>
                      </div>
                    </div>
                    <Tag
                      label={
                        item.status === "PENDENTE"
                          ? "Pendente"
                          : item.status === "ACEITA"
                            ? "Aceita"
                            : item.status === "RECUSADA"
                              ? "Recusada"
                              : item.status
                      }
                      color={
                        item.status === "PENDENTE"
                          ? "amber"
                          : item.status === "ACEITA"
                            ? "green"
                            : item.status === "RECUSADA"
                              ? "red"
                              : "gray"
                      }
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      background: T.surface,
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        color: T.muted,
                        fontFamily: ff.body,
                      }}
                    >
                      Solicitação de troca{" "}
                      {tab === "Recebidas" ? "recebida" : "enviada"} para este
                      anúncio.
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

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
  const [msg, setMsg] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const conv = conversations[active]

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
        if (initialAdId !== null && initialAdId !== undefined) {
          const conversationIndex = result.conversations.findIndex(
            (conversation) => conversation.adId === initialAdId,
          )
          if (conversationIndex >= 0) setActive(conversationIndex)
        }
      })
      .catch((requestError) => {
        if (mounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "NÃ£o foi possÃ­vel carregar suas conversas.",
          )
        }
      })
      .finally(() => mounted && setIsLoading(false))
    return () => {
      mounted = false
    }
  }, [nav])

  useEffect(() => {
    if (!conv) return
    let mounted = true
    const loadMessages = () => {
      apiRequest<{ messages: ApiMessage[] }>(`/messages?adId=${conv.adId}`)
        .then((result) => mounted && setConversationMessages(result.messages))
        .catch((requestError) => {
          if (mounted) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "NÃ£o foi possÃ­vel carregar as mensagens.",
            )
          }
        })
    }
    setConversationMessages([])
    loadMessages()
    const interval = window.setInterval(loadMessages, 5000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [conv])

  const sendMsg = async () => {
    if (!conv || !msg.trim() || isSending) return
    setIsSending(true)
    setError("")
    try {
      const result = await apiRequest<{ message: ApiMessage }>("/messages", {
        method: "POST",
        body: JSON.stringify({ adId: conv.adId, body: msg.trim() }),
      })
      setConversationMessages((current) => [...current, result.message])
      setConversations((current) =>
        current.map((item) =>
          item.id === conv.id
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
          : "NÃ£o foi possÃ­vel enviar a mensagem.",
      )
    } finally {
      setIsSending(false)
    }
  }

  const sidebar = <UserSidebar nav={nav} active="mensagens" />

  if (isLoading) {
    return (
      <PageWrap>
        <SidebarLayout sidebar={sidebar}>
          <div style={{ padding: "52px 32px", maxWidth: 760, margin: "0 auto" }}>
            <SectionLabel>Chat</SectionLabel>
            <H2 style={{ marginBottom: 24 }}>Mensagens</H2>
            <p style={{ color: T.muted, fontFamily: ff.body }}>Carregando conversas...</p>
          </div>
        </SidebarLayout>
      </PageWrap>
    )
  }

  if (!conv) {
    return (
      <PageWrap>
        <SidebarLayout sidebar={sidebar}>
          <div style={{ padding: "52px 32px", maxWidth: 760, margin: "0 auto" }}>
        <SectionLabel>Chat</SectionLabel>
        <H2 style={{ marginBottom: 24 }}>Mensagens</H2>
        <EmptyState
          icon={<Icons.MessageCircle size={28} color={T.lilac} />}
          title="Nenhuma conversa"
          subtitle="As conversas sobre seus anúncios aparecerão aqui."
          action="Explorar itens"
          onAction={() => nav("explorar")}
        />
          </div>
        </SidebarLayout>
      </PageWrap>
    )
  }

  return (
    <PageWrap>
      <SidebarLayout sidebar={sidebar}>
        <div style={{ padding: "52px 32px", maxWidth: 1000, margin: "0 auto" }}>
          <SectionLabel>Chat</SectionLabel>
          <H2 style={{ marginBottom: 24 }}>Mensagens</H2>
          {error && <Alert type="error">{error}</Alert>}
          <Card
        style={{
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          height: 540,
        }}
      >
        {/* Lista */}
        <div
          style={{ borderRight: `1px solid ${T.border}`, overflowY: "auto" }}
        >
          {conversations.map((c, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                display: "flex",
                gap: 12,
                padding: "16px 18px",
                width: "100%",
                textAlign: "left",
                border: "none",
                borderBottom: `1px solid ${T.border}`,
                background: active === i ? T.lilacFaint : "transparent",
                cursor: "pointer",
                fontFamily: ff.body,
                transition: "background 0.15s",
              }}
            >
              <Avatar name={c.counterpartName} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: T.text,
                      fontFamily: ff.heading,
                    }}
                  >
                    {c.counterpartName}
                  </span>
                  <span style={{ fontSize: 11, color: T.muted }}>{c.lastMessageAt || "Agora"}</span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: T.purple,
                    fontFamily: ff.body,
                    marginBottom: 2,
                  }}
                >
                  {c.item}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.lastMessage || "Inicie a conversa sobre esta troca."}
                </p>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: T.muted,
                fontSize: 14,
              }}
            >
              Nenhuma conversa
            </div>
          )}
        </div>

        {/* Chat */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Avatar name={conv.counterpartName} size={38} />
            <div>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: T.text,
                  fontFamily: ff.heading,
                }}
              >
                {conv.counterpartName}
              </p>
              <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>
                Item: {conv.item}
              </p>
            </div>
            <Btn
              size="sm"
              variant="soft"
              style={{ marginLeft: "auto" }}
              onClick={() => nav("detalhes-anuncio")}
            >
              Ver anúncio
            </Btn>
          </div>

          <div
            style={{
              flex: 1,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              overflowY: "auto",
            }}
          >
            {conversationMessages.length === 0 ? (
              <p style={{ color: T.muted, fontFamily: ff.body, fontSize: 14, textAlign: "center", margin: "auto 0" }}>
                Nenhuma mensagem ainda. Diga olÃ¡ e combine os detalhes da troca.
              </p>
            ) : conversationMessages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent: message.senderId === conv.counterpartId ? "flex-start" : "flex-end",
                }}
              >
                <div
                  style={{
                    maxWidth: "72%",
                    background: message.senderId === conv.counterpartId ? T.surface : T.purple,
                    color: message.senderId === conv.counterpartId ? T.text : "#fff",
                    borderRadius:
                      message.senderId === conv.counterpartId ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                    padding: "10px 14px",
                    fontSize: 14,
                    fontFamily: ff.body,
                    lineHeight: 1.55,
                  }}
                >
                  {message.body}
                  <span style={{ display: "block", marginTop: 5, fontSize: 10, opacity: 0.65 }}>
                    {message.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "14px 18px",
              borderTop: `1px solid ${T.border}`,
              display: "flex",
              gap: 10,
            }}
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void sendMsg()
                }
              }}
              style={{
                flex: 1,
                padding: "11px 14px",
                borderRadius: 10,
                border: `1.5px solid ${T.borderMid}`,
                fontSize: 14,
                fontFamily: ff.body,
                outline: "none",
              }}
            />
            <button
              onClick={sendMsg}
              disabled={isSending || !msg.trim()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: T.purple,
                border: "none",
                cursor: isSending || !msg.trim() ? "not-allowed" : "pointer",
                opacity: isSending || !msg.trim() ? 0.55 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.Send size={18} color="#fff" />
            </button>
          </div>
        </div>
          </Card>
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}
