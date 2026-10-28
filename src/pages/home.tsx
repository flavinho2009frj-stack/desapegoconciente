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

const benefits = [
  {
    icon: <Icons.Tag />,
    title: "Venda com facilidade",
    desc: "Anuncie o que não usa mais e encontre pessoas interessadas em sua região.",
  },
  {
    icon: <Icons.Heart />,
    title: "Doe com propósito",
    desc: "Passe adiante aquilo que está parado e pode ser útil para outra pessoa.",
  },
  {
    icon: <Icons.Repeat />,
    title: "Troque com a comunidade",
    desc: "Encontre novos itens para você por meio de trocas simples e conscientes.",
  },
  {
    icon: <Icons.Leaf />,
    title: "Consuma com consciência",
    desc: "Prolongue a vida útil dos objetos e contribua para reduzir o desperdício.",
  },
  {
    icon: <Icons.Users />,
    title: "Conecte-se com pessoas",
    desc: "Descubra oportunidades de venda, doação e troca perto de você.",
  },
  {
    icon: <Icons.Package />,
    title: "Organize seu espaço",
    desc: "Libere espaço em casa e transforme itens parados em novas oportunidades.",
  },
]

const categories = [
  { name: "Roupas", icon: <Icons.User /> },
  { name: "Calçados", icon: <Icons.Tag /> },
  { name: "Eletrônicos", icon: <Icons.BarChart /> },
  { name: "Móveis", icon: <Icons.Home /> },
  { name: "Livros", icon: <Icons.Book /> },
  { name: "Utensílios", icon: <Icons.Recycle /> },
  { name: "Outros", icon: <Icons.Package /> },
]

export function HomePage({
  nav,
  isLoggedIn = false,
}: {
  nav: (p: Page, category?: string) => void
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
                Venda, troque ou doe seus itens. Um jeito simples de liberar
                espaço e contribuir para um consumo mais consciente.
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
                  nav(o.type === "Doação" ? "pontos-coleta" : "explorar")
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
                "Encontre objetos, roupas e utensílios que você não usa mais.",
              ],
              [
                "03",
                "Escolha o que fazer",
                "Venda, doe ou troque seus itens de forma simples e consciente.",
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

      {/* Benefits */}
      <section style={{ padding: "68px 32px", background: T.white }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <SectionLabel>Por que usar</SectionLabel>
            <H2 style={{ marginBottom: 10 }}>
              Seis formas de dar um novo destino
            </H2>
            <p
              style={{
                color: T.muted,
                fontSize: 15,
                lineHeight: 1.7,
                fontFamily: ff.body,
              }}
            >
              Mais espaço em casa e boas oportunidades na comunidade.
            </p>
          </div>
          <div
            className="eo-benefits-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {benefits.map((b) => (
              <Card
                key={b.title}
                hover
                style={{
                  padding: 22,
                  minHeight: 174,
                  borderRadius: 16,
                  boxShadow: "0 3px 14px rgba(40, 24, 72, 0.035)",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    background: T.lilacFaint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  {b.icon}
                </div>
                <H3 style={{ marginBottom: 7, fontSize: 15 }}>{b.title}</H3>
                <p
                  style={{
                    fontSize: 13,
                    color: T.muted,
                    lineHeight: 1.7,
                    fontFamily: ff.body,
                  }}
                >
                  {b.desc}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section style={{ padding: "64px 32px", background: T.surface }}>
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div>
              <SectionLabel>Categorias</SectionLabel>
              <H2>Explore por categoria</H2>
              <p
                style={{
                  color: T.muted,
                  fontSize: 14,
                  marginTop: 8,
                  fontFamily: ff.body,
                }}
              >
                Encontre rapidamente o que procura.
              </p>
            </div>
            <Btn variant="outline" size="sm" onClick={() => nav("explorar")}>
              Ver todos
            </Btn>
          </div>
          <div
            className="eo-category-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => nav("explorar", category.name)}
                style={{
                  minHeight: 104,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  padding: "16px 18px",
                  borderRadius: 16,
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  boxShadow: "0 3px 12px rgba(40, 24, 72, 0.04)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: ff.body,
                  transition:
                    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-3px)"
                  event.currentTarget.style.borderColor = T.lilac
                  event.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(40, 24, 72, 0.09)"
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)"
                  event.currentTarget.style.borderColor = T.border
                  event.currentTarget.style.boxShadow =
                    "0 3px 12px rgba(40, 24, 72, 0.04)"
                }}
              >
                <span
                  style={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 13,
                    background: T.lilacFaint,
                    color: T.purple,
                  }}
                >
                  {category.icon}
                </span>
                <span
                  style={{
                    display: "flex",
                    minWidth: 0,
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <span
                    style={{ fontWeight: 600, fontSize: 14, color: T.text }}
                  >
                    {category.name}
                  </span>
                  <Icons.ChevronRight size={15} color={T.purple} />
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section style={{ padding: "64px 32px 76px", background: T.surface }}>
        <Container>
          <div
            className="eo-home-cta"
            style={{
              maxWidth: 1040,
              margin: "0 auto",
              padding: "42px 48px",
              borderRadius: 24,
              border: `1px solid ${T.border}`,
              background: `linear-gradient(120deg, ${T.lilacFaint} 0%, ${T.white} 68%)`,
              boxShadow: "0 10px 32px rgba(40, 24, 72, 0.055)",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 12px",
                  marginBottom: 16,
                  borderRadius: 999,
                  background: T.white,
                  color: T.purple,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: ff.body,
                  boxShadow: "0 2px 8px rgba(40, 24, 72, 0.05)",
                }}
              >
                <Icons.Leaf size={15} />
                {isLoggedIn
                  ? "Sua comunidade está esperando"
                  : "Faça parte da comunidade"}
              </span>
              <H2
                style={{
                  maxWidth: 620,
                  marginBottom: 14,
                  fontSize: "clamp(24px, 3vw, 34px)",
                }}
              >
                {isLoggedIn
                  ? "Que tal dar um novo destino a um item hoje?"
                  : "Dê um novo destino ao que você não usa mais."}
              </H2>
              <p
                style={{
                  maxWidth: 570,
                  color: T.muted,
                  fontSize: 15,
                  fontFamily: ff.body,
                  lineHeight: 1.75,
                }}
              >
                {isLoggedIn
                  ? "Publique seu anúncio e encontre pessoas interessadas perto de você."
                  : "Crie sua conta gratuitamente e descubra uma forma mais consciente de vender, trocar ou doar."}
              </p>
            </div>
            <div className="eo-home-cta-action">
              <div
                style={{
                  width: 58,
                  height: 58,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  borderRadius: 18,
                  background: T.white,
                  color: T.purple,
                  boxShadow: "0 4px 14px rgba(40, 24, 72, 0.07)",
                }}
              >
                {isLoggedIn ? (
                  <Icons.Package size={27} />
                ) : (
                  <Icons.Users size={27} />
                )}
              </div>
              <Btn
                size="lg"
                onClick={() => nav(isLoggedIn ? "criar-anuncio" : "cadastro")}
              >
                {isLoggedIn ? "Publicar anúncio" : "Criar minha conta"}
                <Icons.ChevronRight size={17} color="#fff" />
              </Btn>
              {!isLoggedIn && (
                <p
                  style={{
                    marginTop: 12,
                    color: T.muted,
                    fontSize: 12,
                    textAlign: "center",
                    fontFamily: ff.body,
                  }}
                >
                  Gratuito para começar
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
