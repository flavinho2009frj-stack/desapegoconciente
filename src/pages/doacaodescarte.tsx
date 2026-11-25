import { useState } from "react"
import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  Field,
  Select,
  Textarea,
  H2,
  H3,
  SectionLabel,
  PageWrap,
  StatCard,
  ProgressBar,
  UploadBox,
  Tag,
  EmptyState,
} from "../components/ui"
import { Icons } from "../components/icons"
import { SidebarLayout, UserSidebar } from "../components/layout"

type UserObject = {
  id: number
  name: string
  cat: string
  condition: string
  room: string
  status: string
  img: string
}
const myObjects: UserObject[] = []

const rooms = [
  "Sala",
  "Cozinha",
  "Quarto",
  "Banheiro",
  "Escritório",
  "Garagem",
  "Outros",
]

export function OrganizacaoPage({ nav }: { nav: (p: Page) => void }) {
  const [selRoom, setSelRoom] = useState("Sala")
  const roomItems = myObjects.filter((o) => o.room === selRoom)

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="organizacao" />}>
        <div>
          <SectionLabel>Organização</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>Seu lar, organizado com intenção.</H2>
          <p
            style={{
              color: T.muted,
              marginBottom: 32,
              fontSize: 15,
              fontFamily: ff.body,
            }}
          >
            Gerencie cada cômodo e visualize o progresso da sua organização.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
              marginBottom: 32,
            }}
          >
            <StatCard label="Total de objetos" value={0} sub="Em 0 cômodos" />
            <StatCard
              label="Sem uso"
              value={0}
              sub="Sem objetos cadastrados"
              color={T.warning}
            />
            <StatCard
              label="Destinados"
              value={0}
              sub="Sem dados disponíveis"
              color={T.success}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.muted,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  fontFamily: ff.body,
                }}
              >
                Cômodos
              </p>
              {rooms.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelRoom(r)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: selRoom === r ? T.lilacFaint : "transparent",
                    color: selRoom === r ? T.purple : T.muted,
                    fontFamily: ff.body,
                    fontSize: 13,
                    fontWeight: selRoom === r ? 600 : 400,
                    cursor: "pointer",
                    marginBottom: 4,
                    transition: "all 0.15s",
                  }}
                >
                  <span>{r}</span>
                  <span>{myObjects.filter((o) => o.room === r).length}</span>
                </button>
              ))}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <H3 style={{ fontSize: 16 }}>{selRoom}</H3>
                <Btn size="sm" onClick={() => nav("adicionar-objeto")}>
                  + Adicionar objeto
                </Btn>
              </div>
              {roomItems.length === 0 ? (
                <EmptyState
                  icon={<Icons.Package size={28} color={T.lilac} />}
                  title="Cômodo vazio"
                  subtitle="Nenhum objeto cadastrado neste cômodo."
                  action="Adicionar objeto"
                  onAction={() => nav("adicionar-objeto")}
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 14,
                  }}
                >
                  {roomItems.map((o) => {
                    const sc =
                      o.status === "Publicado"
                        ? "purple"
                        : o.status === "Sem uso"
                          ? "amber"
                          : "gray"
                    return (
                      <Card
                        key={o.id}
                        hover
                        style={{ overflow: "hidden", cursor: "pointer" }}
                      >
                        <img
                          src={o.img}
                          alt={o.name}
                          style={{
                            width: "100%",
                            height: 120,
                            objectFit: "cover",
                            background: T.lilacFaint,
                          }}
                        />
                        <div style={{ padding: "12px 14px" }}>
                          <p
                            style={{
                              fontFamily: ff.heading,
                              fontWeight: 600,
                              fontSize: 14,
                              color: T.text,
                              marginBottom: 4,
                            }}
                          >
                            {o.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: T.muted,
                              marginBottom: 8,
                              fontFamily: ff.body,
                            }}
                          >
                            {o.condition}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              alignItems: "center",
                            }}
                          >
                            <Tag label={o.status} color={sc as any} />
                            <button
                              onClick={() => nav("destino-objeto")}
                              style={{
                                marginLeft: "auto",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: T.purple,
                                fontSize: 11,
                                fontWeight: 600,
                                fontFamily: ff.body,
                              }}
                            >
                              Destinar
                            </button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <Card style={{ padding: 28 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 24,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=240&fit=crop&auto=format"
                alt="Antes"
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1556909190-8fe1d287d0c3?w=500&h=240&fit=crop&auto=format"
                alt="Depois"
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              {["Antes", "Depois"].map((l) => (
                <p
                  key={l}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 12,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {l}
                </p>
              ))}
            </div>
            <ProgressBar
              label="Progresso de organização"
              value={68}
              max={100}
            />
          </Card>
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

export function AdicionarObjetoPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <PageWrap style={{ maxWidth: 700 }}>
      <button
        onClick={() => nav("meus-objetos")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: T.purple,
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: ff.body,
        }}
      >
        <Icons.ChevronLeft size={16} color={T.purple} /> Voltar
      </button>
      <SectionLabel>Novo objeto</SectionLabel>
      <H2 style={{ marginBottom: 8 }}>Adicionar objeto</H2>
      <p
        style={{
          color: T.muted,
          marginBottom: 36,
          fontSize: 15,
          fontFamily: ff.body,
        }}
      >
        Cadastre um novo objeto para organizar sua casa.
      </p>
      <Card style={{ padding: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <UploadBox label="Adicionar fotos do objeto" />
          <Field
            label="Nome do objeto"
            placeholder="Ex: Sofa 3 lugares cinza"
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Select
              label="Categoria"
              options={[
                "Roupas",
                "Móveis",
                "Eletrônicos",
                "Utensílios",
                "Livros",
                "Outros",
              ]}
            />
            <Select
              label="Cômodo"
              options={[
                "Sala",
                "Cozinha",
                "Quarto",
                "Banheiro",
                "Escritório",
                "Garagem",
                "Outros",
              ]}
            />
          </div>
          <Textarea
            label="Descrição"
            placeholder="Descreva o objeto, dimensões, marca e observações..."
          />
          <Select
            label="Estado de conservação"
            options={[
              "Novo com etiqueta",
              "Novo sem uso",
              "Ótimo estado",
              "Bom estado",
              "Com avarias",
            ]}
          />
          <Select
            label="Status de uso"
            options={[
              "Em uso",
              "Sem uso ha menos de 90 dias",
              "Sem uso ha mais de 90 dias",
            ]}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <Btn full onClick={() => nav("meus-objetos")}>
              Cadastrar objeto
            </Btn>
            <Btn full variant="outline" onClick={() => nav("destino-objeto")}>
              Cadastrar e destinar
            </Btn>
          </div>
        </div>
      </Card>
    </PageWrap>
  )
}

export function MeusObjetosPage({ nav }: { nav: (p: Page) => void }) {
  const [filter, setFilter] = useState("Todos")
  const filters = ["Todos", "Em uso", "Sem uso", "Publicado"]
  const shown =
    filter === "Todos"
      ? myObjects
      : myObjects.filter((o) => o.status === filter)

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="meus-objetos" />}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            <div>
              <SectionLabel>Inventario</SectionLabel>
              <H2 style={{ marginBottom: 4 }}>Meus objetos</H2>
              <p style={{ color: T.muted, fontSize: 15, fontFamily: ff.body }}>
                {myObjects.length} objetos cadastrados
              </p>
            </div>
            <Btn onClick={() => nav("adicionar-objeto")}>+ Novo objeto</Btn>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: ff.body,
                  background: filter === f ? T.purple : T.white,
                  color: filter === f ? "#fff" : T.muted,
                  border: `1.5px solid ${filter === f ? T.purple : T.border}`,
                  transition: "all 0.15s",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <EmptyState
              icon={<Icons.Package size={28} color={T.lilac} />}
              title="Nenhum objeto encontrado"
              subtitle="Ajuste os filtros ou cadastre um novo objeto."
              action="Adicionar objeto"
              onAction={() => nav("adicionar-objeto")}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {shown.map((o) => {
                const sc =
                  o.status === "Publicado"
                    ? "purple"
                    : o.status === "Sem uso"
                      ? "amber"
                      : "gray"
                return (
                  <Card key={o.id} style={{ padding: 18 }}>
                    <div
                      style={{ display: "flex", gap: 16, alignItems: "center" }}
                    >
                      <img
                        src={o.img}
                        alt={o.name}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: 12,
                          objectFit: "cover",
                          flexShrink: 0,
                          background: T.lilacFaint,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <p
                            style={{
                              fontFamily: ff.heading,
                              fontWeight: 600,
                              fontSize: 15,
                              color: T.text,
                            }}
                          >
                            {o.name}
                          </p>
                          <Tag label={o.status} color={sc as any} />
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: T.muted,
                            fontFamily: ff.body,
                          }}
                        >
                          {o.cat} · {o.condition} · {o.room}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <Btn
                          variant="soft"
                          size="sm"
                          onClick={() => nav("destino-objeto")}
                        >
                          Destinar
                        </Btn>
                        <button
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: `1px solid ${T.border}`,
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icons.Edit size={14} color={T.muted} />
                        </button>
                        <button
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            border: `1px solid #FCA5A5`,
                            background: T.dangerBg,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icons.Trash size={14} color={T.danger} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

export function DestinoObjetoPage({ nav }: { nav: (p: Page) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const opcoes = [
    {
      key: "venda",
      icon: <Icons.Tag size={28} color={T.purple} />,
      title: "Vender",
      desc: "Transforme em renda. Defina o preço e publique um anúncio.",
    },
    {
      key: "doacao",
      icon: <Icons.Heart size={28} color={T.success} />,
      title: "Doar",
      desc: "Beneficie quem precisa. O item será oferecido gratuitamente.",
    },
    {
      key: "troca",
      icon: <Icons.Repeat size={28} color={T.warning} />,
      title: "Trocar",
      desc: "Encontre algo em troca. Defina o que você quer receber.",
    },
    {
      key: "reciclagem",
      icon: <Icons.Recycle size={28} color={T.success} />,
      title: "Reciclar",
      desc: "Descarte corretamente. Indicamos pontos de coleta próximos.",
    },
  ]
  return (
    <PageWrap style={{ maxWidth: 700 }}>
      <button
        onClick={() => nav("meus-objetos")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: T.purple,
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: ff.body,
        }}
      >
        <Icons.ChevronLeft size={16} color={T.purple} /> Voltar
      </button>
      <SectionLabel>Destino</SectionLabel>
      <H2 style={{ marginBottom: 8 }}>Qual é o destino deste objeto?</H2>
      <p
        style={{
          color: T.muted,
          marginBottom: 36,
          fontSize: 15,
          fontFamily: ff.body,
        }}
      >
        Escolha a melhor opção para seu item e contribua para um consumo mais
        consciente.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {opcoes.map((o) => (
          <button
            key={o.key}
            onClick={() => setSelected(o.key)}
            style={{
              padding: 24,
              borderRadius: 16,
              border: `2px solid ${selected === o.key ? T.purple : T.border}`,
              background: selected === o.key ? T.lilacFaint : T.white,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.18s",
              fontFamily: ff.body,
            }}
          >
            <div style={{ marginBottom: 14 }}>{o.icon}</div>
            <p
              style={{
                fontFamily: ff.heading,
                fontWeight: 700,
                fontSize: 16,
                color: T.text,
                marginBottom: 8,
              }}
            >
              {o.title}
            </p>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
              {o.desc}
            </p>
          </button>
        ))}
      </div>
      <Btn
        full
        size="lg"
        disabled={!selected}
        onClick={() =>
          selected === "venda" || selected === "doacao" || selected === "troca"
            ? nav("criar-anuncio")
            : nav("pontos-coleta")
        }
      >
        {selected
          ? `Continuar com ${opcoes.find((o) => o.key === selected)?.title}`
          : "Selecione uma opção"}
      </Btn>
    </PageWrap>
  )
}
