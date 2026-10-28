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

export function SobrePage({
  nav,
  isLoggedIn = false,
}: {
  nav: (p: Page) => void
  isLoggedIn?: boolean
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
            <SectionLabel>O que nos move</SectionLabel>
            <H2>Um jeito mais consciente de se relacionar com as coisas.</H2>
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

      <section style={{ padding: "76px 32px", background: T.surface }}>
        <Container>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div>
              <SectionLabel>Sustentabilidade</SectionLabel>
              <H2 style={{ marginBottom: 20 }}>
                Reutilização e consumo consciente.
              </H2>
              <p
                style={{
                  fontSize: 15,
                  color: T.muted,
                  lineHeight: 1.8,
                  marginBottom: 28,
                  fontFamily: ff.body,
                }}
              >
                Cada objeto que encontra um novo uso pode contribuir para a
                redução do descarte desnecessário. O Sistema de Desapego
                Consciente busca incentivar a organização de objetos e promover
                alternativas mais conscientes, conectando pessoas interessadas
                em vender ou trocar itens que ainda possuem utilidade.
              </p>
              {[
                "Redução do descarte desnecessário",
                "Incentivo à reutilização de objetos",
                "Estímulo ao consumo consciente",
                "Fortalecimento das conexões entre pessoas de Blumenau, Santa Catarina",
              ].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: T.lilacFaint,
                      border: `2px solid ${T.lilacMid}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icons.Check size={11} color={T.purple} />
                  </div>
                  <p
                    style={{ fontSize: 14, color: T.text, fontFamily: ff.body }}
                  >
                    {i}
                  </p>
                </div>
              ))}
            </div>
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=480&fit=crop&auto=format"
              alt="Materiais sendo separados para reciclagem"
              style={{
                width: "100%",
                borderRadius: 20,
                objectFit: "cover",
                height: 380,
                boxShadow: "0 18px 44px rgba(74,48,119,0.12)",
              }}
            />
          </div>
        </Container>
      </section>

      <section style={{ padding: "72px 32px", background: T.white }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <SectionLabel>Nossa equipe</SectionLabel>
            <H2>As pessoas por trás da plataforma</H2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                name: "Beatriz de Almeida",
                role: "Full-stack",
                img: "/images/beatriz-almeida.png",
              },
              {
                name: "Flávio Roberto Jorge",
                role: "Front-end e Back-end",
                img: "/images/flavio-roberto-jorge.png",
              },
              {
                name: "Gustavo Senem",
                role: "Full-stack",
                img: "/images/gustavo-senem.png",
              },
              {
                name: "Maria Antônia Farias Mendes",
                role: "Full-stack",
                img: "/images/maria-antonia-farias-mendes.png",
              },
            ].map((m) => (
              <Card key={m.name} style={{ padding: 24, textAlign: "center" }}>
                <img
                  src={m.img}
                  alt={m.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition:
                      m.name === "Beatriz de Almeida" ||
                      m.name === "Flávio Roberto Jorge" ||
                      m.name === "Gustavo Senem" ||
                      m.name === "Maria Antônia Farias Mendes"
                        ? "center 20%"
                        : undefined,
                    margin: "0 auto 14px",
                    display: "block",
                  }}
                />
                <H3 style={{ fontSize: 15, marginBottom: 4 }}>{m.name}</H3>
                <p
                  style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}
                >
                  {m.role}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {!isLoggedIn && <section
        style={{
          padding: "68px 32px",
          background: `linear-gradient(135deg, #EEE6FA, ${T.lilacFaint})`,
          textAlign: "center",
        }}
      >
        <Container style={{ maxWidth: 540 }}>
          <H2 style={{ marginBottom: 16 }}>Faça parte da mudança.</H2>
          <p
            style={{
              color: T.muted,
              fontSize: 15,
              marginBottom: 32,
              fontFamily: ff.body,
              lineHeight: 1.7,
            }}
          >
            Cada ação de desapego é um passo rumo a uma vida mais leve e
            consciente.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Btn onClick={() => nav("cadastro")}>Criar conta grátis</Btn>
          </div>
        </Container>
      </section>}
    </div>
  )
}
