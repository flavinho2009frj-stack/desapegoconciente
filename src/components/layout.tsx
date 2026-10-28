import { useEffect, useState } from "react"
import { T, ff, type MarketplaceItem, type Page } from "../tokens"
import { Avatar, Btn, Card, H3 } from "./ui"
import { Icons } from "./icons"
import { apiRequest, type ApiUser } from "../lib/api"

const navLinks: { label: string; page: Page }[] = [
  { label: "Início", page: "home" },
  { label: "Explorar", page: "explorar" },
  { label: "Doação e descarte", page: "pontos-coleta" },
  { label: "Sobre", page: "sobre" },
]

export function Header({
  page,
  nav,
  isLoggedIn,
  onLogout,
}: {
  page?: Page
  nav: (p: Page) => void
  isLoggedIn?: boolean
  onLogout?: () => void
}) {
  const [open, setOpen] = useState(false)

  const navigateLink = (link: typeof navLinks[number]) => {
    setOpen(false)
    nav(link.page)
  }
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => nav("home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src="/images/logo.jpg?v=2"
            alt=""
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <span
            style={{
              fontFamily: ff.heading,
              fontWeight: 700,
              fontSize: 15,
              color: T.text,
            }}
          >
            Essência Organizada
          </span>
        </button>

        <nav
          style={{ display: "flex", alignItems: "center", gap: 2 }}
          className="eo-desk"
        >
          {navLinks.map((l) => {
            const isActive = page === l.page
            return (
              <button
                key={l.label}
                onClick={() => navigateLink(l)}
                style={{
                  background: isActive ? T.lilacFaint : "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "7px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? T.purple : T.muted,
                  fontFamily: ff.body,
                  transition: "all 0.15s",
                }}
              >
                {l.label}
              </button>
            )
          })}
        </nav>

        <div
          style={{ display: "flex", gap: 8, alignItems: "center" }}
          className="eo-desk"
        >
          {!isLoggedIn && (
            <Btn variant="ghost" size="sm" onClick={() => nav("login")}>
              Entrar
            </Btn>
          )}
          {!isLoggedIn && (
            <Btn size="sm" onClick={() => nav("cadastro")}>
              Cadastrar
            </Btn>
          )}
          {isLoggedIn && (
            <button
              onClick={() => nav("perfil")}
              aria-label="Abrir minha conta"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: T.lilacLight,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.User size={16} color={T.purple} />
            </button>
          )}
          {isLoggedIn && (
            <Btn variant="ghost" size="sm" onClick={onLogout}>
              Sair
            </Btn>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="eo-mob"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
          }}
        >
          {open ? (
            <Icons.X size={22} color={T.text} />
          ) : (
            <Icons.Menu size={22} />
          )}
        </button>
      </div>

      {open && (
        <div
          style={{
            background: T.white,
            borderTop: `1px solid ${T.border}`,
            padding: "16px 32px 24px",
          }}
        >
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => navigateLink(l)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "12px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 500,
                color: T.text,
                fontFamily: ff.body,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {l.label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {!isLoggedIn ? (
              <>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    nav("login")
                    setOpen(false)
                  }}
                >
                  Entrar
                </Btn>
                <Btn
                  size="sm"
                  onClick={() => {
                    nav("cadastro")
                    setOpen(false)
                  }}
                >
                  Cadastrar
                </Btn>
              </>
            ) : (
              <>
                <Btn
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    nav("dashboard")
                    setOpen(false)
                  }}
                >
                  Dashboard
                </Btn>
                <Btn
                  size="sm"
                  onClick={() => {
                    onLogout?.()
                    setOpen(false)
                  }}
                >
                  Sair
                </Btn>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .eo-desk { display: flex !important; }
        .eo-mob  { display: none !important; }
        @media (max-width: 900px) {
          .eo-desk { display: none !important; }
          .eo-mob  { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

export function Footer({ nav }: { nav: (p: Page) => void }) {
  return (
    <footer
      style={{ background: T.text, color: "#fff", padding: "60px 32px 32px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 44,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <img
                src="/images/logo.jpg?v=2"
                alt=""
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
              <span
                style={{
                  fontFamily: ff.heading,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Essência Organizada
              </span>
            </div>
            <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.75 }}>
              Venda, troque ou doe itens que merecem um novo destino.
            </p>
            <p style={{ color: "#6B7280", fontSize: 12, marginTop: 10 }}>
              Blumenau, Santa Catarina
            </p>
          </div>
          {[
            {
              title: "Marketplace",
              items: [
                ["Explorar itens", "explorar"],
                ["Publicar item", "criar-anuncio"],
                ["Doação e descarte", "pontos-coleta"],
                ["Dashboard", "dashboard"],
              ] as [string, Page][],
            },
            {
              title: "Desapego consciente",
              items: [
                ["Como funciona", "home"],
                ["Sobre o projeto", "sobre"],
              ] as [string, Page][],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  marginBottom: 14,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                }}
              >
                {col.title}
              </p>
              {col.items.map(([label, p]) => (
                <button
                  key={label}
                  onClick={() => nav(p)}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    fontSize: 13,
                    fontFamily: ff.body,
                    marginBottom: 9,
                    padding: 0,
                    textAlign: "left",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#D4BFFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#9CA3AF")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid #374151",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ color: "#6B7280", fontSize: 12 }}>
            © 2026 Essência Organizada.
          </p>
          <p style={{ color: "#6B7280", fontSize: 12 }}>
            TCC — Desenvolvimento de Sistemas · Blumenau, Santa Catarina
          </p>
        </div>
      </div>
    </footer>
  )
}

export function MobileNav({
  page,
  nav,
}: {
  page: Page
  nav: (p: Page) => void
}) {
  const items: { page: Page; label: string; icon: React.ReactNode }[] = [
    {
      page: "home",
      label: "Início",
      icon: <Icons.Home size={20} color="currentColor" />,
    },
    {
      page: "explorar",
      label: "Explorar",
      icon: <Icons.Search size={20} color="currentColor" />,
    },
    {
      page: "criar-anuncio",
      label: "Publicar",
      icon: <Icons.Plus size={20} color="currentColor" />,
    },
    {
      page: "mensagens",
      label: "Mensagens",
      icon: <Icons.MessageCircle size={20} color="currentColor" />,
    },
    {
      page: "perfil",
      label: "Conta",
      icon: <Icons.User size={20} color="currentColor" />,
    },
  ]
  return (
    <div
      className="eo-mobnav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: T.white,
        borderTop: `1px solid ${T.border}`,
        display: "none",
        justifyContent: "space-around",
        padding: "8px 0 env(safe-area-inset-bottom)",
        zIndex: 200,
      }}
    >
      {items.map((i) => (
        <button
          key={i.page}
          onClick={() => nav(i.page)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 12px",
            color: page === i.page ? T.purple : T.muted,
          }}
        >
          {i.icon}
          <span
            style={{
              fontSize: 10,
              fontWeight: page === i.page ? 600 : 400,
              fontFamily: ff.body,
            }}
          >
            {i.label}
          </span>
        </button>
      ))}
      <style>{`@media(max-width:900px){.eo-mobnav{display:flex!important;}}`}</style>
    </div>
  )
}

export function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      className="eo-sidebar-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      {sidebar}
      <div>{children}</div>
    </div>
  )
}

export function UserSidebar({
  nav,
  active,
  hideObjects = false,
}: {
  nav: (p: Page) => void
  active: Page
  hideObjects?: boolean
}) {
  const [user, setUser] = useState<ApiUser | null>(null)

  useEffect(() => {
    apiRequest<{ user: ApiUser }>("/auth/me")
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
  }, [])

  const items: { label: string; page: Page; icon: React.ReactNode }[] = [
    {
      label: "Dashboard",
      page: "dashboard",
      icon: <Icons.BarChart size={15} color="currentColor" />,
    },
    {
      label: "Minhas Publicações",
      page: "minhas-publicacoes",
      icon: <Icons.Tag size={15} color="currentColor" />,
    },
    {
      label: "Solicitações de Troca",
      page: "solicitacao-troca",
      icon: <Icons.Repeat size={15} color="currentColor" />,
    },
    {
      label: "Mensagens",
      page: "mensagens",
      icon: <Icons.MessageCircle size={15} color="currentColor" />,
    },
    {
      label: "Meus Interesses",
      page: "meus-interesses",
      icon: <Icons.Heart size={15} color="currentColor" />,
    },
    {
      label: "Minha conta",
      page: "perfil",
      icon: <Icons.User size={15} color="currentColor" />,
    },
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Card style={{ padding: 24, textAlign: "center", marginBottom: 12 }}>
        <Avatar name={user?.name || "Minha conta"} size={64} />
        <div style={{ marginTop: 14 }}>
          <H3 style={{ fontSize: 16, marginBottom: 2 }}>
            {user?.name || "Minha conta"}
          </H3>
          <p style={{ fontSize: 13, color: T.muted, fontFamily: ff.body }}>
            {user ? `${user.city}, ${user.state}` : "Carregando perfil..."}
          </p>
          {user && (
            <p
              style={{
                fontSize: 11,
                color: T.muted,
                marginTop: 8,
                fontFamily: ff.body,
              }}
            >
              {user.email}
            </p>
          )}
        </div>
      </Card>
      {items.filter((m) => !(hideObjects && m.page === "meus-objetos")).map((m) => (
        <button
          key={m.page}
          type="button"
          data-eo-sidebar-item={m.page}
          aria-current={active === m.page ? "page" : undefined}
          onClick={() => nav(m.page)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "11px 14px",
            border: "none",
            borderRadius: 10,
            background: active === m.page ? T.lilacFaint : "transparent",
            cursor: "pointer",
            fontFamily: ff.body,
            fontSize: 13,
            fontWeight: active === m.page ? 600 : 400,
            color: active === m.page ? T.purple : T.muted,
            textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          {m.icon} {m.label}
        </button>
      ))}
    </div>
  )
}

export function ItemCard({
  item,
  onView,
}: {
  item: MarketplaceItem
  onView: () => void
}) {
  const tagColor =
    item.type === "Doação"
      ? "green"
      : item.type === "Troca"
        ? "amber"
        : "purple"
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        background: T.white,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        boxShadow: hov
          ? "0 8px 32px rgba(107,70,193,0.10)"
          : "0 1px 6px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ position: "relative" }}>
        <img
          src={item.img}
          alt={item.title}
          style={{
            width: "100%",
            height: 185,
            objectFit: "cover",
            background: T.lilacFaint,
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              background:
                tagColor === "green"
                  ? T.successBg
                  : tagColor === "amber"
                    ? T.warningBg
                    : T.lilacFaint,
              color:
                tagColor === "green"
                  ? T.success
                  : tagColor === "amber"
                    ? T.warning
                    : T.purple,
              display: "inline-block",
            }}
          >
            {item.type}
          </span>
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <p
          style={{
            fontSize: 11,
            color: T.muted,
            marginBottom: 4,
            fontWeight: 500,
            fontFamily: ff.body,
          }}
        >
          {item.cat}
        </p>
        <p
          style={{
            fontFamily: ff.heading,
            fontWeight: 600,
            fontSize: 15,
            color: T.text,
            marginBottom: 6,
            lineHeight: 1.35,
          }}
        >
          {item.title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: T.muted,
            lineHeight: 1.55,
            marginBottom: 12,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient:
              "vertical" as React.CSSProperties["WebkitBoxOrient"],
          }}
        >
          {item.desc}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: ff.heading,
              fontWeight: 700,
              fontSize: 16,
              color: T.purple,
            }}
          >
            {item.price}
          </span>
          <span style={{ fontSize: 11, color: T.muted }}>
            Blumenau, Santa Catarina
          </span>
        </div>
        <Btn variant="soft" size="sm" full onClick={onView}>
          Ver detalhes
        </Btn>
      </div>
    </div>
  )
}
