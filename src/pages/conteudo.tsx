import { useState, useRef } from "react"
import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  H2,
  H3,
  SectionLabel,
  PageWrap,
  ProgressBar,
  StatCard,
  Chip,
  Badge,
} from "../components/ui"
import { Icons } from "../components/icons"
import { SidebarLayout, UserSidebar } from "../components/layout"

const tips = [
  {
    title: "Regra dos 90 dias",
    desc: "Se você não usou o item nos últimos 90 dias, provavelmente não vai usá-lo. É hora de dar um destino a ele.",
    category: "Desapego",
  },
  {
    title: "Um entra, um sai",
    desc: "Para cada item novo que entra em casa, destine um que já não serve mais.",
    category: "Rotina",
  },
  {
    title: "Método KonMari",
    desc: "Mantenha apenas o que traz alegria. Agrupe por categoria, não por cômodo.",
    category: "Organização",
  },
  {
    title: "Caixa dos 12 meses",
    desc: "Guarde itens sobre os quais está em dúvida em uma caixa datada. Se não a abrir em 12 meses, destine-os.",
    category: "Desapego",
  },
  {
    title: "Fotografia para liberar",
    desc: "Fotografe itens sentimentais antes de destiná-los. Você guarda a memória, não o objeto.",
    category: "Desapego",
  },
  {
    title: "Três perguntas",
    desc: "Funciona? Uso? Amo? Se a resposta for não para todas, é hora de deixar ir.",
    category: "Organização",
  },
]

export function BibliotecaPage({ nav }: { nav: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todas")
  const categories = ["Todas", "Organização", "Desapego", "Rotina"]
  const visibleTips = tips.filter(
    (tip) =>
      (category === "Todas" || tip.category === category) &&
      (!search ||
        `${tip.title} ${tip.desc}`
          .toLowerCase()
          .includes(search.toLowerCase())),
  )

  return (
    <div style={{ padding: "52px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <SectionLabel>Biblioteca</SectionLabel>
      <H2 style={{ marginBottom: 8 }}>Biblioteca de organização</H2>
      <p
        style={{
          color: T.muted,
          marginBottom: 48,
          fontSize: 15,
          fontFamily: ff.body,
        }}
      >
        Dicas, guias e conteúdos para transformar sua relação com os objetos.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 40,
        }}
      >
        <Card hover style={{ padding: 28, cursor: "pointer" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: T.lilacFaint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Icons.Shuffle size={24} color={T.purple} />
          </div>
          <H3 style={{ marginBottom: 8 }}>Roleta de Tarefas</H3>
          <p
            style={{
              fontSize: 14,
              color: T.muted,
              lineHeight: 1.7,
              marginBottom: 20,
              fontFamily: ff.body,
            }}
          >
            Adicione tarefas e deixe a roleta decidir por onde começar!
          </p>
          <Btn
            size="sm"
            variant="outline"
            onClick={() => nav("roleta-tarefas")}
          >
            Girar roleta
          </Btn>
        </Card>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <H3>Dicas de organização</H3>
        <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar dicas"
            aria-label="Buscar dicas da biblioteca"
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: 10,
              border: `1.5px solid ${T.borderMid}`,
              fontSize: 14,
              fontFamily: ff.body,
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 12,
              top: 11,
              pointerEvents: "none",
            }}
          >
            <Icons.Search size={16} />
          </span>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}
      >
        {categories.map((option) => (
          <Chip
            key={option}
            label={option}
            active={category === option}
            onClick={() => setCategory(option)}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {visibleTips.map((t) => (
          <Card key={t.title} hover style={{ padding: 24, cursor: "pointer" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: T.lilacFaint,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.Book size={18} color={T.purple} />
            </div>
            <H3 style={{ marginBottom: 8, fontSize: 15 }}>{t.title}</H3>
            <p
              style={{
                fontSize: 13,
                color: T.muted,
                lineHeight: 1.7,
                fontFamily: ff.body,
              }}
            >
              {t.desc}
            </p>
          </Card>
        ))}
        {visibleTips.length === 0 && (
          <p
            style={{
              gridColumn: "1 / -1",
              color: T.muted,
              fontSize: 14,
              padding: 20,
            }}
          >
            Nenhuma dica encontrada para essa busca.
          </p>
        )}
      </div>

      <Card style={{ padding: 32 }}>
        <H3 style={{ marginBottom: 20 }}>Guia de desapego consciente</H3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            "Comece pelo cômodo mais bagunçado",
            "Separe em: guardar, destinar e reciclar",
            "Use caixas etiquetadas para cada categoria",
            "Fotografe o antes e o depois para se motivar",
            "Defina uma data-limite para concluir",
          ].map((s, i) => (
            <div
              key={s}
              style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: T.lilacFaint,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: ff.heading,
                    fontWeight: 700,
                    fontSize: 13,
                    color: T.purple,
                  }}
                >
                  {i + 1}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: T.text,
                  lineHeight: 1.65,
                  fontFamily: ff.body,
                  paddingTop: 4,
                }}
              >
                {s}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function RoletaTarefasPage({ nav }: { nav: (p: Page) => void }) {
  const [tasks, setTasks] = useState([
    "Organizar o guarda-roupa",
    "Limpar a cozinha",
    "Destinar livros",
    "Fotografar itens",
    "Organizar o escritório",
  ])
  const [newTask, setNewTask] = useState("")
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [spinDeg, setSpinDeg] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addTask = () => {
    if (newTask.trim() && tasks.length < 12) {
      setTasks((t) => [...t, newTask.trim()])
      setNewTask("")
    }
  }
  const removeTask = (i: number) =>
    setTasks((t) => t.filter((_, idx) => idx !== i))

  const spin = () => {
    if (tasks.length === 0 || spinning) return
    setWinner(null)
    setSpinning(true)
    const extra = 1440 + Math.floor(Math.random() * 360)
    const newDeg = spinDeg + extra
    setSpinDeg(newDeg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const idx = Math.floor(Math.random() * tasks.length)
      setWinner(tasks[idx])
      setSpinning(false)
    }, 3000)
  }

  const colors = [
    T.purple,
    T.lilac,
    T.lilacMid,
    T.success,
    T.warning,
    T.danger,
    "#8B5CF6",
    "#0EA5E9",
    "#10B981",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ]

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="biblioteca" />}>
        <div>
          <SectionLabel>Ferramenta</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>Roleta de tarefas</H2>
          <p
            style={{
              color: T.muted,
              marginBottom: 36,
              fontSize: 15,
              fontFamily: ff.body,
            }}
          >
            Adicione suas tarefas e deixe a sorte decidir por onde começar!
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
          >
            {/* Wheel */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div style={{ position: "relative", width: 280, height: 280 }}>
                {/* Pointer */}
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    width: 0,
                    height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: "24px solid " + T.purple,
                  }}
                />
                {/* Wheel */}
                <div
                  style={{
                    width: 280,
                    height: 280,
                    borderRadius: "50%",
                    border: `4px solid ${T.border}`,
                    overflow: "hidden",
                    position: "relative",
                    transform: `rotate(${spinDeg}deg)`,
                    transition: spinning
                      ? "transform 3s cubic-bezier(0.2,0.8,0.3,1)"
                      : "none",
                    boxShadow: "0 8px 32px rgba(107,70,193,0.15)",
                  }}
                >
                  {tasks.length === 0 ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: T.lilacFaint,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          color: T.muted,
                          fontFamily: ff.body,
                          textAlign: "center",
                          padding: 20,
                        }}
                      >
                        Adicione tarefas para girar
                      </p>
                    </div>
                  ) : (
                    tasks.map((task, i) => {
                      const angle = 360 / tasks.length
                      const rotate = i * angle
                      return (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            width: "50%",
                            height: "50%",
                            left: "50%",
                            top: 0,
                            transformOrigin: "0% 100%",
                            transform: `rotate(${rotate}deg)`,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: colors[i % colors.length],
                              opacity: 0.85,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: "30%",
                              left: "10%",
                              width: "70%",
                              transform: `rotate(${angle / 2}deg)`,
                            }}
                          >
                            <p
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "#fff",
                                fontFamily: ff.body,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {task}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                {/* Center */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: T.white,
                    border: `3px solid ${T.border}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 5,
                  }}
                />
              </div>

              <Btn
                size="lg"
                onClick={spin}
                disabled={tasks.length === 0 || spinning}
                style={{ minWidth: 160 }}
              >
                {spinning ? "Girando..." : "Girar roleta"}
              </Btn>

              {winner && (
                <Card
                  style={{
                    padding: 20,
                    background: T.lilacFaint,
                    textAlign: "center",
                    width: "100%",
                    border: `2px solid ${T.purple}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: T.purple,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: 8,
                      fontFamily: ff.body,
                    }}
                  >
                    Tarefa sorteada
                  </p>
                  <H3 style={{ color: T.purple }}>{winner}</H3>
                  <p
                    style={{
                      fontSize: 13,
                      color: T.muted,
                      marginTop: 8,
                      fontFamily: ff.body,
                    }}
                  >
                    Hora de começar! Você consegue.
                  </p>
                </Card>
              )}
            </div>

            {/* Task list */}
            <div>
              <H3 style={{ marginBottom: 16, fontSize: 16 }}>
                Suas tarefas ({tasks.length}/12)
              </H3>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="Nova tarefa..."
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
                <Btn onClick={addTask} disabled={tasks.length >= 12}>
                  Adicionar
                </Btn>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tasks.map((task, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: colors[i % colors.length],
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: T.text,
                        fontFamily: ff.body,
                      }}
                    >
                      {task}
                    </span>
                    <button
                      onClick={() => removeTask(i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: T.muted,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Icons.X size={14} color={T.muted} />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p
                    style={{
                      color: T.muted,
                      fontSize: 14,
                      fontFamily: ff.body,
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Nenhuma tarefa adicionada.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

const badges = [
  {
    icon: "🌟",
    title: "Primeiro desapego",
    desc: "Destinou seu primeiro item",
    earned: true,
  },
  {
    icon: "💜",
    title: "Doador solidário",
    desc: "Doou 5 itens ou mais",
    earned: true,
  },
  {
    icon: "♻️",
    title: "Eco consciente",
    desc: "Usou ponto de coleta",
    earned: true,
  },
  {
    icon: "📦",
    title: "Organizador",
    desc: "Cadastrou 20+ objetos",
    earned: false,
  },
  {
    icon: "🔄",
    title: "Primeira troca",
    desc: "Completou uma troca",
    earned: false,
  },
  {
    icon: "🏆",
    title: "Lenda do desapego",
    desc: "50 itens destinados",
    earned: false,
  },
]

export function ProgressoPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="progresso" />}>
        <div>
          <SectionLabel>Evolucao</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>Meu progresso</H2>
          <p
            style={{
              color: T.muted,
              marginBottom: 32,
              fontSize: 15,
              fontFamily: ff.body,
            }}
          >
            Acompanhe sua jornada de organização e desapego consciente.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
              marginBottom: 32,
            }}
          >
            <StatCard
              label="Total destinado"
              value={23}
              sub="Vendas, doações e trocas"
            />
            <StatCard
              label="Itens doados"
              value={8}
              sub="Impacto direto"
              color={T.success}
            />
            <StatCard
              label="Pontos acumulados"
              value={1240}
              sub="Nivel Prata"
              color={T.warning}
            />
            <StatCard
              label="Cômodos organizados"
              value={4}
              sub="De 6 no total"
              color={T.lilac}
            />
          </div>

          <Card style={{ padding: 28, marginBottom: 20 }}>
            <H3 style={{ marginBottom: 8, fontSize: 16 }}>
              Nivel atual — Prata
            </H3>
            <p
              style={{
                fontSize: 13,
                color: T.muted,
                marginBottom: 16,
                fontFamily: ff.body,
              }}
            >
              760 pontos para o nivel Ouro
            </p>
            <ProgressBar label="Progresso para Ouro" value={1240} max={2000} />
          </Card>

          <Card style={{ padding: 28, marginBottom: 20 }}>
            <H3 style={{ marginBottom: 20, fontSize: 16 }}>
              Crescimento mensal
            </H3>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 120,
              }}
            >
              {[45, 62, 38, 78, 55, 90, 70, 85, 100].map((v, i) => {
                const months = [
                  "Jan",
                  "Fev",
                  "Mar",
                  "Abr",
                  "Mai",
                  "Jun",
                  "Jul",
                  "Ago",
                  "Set",
                ]
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        background: i === 8 ? T.purple : T.lilacLight,
                        borderRadius: "6px 6px 0 0",
                        height: `${v}%`,
                        minHeight: 4,
                        transition: "height 0.5s",
                      }}
                    />
                    <p
                      style={{
                        fontSize: 10,
                        color: T.muted,
                        fontFamily: ff.body,
                      }}
                    >
                      {months[i]}
                    </p>
                  </div>
                )
              })}
            </div>
          </Card>

          <H3 style={{ marginBottom: 20, fontSize: 16 }}>Conquistas</H3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {badges.map((b) => (
              <Card
                key={b.title}
                style={{
                  padding: 20,
                  textAlign: "center",
                  opacity: b.earned ? 1 : 0.45,
                }}
              >
                <p style={{ fontSize: 36, marginBottom: 10 }}>{b.icon}</p>
                <H3 style={{ fontSize: 14, marginBottom: 4 }}>{b.title}</H3>
                <p
                  style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}
                >
                  {b.desc}
                </p>
                {b.earned && (
                  <div style={{ marginTop: 10 }}>
                    <Badge color="green">Conquistada</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}
