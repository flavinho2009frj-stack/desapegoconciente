import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  H2,
  H3,
  SectionLabel,
  PageWrap,
  Container,
} from "../components/ui"
import { Icons } from "../components/icons"

export function PontosColetaPage() {
  const mapsSearchUrl =
    "https://www.google.com/maps/search/locais+de+doa%C3%A7%C3%A3o+e+descarte+em+blumenau+santa+catarina/@-26.8924941,-49.0934178,12z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDkyOC4wIKXMDSoASAFQAw%3D%3D"
  const mapsEmbedUrl =
    "https://maps.google.com/maps?q=locais+de+doa%C3%A7%C3%A3o+e+descarte+em+blumenau+santa+catarina&ll=-26.8924941,-49.0934178&z=12&output=embed"

  return (
    <PageWrap>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <SectionLabel>Doação</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>
            Locais de doação e descarte em Blumenau
          </H2>
          <p style={{ color: T.muted, fontSize: 15, fontFamily: ff.body }}>
            Veja no Google Maps locais de doação e descarte em Blumenau.
          </p>
        </div>
        <a
          href={mapsSearchUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: T.purple,
            color: T.white,
            borderRadius: 8,
            padding: "11px 16px",
            textDecoration: "none",
            fontFamily: ff.body,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Icons.MapPin size={17} color="currentColor" /> Abrir no Google Maps
        </a>
      </div>
      <div
        style={{
          width: "100%",
          height: "min(68vh, 680px)",
          minHeight: 420,
          overflow: "hidden",
          borderRadius: 12,
          border: `1px solid ${T.border}`,
        }}
      >
        <iframe
          title="Locais de doação e descarte em Blumenau no Google Maps"
          src={mapsEmbedUrl}
          style={{ width: "100%", height: "100%", border: 0 }}
          loading="eager"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p
        style={{
          color: T.muted,
          fontSize: 12,
          marginTop: 12,
          fontFamily: ff.body,
        }}
      >
        Confira no Maps os itens aceitos e o horário de atendimento de cada
        local antes de ir.
      </p>
    </PageWrap>
  )
}

export function ServicosPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div>
      <section style={{ padding: "72px 32px", background: T.lilacFaint }}>
        <Container style={{ maxWidth: 640, textAlign: "center" }}>
          <SectionLabel>Pacotes</SectionLabel>
          <H2 style={{ marginBottom: 16 }}>Serviços e pacotes premium</H2>
          <p
            style={{
              color: T.muted,
              fontSize: 16,
              lineHeight: 1.75,
              fontFamily: ff.body,
            }}
          >
            Organize seu lar com apoio profissional. Pacotes pensados para cada
            necessidade e realidade.
          </p>
        </Container>
      </section>

      <section style={{ padding: "56px 32px", background: T.white }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <SectionLabel>Desapego consciente</SectionLabel>
            <H2>Escolha um novo destino para seus itens.</H2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                title: "Venda",
                icon: <Icons.Tag size={22} color={T.purple} />,
                text: "Encontre alguém que valorize o que você já não usa.",
                action: "Criar anúncio",
                page: "criar-anuncio" as Page,
              },
              {
                title: "Doação",
                icon: <Icons.Heart size={22} color={T.success} />,
                text: "Compartilhe itens em bom estado com a comunidade.",
                action: "Oferecer item",
                page: "criar-anuncio" as Page,
              },
              {
                title: "Troca",
                icon: <Icons.Repeat size={22} color={T.warning} />,
                text: "Renove sem comprar: combine uma troca local.",
                action: "Propor troca",
                page: "criar-anuncio" as Page,
              },
              {
                title: "Descarte",
                icon: <Icons.Recycle size={22} color={T.success} />,
                text: "Consulte locais adequados para cada material.",
                action: "Ver pontos",
                page: "pontos-coleta" as Page,
              },
            ].map((service) => (
              <Card
                key={service.title}
                style={{
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: T.lilacFaint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  {service.icon}
                </div>
                <H3 style={{ fontSize: 16, marginBottom: 6 }}>
                  {service.title}
                </H3>
                <p
                  style={{
                    color: T.muted,
                    fontSize: 13,
                    lineHeight: 1.65,
                    fontFamily: ff.body,
                    flex: 1,
                    marginBottom: 16,
                  }}
                >
                  {service.text}
                </p>
                <Btn size="sm" variant="soft" onClick={() => nav(service.page)}>
                  {service.action}
                </Btn>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export function DepoimentosPage() {
  const deps = [
    {
      name: "Beatriz Müller",
      role: "Blumenau, Santa Catarina",
      rating: 5,
      text: "Finalmente consegui organizar meu apartamento depois de anos tentando sozinha. A plataforma foi um divisor de águas!",
    },
    {
      name: "Lucas Hoffmann",
      role: "Blumenau, Santa Catarina",
      rating: 5,
      text: "Doei um computador antigo e fiz a diferença. A plataforma é fácil de usar, e a equipe é muito atenciosa.",
    },
    {
      name: "Camila Schulz",
      role: "Blumenau, Santa Catarina",
      rating: 5,
      text: "O planner me ajudou a criar um hábito de organização que mantenho há três meses. Recomendo!",
    },
    {
      name: "Rafael Wittke",
      role: "Blumenau, Santa Catarina",
      rating: 4,
      text: "Vendi minha bicicleta em dois dias e consegui dinheiro para comprar algo de que realmente precisava.",
    },
    {
      name: "Juliana Kern",
      role: "Blumenau, Santa Catarina",
      rating: 5,
      text: "A roleta de tarefas é incrível! Ela me ajuda quando não sei por onde começar a organização.",
    },
    {
      name: "Pedro Bauer",
      role: "Blumenau, Santa Catarina",
      rating: 5,
      text: "Troquei livros por utensílios de cozinha. O processo é simples, seguro e muito prático.",
    },
  ]
  return (
    <PageWrap>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <SectionLabel>Comunidade</SectionLabel>
        <H2>O que nossa comunidade diz</H2>
        <p
          style={{
            color: T.muted,
            marginTop: 12,
            fontSize: 15,
            fontFamily: ff.body,
          }}
        >
          Mais de 1.200 usuários já transformaram sua relação com os objetos em
          Blumenau, Santa Catarina.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 18,
        }}
      >
        {deps.map((d) => (
          <Card key={d.name} hover style={{ padding: 28 }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
              {Array.from({ length: d.rating }).map((_, i) => (
                <Icons.Star key={i} size={14} color={T.warning} />
              ))}
            </div>
            <p
              style={{
                fontSize: 14,
                color: T.muted,
                lineHeight: 1.78,
                marginBottom: 20,
                fontFamily: ff.body,
              }}
            >
              "{d.text}"
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderTop: `1px solid ${T.border}`,
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: T.lilacFaint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.User size={18} color={T.lilac} />
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: T.text,
                    fontFamily: ff.heading,
                  }}
                >
                  {d.name}
                </p>
                <p
                  style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}
                >
                  {d.role}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageWrap>
  )
}
