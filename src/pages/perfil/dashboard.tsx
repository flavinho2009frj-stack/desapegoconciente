import { useEffect, useState } from "react"
import { T, type Page } from "../../tokens"
import { H2, PageWrap, StatCard, Alert } from "../../components/ui"
import { SidebarLayout, UserSidebar } from "../../components/layout"
import { apiRequest, type ApiAd, type ApiDashboardStats, type ApiUser } from "../../lib/api"

export { PerfilPage } from "./minhaconta"

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
        setError(requestError instanceof Error ? requestError.message : "NÃ£o foi possÃ­vel carregar os dados do Dashboard."),
      )
  }, [])

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="dashboard" />}>
        <div>
          <div style={{ marginBottom: 36 }}>
            <H2 style={{ marginBottom: 0 }}>OlÃ¡{user ? `, ${user.name.split(" ")[0]}` : ""}!</H2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 28 }}>
            <StatCard label="AnÃºncios ativos" value={myAds.filter((ad) => ad.status === "Ativo").length} color={T.success} />
            <StatCard label="Produtos vendidos" value={stats?.productsSold ?? 0} color={T.warning} />
            <StatCard label="Produtos trocados" value={stats?.productsExchanged ?? 0} color={T.lilac} />
          </div>
          {error && <div style={{ marginBottom: 20 }}><Alert type="error">{error}</Alert></div>}
        </div>
      </SidebarLayout>
    </PageWrap>
  )
}

