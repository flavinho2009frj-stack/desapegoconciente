import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  H1,
  H2,
  H3,
  SectionLabel,
  Container,
} from "../components/ui"
import { Icons } from "../components/icons"

export function HomePage({
  nav,
  isLoggedIn = false,
}: {
  nav: (p: Page, category?: string, type?: string) => void
  isLoggedIn?: boolean
}) {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(160deg, ${T.lilacFaint} 0%, ${T.white} 60%)`,
          padding: "76px 32px 64px",
        }}
      >
        <Container>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <SectionLabel>Blumenau, Santa Catarina</SectionLabel>
              <H1 style={{ marginBottom: 22 }}>
                Dê um novo destino ao que{" "}
                <span style={{ color: T.purple }}>você não usa mais.</span>
              </H1>
              <p
                style={{
                  fontSize: 17,
                  color: T.muted,
                  lineHeight: 1.78,
                  marginBottom: 36,
                  fontFamily: ff.body,
                  maxWidth: 460,
                }}
              >
                Venda, troque ou descubra onde doar e contribua para um
                consumo mais consciente.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginBottom: 48,
                }}
              >
                <Btn
                  size="lg"
                  onClick={() => nav(isLoggedIn ? "criar-anuncio" : "cadastro")}
                >
                  {isLoggedIn ? "Publicar um item" : "Começar agora"}
                </Btn>
                <Btn
                  size="lg"
                  variant="outline"
                  onClick={() => nav("explorar")}
                >
                  Explorar itens
                </Btn>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=640&h=520&fit=crop&auto=format"
                alt="Sala organizada"
                style={{
                  width: "100%",
                  borderRadius: 24,
                  objectFit: "cover",
                  height: 420,
                  boxShadow: "0 24px 64px rgba(107,70,193,0.14)",
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Operation types */}
      <section style={{ padding: "0 32px", background: T.white }}>
        <Container>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
              transform: "translateY(-40px)",
            }}
          >
            {[
              {
                type: "Venda",
                icon: <Icons.Tag />,
                desc: "Anuncie e encontre compradores para seus itens.",
              },
              {
                type: "Troca",
                icon: <Icons.Repeat />,
                desc: "Combine uma troca com alguém da comunidade.",
              },
              {
                type: "Doação",
                icon: <Icons.Heart />,
                desc: "Doe para quem pode aproveitar o que você não usa.",
              },
            ].map((o) => (
              <Card
                key={o.type}
                hover
                onClick={() =>
                  o.type === "Doação"
                    ? nav("pontos-coleta")
                    : nav("explorar", undefined, o.type)
                }
                style={{ padding: "24px 20px", cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 10,
                  }}
                >
                  {o.icon}
                  <span
                    style={{
                      fontFamily: ff.heading,
                      fontWeight: 700,
                      fontSize: 17,
                      color: T.text,
                    }}
                  >
                    {o.type}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: T.muted,
                    lineHeight: 1.6,
                    fontFamily: ff.body,
                  }}
                >
                  {o.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="como-funciona"
        style={{
          padding: "68px 32px",
          background: T.lilacFaint,
          scrollMarginTop: 80,
        }}
      >
        <Container>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionLabel>Como funciona</SectionLabel>
            <H2 style={{ marginBottom: 10 }}>
              Seu item pode começar um novo ciclo.
            </H2>
            <p
              style={{
                color: T.muted,
                fontSize: 15,
                lineHeight: 1.7,
                fontFamily: ff.body,
              }}
            >
              Um caminho simples, do cadastro ao novo destino.
            </p>
          </div>
          <div
            className="eo-steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 18,
            }}
          >
            {[
              [
                "01",
                "Crie sua conta",
                "Cadastre-se gratuitamente e faça parte da comunidade.",
              ],
              [
                "02",
                "Cadastre seus itens",
                "Tire uma foto, descreva o objeto, a roupa ou o utensílio que você não usa mais e publique.",
              ],
              [
                "03",
                "Escolha o que fazer",
                "Venda ou troque seu item de forma simples. Para doar ou descartar, veja os pontos de coleta.",
              ],
              [
                "04",
                "Dê um novo destino",
                "Libere espaço, evite desperdícios e dê uma nova utilidade ao que estava parado.",
              ],
            ].map(([number, title, description]) => (
              <Card
                key={number}
                style={{
                  padding: 22,
                  borderRadius: 16,
                  minHeight: 190,
                  boxShadow: "0 4px 18px rgba(40, 24, 72, 0.045)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 13,
                      background: T.lilacFaint,
                      color: T.purple,
                      fontFamily: ff.heading,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {number}
                  </span>
                  <span style={{ height: 1, flex: 1, background: T.border }} />
                </div>
                <H3 style={{ marginBottom: 8, fontSize: 16 }}>{title}</H3>
                <p
                  style={{
                    color: T.muted,
                    fontSize: 13,
                    lineHeight: 1.75,
                    fontFamily: ff.body,
                  }}
                >
                  {description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
