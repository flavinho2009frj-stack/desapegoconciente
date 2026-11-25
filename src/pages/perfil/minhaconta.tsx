import { useEffect, useState } from "react"
import { T, ff, type Page } from "../../tokens"
import { Btn, Card, H2, PageWrap, Alert } from "../../components/ui"
import { Icons } from "../../components/icons"
import { SidebarLayout, UserSidebar } from "../../components/layout"
import { apiRequest, type ApiUser } from "../../lib/api"
export function PerfilPage({ nav, onLogout }: { nav: (p: Page) => void; onLogout: () => void }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    apiRequest<{ user: ApiUser }>("/auth/me")
      .then((result) => setUser(result.user))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "NÃ£o foi possÃ­vel carregar os dados da conta."))
  }, [])

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="perfil" />}>
        <div>
          <H2 style={{ marginBottom: 24 }}>Minha conta</H2>
          <Card style={{ padding: 28 }}>
            {error ? <Alert type="error">{error}</Alert> : user ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 20 }}>
                {[
                  ["Nome completo", user.name],
                  ["E-mail", user.email],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: 12, color: T.muted, marginBottom: 5, fontFamily: ff.body }}>{label}</p>
                    <p style={{ fontSize: 14, color: T.text, fontWeight: 600, fontFamily: ff.body, overflowWrap: "anywhere" }}>{value}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ fontSize: 14, color: T.muted, fontFamily: ff.body }}>Carregando os dados da sua conta...</p>}
            <div style={{ display: "flex", marginTop: 28 }}>
              <Btn variant="danger" onClick={onLogout}><Icons.Logout size={16} color="currentColor" /> Sair</Btn>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

