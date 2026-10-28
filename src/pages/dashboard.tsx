import { useEffect, useState } from "react"
import { T, ff, type Page } from "../tokens"
import { Btn, Card, H2, H3, SectionLabel, PageWrap, StatCard, Alert } from "../components/ui"
import { Icons } from "../components/icons"
import { SidebarLayout, UserSidebar } from "../components/layout"
import { apiRequest, type ApiAd, type ApiDashboardStats, type ApiUser } from "../lib/api"

export function DashboardPage({ nav }: { nav: (p: Page) => void }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [myAds, setMyAds] = useState<ApiAd[]>([])
  const [stats, setStats] = useState<ApiDashboardStats | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      apiRequest<{ user: ApiUser }>("/auth/me"),
      apiRequest<{ ads: ApiAd[] }>("/ads/mine"),
      apiRequest<ApiDashboardStats>("/dashboard/stats"),
    ])
      .then(([account, ads, dashboardStats]) => {
        setUser(account.user)
        setMyAds(ads.ads)
        setStats(dashboardStats)
      })
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os dados do Dashboard."),
      )
  }, [])

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="dashboard" />}>
        <div>
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Dashboard</SectionLabel>
            <H2 style={{ marginBottom: 4 }}>Olá{user ? `, ${user.name.split(" ")[0]}` : ""}!</H2>
            <p style={{ color: T.muted, fontSize: 15, fontFamily: ff.body }}>
              Veja o resumo da sua conta e atividades recentes.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 28 }}>
            <StatCard label="Anúncios ativos" value={myAds.filter((ad) => ad.status === "Ativo").length} sub={`${myAds.length} publicação(ões)`} color={T.success} />
            <StatCard label="Produtos vendidos" value={stats?.productsSold ?? 0} sub={stats?.productsSold ? "Anúncios concluídos como venda" : "Nenhuma venda ainda"} color={T.warning} />
            <StatCard label="Produtos trocados" value={stats?.productsExchanged ?? 0} sub={stats?.productsExchanged ? "Anúncios concluídos como troca" : "Nenhuma troca ainda"} color={T.lilac} />
          </div>
          {error && <div style={{ marginBottom: 20 }}><Alert type="error">{error}</Alert></div>}
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

export function PerfilPage({ nav, onLogout, onSwitchAccount }: { nav: (p: Page) => void; onLogout: () => void; onSwitchAccount: () => void }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    apiRequest<{ user: ApiUser }>("/auth/me")
      .then((result) => setUser(result.user))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar os dados da conta."))
  }, [])

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="perfil" />}>
        <div>
          <SectionLabel>Conta</SectionLabel>
          <H2 style={{ marginBottom: 8 }}>Minha conta</H2>
          <p style={{ color: T.muted, marginBottom: 32, fontSize: 15, fontFamily: ff.body }}>
            Confira os dados associados à sua conta e gerencie seu acesso.
          </p>
          <Card style={{ padding: 28, marginBottom: 20 }}>
            <H3 style={{ marginBottom: 22, fontSize: 16 }}>Dados da conta</H3>
            {error ? <Alert type="error">{error}</Alert> : user ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[["Nome completo", user.name], ["E-mail", user.email], ["Cidade", user.city], ["Estado", user.state]].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: 12, color: T.muted, marginBottom: 5, fontFamily: ff.body }}>{label}</p>
                    <p style={{ fontSize: 14, color: T.text, fontWeight: 600, fontFamily: ff.body, overflowWrap: "anywhere" }}>{value}</p>
                  </div>
                ))}
              </div>
            ) : <p style={{ fontSize: 14, color: T.muted, fontFamily: ff.body }}>Carregando os dados da sua conta...</p>}
          </Card>
          <Card style={{ padding: 28, background: T.lilacFaint }}>
            <H3 style={{ marginBottom: 8, fontSize: 16 }}>Acesso e sessão</H3>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.65, marginBottom: 20, fontFamily: ff.body }}>
              Você pode encerrar esta sessão ou entrar com outra conta neste dispositivo.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant="outline" onClick={onSwitchAccount}>Trocar de conta</Btn>
              <Btn variant="danger" onClick={onLogout}><Icons.Logout size={16} color="currentColor" /> Sair do site</Btn>
            </div>
          </Card>
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}
