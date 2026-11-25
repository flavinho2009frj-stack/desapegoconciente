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

export function SobrePage({
  nav,
}: {
  nav: (p: Page) => void
}) {
  return (
    <div>
      <section
        style={{
          padding: "72px 32px",
          background: `linear-gradient(135deg, ${T.lilacFaint} 0%, #EEE6FA 55%, #E6D9F6 100%)`,
          overflow: "hidden",
        }}
      >
        <Container>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.02fr 0.98fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <SectionLabel>Nossa história · Blumenau, SC</SectionLabel>
              <H1 style={{ maxWidth: 560, marginBottom: 20 }}>
                Menos excessos. Mais espaço para o que importa.
              </H1>
              <p
                style={{
                  maxWidth: 530,
                  fontSize: 16,
                  color: T.muted,
                  lineHeight: 1.8,
                  fontFamily: ff.body,
                  marginBottom: 28,
                }}
              >
                A Essência Organizada foi criada com o propósito de incentivar o
                desapego consciente e facilitar a organização de objetos que já
                não são mais utilizados. A plataforma conecta pessoas
                interessadas em vender ou trocar itens que ainda possuem
                utilidade e apresenta pontos de doação existentes em Blumenau,
                contribuindo para que cada objeto possa encontrar um novo
                destino.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Btn onClick={() => nav("cadastro")}>
                  Faça parte da comunidade
                </Btn>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                minHeight: 360,
                padding: "0 18px 18px 0",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "22px 0 0 24px",
                  borderRadius: 24,
                  background: T.purple,
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&h=700&fit=crop&auto=format"
                alt="Ambiente organizado, claro e acolhedor"
                style={{
                  position: "relative",
                  width: "100%",
                  height: 360,
                  borderRadius: 24,
                  objectFit: "cover",
                  boxShadow: "0 20px 50px rgba(74,48,119,0.18)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  maxWidth: 230,
                  padding: "16px 20px",
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 14,
                  boxShadow: "0 12px 30px rgba(74,48,119,0.12)",
                }}
              >
                <p
                  style={{
                    color: T.purple,
                    fontFamily: ff.heading,
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 4,
                  }}
                >
                  Um novo ciclo começa em casa
                </p>
                <p
                  style={{
                    color: T.muted,
                    fontFamily: ff.body,
                    fontSize: 12,
                    lineHeight: 1.55,
                  }}
                >
                  Organizar também pode ser compartilhar, reutilizar e acolher.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section style={{ padding: "76px 32px", background: T.white }}>
        <Container>
          <div style={{ maxWidth: 620, marginBottom: 34 }}>
            <H2>O que nos move</H2>
            <p
              style={{
                color: T.muted,
                fontSize: 15,
                lineHeight: 1.7,
                fontFamily: ff.body,
              }}
            >
              Mais cuidado com o que temos, mais atenção ao que descartamos.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 22,
            }}
          >
            {[
              {
                number: "01",
                title: "Nossa missão",
                text: "Facilitar o desapego consciente em Blumenau, conectando pessoas interessadas em vender ou trocar objetos que ainda possuem utilidade, além de apresentar pontos de doação existentes na cidade.",
              },
              {
                number: "02",
                title: "Nossa visão",
                text: "Contribuir para uma cultura de organização, reutilização e consumo consciente, aproximando pessoas e incentivando novas possibilidades para objetos que não são mais utilizados.",
              },
              {
                number: "03",
                title: "Nossos valores",
                text: "Consciência ambiental, comunidade, simplicidade, acessibilidade e transparência orientam o desenvolvimento e o funcionamento da plataforma.",
              },
            ].map((v) => (
              <Card
                key={v.title}
                style={{
                  padding: 28,
                  background: `linear-gradient(145deg, ${T.white}, ${T.lilacFaint})`,
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    color: T.purple,
                    fontFamily: ff.heading,
                    fontWeight: 700,
                    fontSize: 13,
                    marginBottom: 22,
                  }}
                >
                  {v.number}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: 34,
                      height: 1,
                      background: T.lilacMid,
                      verticalAlign: "middle",
                      marginLeft: 8,
                    }}
                  />
                </p>
                <H3 style={{ marginBottom: 10 }}>{v.title}</H3>
                <p
                  style={{
                    fontSize: 14,
                    color: T.muted,
                    lineHeight: 1.8,
                    fontFamily: ff.body,
                  }}
                >
                  {v.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>


    </div>
  )
}
