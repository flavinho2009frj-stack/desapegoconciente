import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  H2,
  H3,
  SectionLabel,
  PageWrap,
  Container,
  LoadingSkeleton,
  EmptyState,
} from "../components/ui"
import { Icons } from "../components/icons"

export function Erro404Page({ nav }: { nav: (p: Page) => void }) {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div
          style={{
            fontSize: 96,
            fontFamily: ff.heading,
            fontWeight: 700,
            color: T.lilacMid,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </div>
        <div
          style={{
            width: 80,
            height: 4,
            background: `linear-gradient(90deg, ${T.purple}, ${T.lilac})`,
            borderRadius: 2,
            margin: "0 auto 32px",
          }}
        />
        <H2 style={{ marginBottom: 12 }}>Página não encontrada</H2>
        <p
          style={{
            color: T.muted,
            fontSize: 15,
            lineHeight: 1.7,
            fontFamily: ff.body,
            marginBottom: 40,
          }}
        >
          A página que você está procurando não existe ou foi movida. Verifique
          o endereço ou volte para a página inicial.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn size="lg" onClick={() => nav("home")}>
            Voltar ao inicio
          </Btn>
          <Btn size="lg" variant="outline" onClick={() => nav("explorar")}>
            Explorar anúncios
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function ConfirmacaoPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <PageWrap>
      <Container style={{ maxWidth: 700 }}>
        <SectionLabel>Exemplos de estados</SectionLabel>
        <H2 style={{ marginBottom: 8 }}>Confirmacoes e feedbacks</H2>
        <p
          style={{
            color: T.muted,
            marginBottom: 48,
            fontSize: 14,
            fontFamily: ff.body,
          }}
        >
          Telas de confirmação de ações importantes para o usuário.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            {
              icon: <Icons.Check size={28} color={T.success} />,
              bg: T.successBg,
              border: "#6EE7B7",
              title: "Anúncio publicado com sucesso!",
              desc: "Seu anúncio está disponível no marketplace.",
              btn: "Ver anúncio",
              btnVariant: "primary" as const,
            },
            {
              icon: <Icons.Heart size={28} color={T.purple} />,
              bg: T.lilacFaint,
              border: T.lilacMid,
              title: "Interesse registrado!",
              desc: "Você demonstrou interesse no item. O anunciante foi notificado e pode entrar em contato por mensagem.",
              btn: "Ver meus interesses",
              btnVariant: "outline" as const,
            },
            {
              icon: <Icons.Repeat size={28} color="#D97706" />,
              bg: T.warningBg,
              border: "#FCD34D",
              title: "Solicitação de troca enviada",
              desc: "Sua proposta foi enviada. Acompanhe a resposta na área de trocas.",
              btn: "Ver trocas",
              btnVariant: "soft" as const,
            },
            {
              icon: <Icons.X size={28} color={T.danger} />,
              bg: T.dangerBg,
              border: "#FCA5A5",
              title: "Objeto removido",
              desc: "O objeto foi removido da sua lista. Esta ação não pode ser desfeita.",
              btn: "Ir para meus objetos",
              btnVariant: "outline" as const,
            },
          ].map((s, i) => (
            <Card
              key={i}
              style={{
                padding: 28,
                background: s.bg,
                border: `1.5px solid ${s.border}`,
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: T.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <H3 style={{ fontSize: 15, marginBottom: 8 }}>{s.title}</H3>
                <p
                  style={{
                    color: T.muted,
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontFamily: ff.body,
                    marginBottom: 16,
                  }}
                >
                  {s.desc}
                </p>
                <Btn
                  size="sm"
                  variant={s.btnVariant}
                  onClick={() => nav("dashboard")}
                >
                  {s.btn}
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </PageWrap>
  )
}

export function EstadosVaziosPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <PageWrap>
      <Container style={{ maxWidth: 700 }}>
        <SectionLabel>Componentes</SectionLabel>
        <H2 style={{ marginBottom: 8 }}>Estados vazios</H2>
        <p
          style={{
            color: T.muted,
            marginBottom: 48,
            fontSize: 14,
            fontFamily: ff.body,
          }}
        >
          Exemplos de estados vazios e carregamentos usados no sistema.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <EmptyState
              icon={<Icons.Package size={28} color={T.lilac} />}
              title="Nenhum objeto cadastrado"
              subtitle="Comece adicionando seus objetos para organizar sua casa."
              action="Adicionar objeto"
              onAction={() => nav("adicionar-objeto")}
            />
          </Card>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <EmptyState
              icon={<Icons.Tag size={28} color={T.lilac} />}
              title="Sem anúncios publicados"
              subtitle="Crie seu primeiro anúncio e alcance compradores em Blumenau, Santa Catarina."
              action="Criar anúncio"
              onAction={() => nav("criar-anuncio")}
            />
          </Card>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <EmptyState
              icon={<Icons.MessageCircle size={28} color={T.lilac} />}
              title="Caixa de mensagens vazia"
              subtitle="Inicie uma conversa com anunciantes para negociar itens."
              action="Explorar marketplace"
              onAction={() => nav("explorar")}
            />
          </Card>
        </div>

        <div style={{ marginTop: 40 }}>
          <H3 style={{ marginBottom: 20, fontSize: 16 }}>
            Estruturas de carregamento
          </H3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {[1, 2].map((i) => (
              <Card key={i} style={{ padding: 20 }}>
                <LoadingSkeleton
                  height={140}
                  style={{ marginBottom: 14, borderRadius: 10 }}
                />
                <LoadingSkeleton
                  height={16}
                  width="70%"
                  style={{ marginBottom: 10 }}
                />
                <LoadingSkeleton
                  height={12}
                  width="50%"
                  style={{ marginBottom: 10 }}
                />
                <LoadingSkeleton height={12} width="40%" />
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </PageWrap>
  )
}

export function LoadingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: T.lilacFaint,
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <span
          style={{
            fontFamily: ff.heading,
            fontWeight: 700,
            fontSize: 26,
            color: T.purple,
          }}
        >
          Essencia
        </span>
        <span
          style={{
            fontFamily: ff.heading,
            fontWeight: 300,
            fontSize: 26,
            color: T.lilac,
          }}
        >
          {" "}
          Organizada
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: T.purple,
              opacity: 0.3,
              animation: `pulse 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
      <p
        style={{
          marginTop: 20,
          color: T.muted,
          fontSize: 14,
          fontFamily: ff.body,
        }}
      >
        Carregando...
      </p>
    </div>
  )
}
