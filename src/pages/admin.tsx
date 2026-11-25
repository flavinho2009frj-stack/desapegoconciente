import { useState } from "react"
import { T, ff, type Page } from "../tokens"
import {
  Btn,
  Card,
  H2,
  H3,
  SectionLabel,
  Tag,
  Badge,
  StatCard,
  Modal,
  Avatar,
} from "../components/ui"
import { Icons } from "../components/icons"

function AdminShell({
  nav,
  active,
  children,
}: {
  nav: (p: Page) => void
  active: Page
  children: React.ReactNode
}) {
  const links: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: "Visão geral", page: "admin", icon: <Icons.Home size={16} /> },
    {
      label: "Usuários",
      page: "admin-usuarios",
      icon: <Icons.User size={16} />,
    },
    {
      label: "Anúncios",
      page: "admin-anuncios",
      icon: <Icons.Tag size={16} />,
    },
  ]
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
        background: T.surface,
      }}
    >
      <aside
        style={{
          background: T.white,
          borderRight: `1px solid ${T.border}`,
          padding: "32px 16px",
        }}
      >
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <p
            style={{
              fontFamily: ff.heading,
              fontWeight: 700,
              fontSize: 14,
              color: T.purple,
            }}
          >
            Admin
          </p>
          <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>
            Essencia Organizada
          </p>
        </div>
        {links.map((l) => (
          <button
            key={l.page}
            onClick={() => nav(l.page)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              width: "100%",
              border: "none",
              background: active === l.page ? T.lilacFaint : "transparent",
              color: active === l.page ? T.purple : T.muted,
              fontWeight: active === l.page ? 600 : 400,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: ff.body,
              marginBottom: 2,
              transition: "all 0.15s",
            }}
          >
            {l.icon}
            {l.label}
          </button>
        ))}
        <div
          style={{
            borderTop: `1px solid ${T.border}`,
            paddingTop: 16,
            marginTop: 48,
          }}
        >
          <button
            onClick={() => nav("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 10,
              width: "100%",
              border: "none",
              background: "transparent",
              color: T.muted,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: ff.body,
            }}
          >
            <Icons.ChevronLeft size={16} />
            Voltar ao site
          </button>
        </div>
      </aside>
      <main style={{ padding: "40px 48px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}

type User = {
  id: number
  name: string
  email: string
  city: string
  joined: string
  items: number
  status: string
}
const users: User[] = []

type Listing = {
  id: number
  title: string
  seller: string
  cat: string
  type: string
  price: string
  date: string
  status: string
}
const listings: Listing[] = []

export function AdminPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <AdminShell nav={nav} active="admin">
      <SectionLabel>Painel</SectionLabel>
      <H2 style={{ marginBottom: 32 }}>Visão geral</H2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <StatCard label="Usuários ativos" value="0" color={T.purple} />
        <StatCard label="Anúncios publicados" value="0" color={T.success} />
        <StatCard label="Itens doados" value="0" color={T.warning} />
        <StatCard label="Trocas realizadas" value="0" color={T.lilac} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card style={{ padding: 24 }}>
          <H3 style={{ marginBottom: 16, fontSize: 16 }}>Anúncios recentes</H3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {listings.slice(0, 4).map((l) => (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: T.text,
                      fontFamily: ff.heading,
                    }}
                  >
                    {l.title}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      fontFamily: ff.body,
                    }}
                  >
                    {l.seller} · {l.date}
                  </p>
                </div>
                <Tag
                  label={l.status}
                  color={
                    l.status === "Ativo"
                      ? "green"
                      : l.status === "Pendente"
                        ? "amber"
                        : "gray"
                  }
                />
              </div>
            ))}
            {listings.length === 0 && (
              <p style={{ color: T.muted, fontSize: 13, fontFamily: ff.body }}>
                Nenhum anúncio publicado.
              </p>
            )}
          </div>
          <Btn
            size="sm"
            variant="outline"
            style={{ marginTop: 16 }}
            onClick={() => nav("admin-anuncios")}
          >
            Ver todos
          </Btn>
        </Card>

        <Card style={{ padding: 24 }}>
          <H3 style={{ marginBottom: 16, fontSize: 16 }}>Últimos cadastros</H3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <Avatar name={u.name} size={36} />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: T.text,
                      fontFamily: ff.heading,
                    }}
                  >
                    {u.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      fontFamily: ff.body,
                    }}
                  >
                    {u.city} · {u.joined}
                  </p>
                </div>
                <Tag
                  label={u.status}
                  color={
                    u.status === "Ativo"
                      ? "green"
                      : u.status === "Suspenso"
                        ? "red"
                        : "gray"
                  }
                />
              </div>
            ))}
            {users.length === 0 && (
              <p style={{ color: T.muted, fontSize: 13, fontFamily: ff.body }}>
                Nenhum usuário cadastrado.
              </p>
            )}
          </div>
          <Btn
            size="sm"
            variant="outline"
            style={{ marginTop: 16 }}
            onClick={() => nav("admin-usuarios")}
          >
            Ver todos
          </Btn>
        </Card>
      </div>
    </AdminShell>
  )
}

export function AdminUsuariosPage({ nav }: { nav: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [confirm, setConfirm] = useState<{ action: string; user: User } | null>(
    null,
  )

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminShell nav={nav} active="admin-usuarios">
      <SectionLabel>Administracao</SectionLabel>
      <H2 style={{ marginBottom: 24 }}>Gerenciamento de usuários</H2>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário por nome ou e-mail..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: `1.5px solid ${T.borderMid}`,
              fontSize: 13,
              fontFamily: ff.body,
              outline: "none",
            }}
          />
          <Badge>{filtered.length}</Badge>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {[
                "Usuário",
                "E-mail",
                "Cidade",
                "Cadastro",
                "Anúncios",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.muted,
                    fontFamily: ff.body,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = T.lilacFaint)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={{ padding: "14px 20px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Avatar name={u.name} size={34} />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: T.text,
                        fontFamily: ff.heading,
                      }}
                    >
                      {u.name}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {u.email}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {u.city}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {u.joined}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.text,
                    fontFamily: ff.body,
                    fontWeight: 600,
                  }}
                >
                  {u.items}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <Tag
                    label={u.status}
                    color={
                      u.status === "Ativo"
                        ? "green"
                        : u.status === "Suspenso"
                          ? "red"
                          : "gray"
                    }
                  />
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() =>
                        setConfirm({
                          action:
                            u.status === "Suspenso" ? "reativar" : "suspender",
                          user: u,
                        })
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: 7,
                        border: `1px solid ${T.borderMid}`,
                        background: "transparent",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: ff.body,
                        color: T.muted,
                      }}
                    >
                      {u.status === "Suspenso" ? "Reativar" : "Suspender"}
                    </button>
                    <button
                      onClick={() => setConfirm({ action: "excluir", user: u })}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 7,
                        border: `1px solid #FCA5A5`,
                        background: T.dangerBg,
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: ff.body,
                        color: T.danger,
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: T.muted,
              fontSize: 14,
              fontFamily: ff.body,
            }}
          >
            Nenhum usuário encontrado.
          </div>
        )}
      </Card>

      {confirm && (
        <Modal
          title={`Confirmar: ${confirm.action}`}
          onClose={() => setConfirm(null)}
        >
          <p
            style={{
              color: T.muted,
              fontSize: 14,
              lineHeight: 1.7,
              fontFamily: ff.body,
              marginBottom: 24,
            }}
          >
            Deseja {confirm.action} o usuário{" "}
            <strong>{confirm.user.name}</strong>? Esta ação será registrada no
            histórico administrativo.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn
              full
              variant={confirm.action === "excluir" ? "danger" : "primary"}
              onClick={() => setConfirm(null)}
            >
              Confirmar
            </Btn>
            <Btn full variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Btn>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}

export function AdminAnunciosPage({ nav }: { nav: (p: Page) => void }) {
  const [search, setSearch] = useState("")
  const [confirm, setConfirm] = useState<{
    action: string
    listing: Listing
  } | null>(null)

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.seller.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminShell nav={nav} active="admin-anuncios">
      <SectionLabel>Moderacao</SectionLabel>
      <H2 style={{ marginBottom: 24 }}>Gerenciamento de anúncios</H2>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar anúncio ou anunciante..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: `1.5px solid ${T.borderMid}`,
              fontSize: 13,
              fontFamily: ff.body,
              outline: "none",
            }}
          />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.surface }}>
              {[
                "Anúncio",
                "Anunciante",
                "Categoria",
                "Tipo",
                "Valor",
                "Data",
                "Status",
                "Ações",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 20px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.muted,
                    fontFamily: ff.body,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr
                key={l.id}
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = T.lilacFaint)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 600,
                    fontSize: 13,
                    color: T.text,
                    fontFamily: ff.heading,
                    maxWidth: 200,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l.title}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {l.seller}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {l.cat}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <Tag
                    label={l.type}
                    color={
                      l.type === "Venda"
                        ? "purple"
                        : l.type === "Doação"
                          ? "green"
                          : "amber"
                    }
                  />
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.text,
                    fontFamily: ff.body,
                    fontWeight: 600,
                  }}
                >
                  {l.price}
                </td>
                <td
                  style={{
                    padding: "14px 20px",
                    fontSize: 13,
                    color: T.muted,
                    fontFamily: ff.body,
                  }}
                >
                  {l.date}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <Tag
                    label={l.status}
                    color={
                      l.status === "Ativo"
                        ? "green"
                        : l.status === "Pendente"
                          ? "amber"
                          : "gray"
                    }
                  />
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {l.status === "Pendente" && (
                      <button
                        onClick={() =>
                          setConfirm({ action: "aprovar", listing: l })
                        }
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: `1px solid #6EE7B7`,
                          background: T.successBg,
                          fontSize: 11,
                          cursor: "pointer",
                          fontFamily: ff.body,
                          color: T.success,
                        }}
                      >
                        Aprovar
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setConfirm({ action: "remover", listing: l })
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: 7,
                        border: `1px solid #FCA5A5`,
                        background: T.dangerBg,
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: ff.body,
                        color: T.danger,
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: T.muted,
              fontSize: 14,
              fontFamily: ff.body,
            }}
          >
            Nenhum anúncio encontrado.
          </div>
        )}
      </Card>

      {confirm && (
        <Modal
          title={`${
            confirm.action === "aprovar" ? "Aprovar" : "Remover"
          } anúncio`}
          onClose={() => setConfirm(null)}
        >
          <p
            style={{
              color: T.muted,
              fontSize: 14,
              lineHeight: 1.7,
              fontFamily: ff.body,
              marginBottom: 24,
            }}
          >
            Confirma a ação de <strong>{confirm.action}</strong> o anúncio "
            <strong>{confirm.listing.title}</strong>"?
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn
              full
              variant={confirm.action === "remover" ? "danger" : "primary"}
              onClick={() => setConfirm(null)}
            >
              Confirmar
            </Btn>
            <Btn full variant="outline" onClick={() => setConfirm(null)}>
              Cancelar
            </Btn>
          </div>
        </Modal>
      )}
    </AdminShell>
  )
}
