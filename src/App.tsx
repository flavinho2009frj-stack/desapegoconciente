import { useEffect, useRef, useState } from "react"
import type { Page } from "./tokens"
import { Header, Footer } from "./components/layout"

import { HomePage } from "./pages/home"
import { SobrePage } from "./pages/sobre"
import { LoginPage, CadastroPage, RecuperarSenhaPage } from "./pages/auth"
import { DashboardPage, PerfilPage } from "./pages/dashboard"
import {
  OrganizacaoPage,
  AdicionarObjetoPage,
  MeusObjetosPage,
  DestinoObjetoPage,
} from "./pages/objetos"
import {
  CriarAnuncioPage,
  ExplorarPage,
  DetalhesAnuncioPage,
  MinhasPublicacoesPage,
} from "./pages/anuncios"
import {
  MeusInteressesPage,
  SolicitacaoTrocaPage,
  MensagensPage,
} from "./pages/interacoes"
import {
  BibliotecaPage,
  RoletaTarefasPage,
  ProgressoPage,
} from "./pages/conteudo"
import {
  PontosColetaPage,
  ServicosPage,
  DepoimentosPage,
} from "./pages/servicos"
import { InstagramPage } from "./pages/contato"
import { AdminPage, AdminUsuariosPage, AdminAnunciosPage } from "./pages/admin"
import {
  Erro404Page,
  ConfirmacaoPage,
  EstadosVaziosPage,
  LoadingPage,
} from "./pages/misc"
import { clearAuthToken, getAuthToken } from "./lib/api"

const PAGES_WITHOUT_SHELL: Page[] = [
  "admin",
  "admin-usuarios",
  "admin-anuncios",
  "loading",
]
const PAGES_WITHOUT_FOOTER: Page[] = [
  "admin",
  "admin-usuarios",
  "admin-anuncios",
  "loading",
]

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const pageRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAuthToken()))
  const [selectedItemId, setSelectedItemId] = useState(1)
  const [messageAdId, setMessageAdId] = useState<number | null>(null)
  const [exploreCategory, setExploreCategory] = useState<string | null>(null)

  const nav = (p: Page, category?: string) => {
    setExploreCategory(p === "explorar" ? (category ?? null) : null)
    setPage(p === "perfil" && !isLoggedIn ? "login" : p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const login = () => {
    setIsLoggedIn(true)
    nav("home")
  }
  const logout = () => {
    clearAuthToken()
    setIsLoggedIn(false)
    nav("home")
  }
  const switchAccount = () => {
    clearAuthToken()
    setIsLoggedIn(false)
    nav("login")
  }
  const openItem = (id: number) => {
    setSelectedItemId(id)
    nav("detalhes-anuncio")
  }
  const openMessages = (adId: number) => {
    setMessageAdId(adId)
    nav("mensagens")
  }

  const noShell = PAGES_WITHOUT_SHELL.includes(page)
  const noFooter = PAGES_WITHOUT_FOOTER.includes(page)

  useEffect(() => {
    const pageElement = pageRef.current
    if (!pageElement) return

    const revealElements = pageElement.querySelectorAll<HTMLElement>(
      "h1, h2, p",
    )

    revealElements.forEach((element, index) => {
      element.classList.add("eo-reveal")
      element.style.setProperty(
        "--eo-reveal-delay",
        `${Math.min(index * 70, 350)}ms`,
      )
    })

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [page])

  useEffect(() => {
    const activeTimeouts = new WeakMap<HTMLElement, number>()
    const clickableSelector =
      "button:not(:disabled), a, [role='button'], [data-eo-clickable]"

    const addRipple = (event: PointerEvent) => {
      if (event.button !== 0) return
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        clickableSelector,
      )
      if (!target) return

      const bounds = target.getBoundingClientRect()
      const size = Math.ceil(Math.hypot(bounds.width, bounds.height) * 2)
      target.style.setProperty("--eo-ripple-x", `${event.clientX - bounds.left}px`)
      target.style.setProperty("--eo-ripple-y", `${event.clientY - bounds.top}px`)
      target.style.setProperty("--eo-ripple-size", `${size}px`)
      target.classList.remove("eo-ripple")
      void target.offsetWidth
      target.classList.add("eo-ripple")

      const previousTimeout = activeTimeouts.get(target)
      if (previousTimeout) window.clearTimeout(previousTimeout)
      activeTimeouts.set(
        target,
        window.setTimeout(() => target.classList.remove("eo-ripple"), 550),
      )
    }

    document.addEventListener("pointerdown", addRipple, true)
    return () => document.removeEventListener("pointerdown", addRipple, true)
  }, [])

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage nav={nav} isLoggedIn={isLoggedIn} />
      case "sobre":
        return <SobrePage nav={nav} isLoggedIn={isLoggedIn} />
      case "login":
        return <LoginPage nav={nav} onLogin={login} />
      case "cadastro":
        return <CadastroPage nav={nav} onRegister={login} />
      case "recuperar-senha":
        return <RecuperarSenhaPage nav={nav} />
      case "dashboard":
        return <DashboardPage nav={nav} />
      case "perfil":
        return (
          <PerfilPage
            nav={nav}
            onLogout={logout}
            onSwitchAccount={switchAccount}
          />
        )
      case "organizacao":
        return <OrganizacaoPage nav={nav} />
      case "adicionar-objeto":
        return <AdicionarObjetoPage nav={nav} />
      case "meus-objetos":
        return <MeusObjetosPage nav={nav} />
      case "destino-objeto":
        return <DestinoObjetoPage nav={nav} />
      case "criar-anuncio":
        return <CriarAnuncioPage nav={nav} />
      case "explorar":
        return (
          <ExplorarPage
            nav={nav}
            onSelectItem={openItem}
            initialCategory={exploreCategory}
          />
        )
      case "detalhes-anuncio":
        return <DetalhesAnuncioPage nav={nav} itemId={selectedItemId} onOpenMessages={openMessages} />
      case "minhas-publicacoes":
        return <MinhasPublicacoesPage nav={nav} />
      case "meus-interesses":
        return <MeusInteressesPage nav={nav} />
      case "solicitacao-troca":
        return <SolicitacaoTrocaPage nav={nav} />
      case "mensagens":
        return <MensagensPage nav={nav} initialAdId={messageAdId} />
      case "biblioteca":
        return <BibliotecaPage nav={nav} />
      case "roleta-tarefas":
        return <RoletaTarefasPage nav={nav} />
      case "progresso":
        return <ProgressoPage nav={nav} />
      case "pontos-coleta":
        return <PontosColetaPage />
      case "servicos":
        return <ServicosPage nav={nav} />
      case "depoimentos":
        return <DepoimentosPage />
      case "instagram":
        return <InstagramPage />
      case "admin":
        return <AdminPage nav={nav} />
      case "admin-usuarios":
        return <AdminUsuariosPage nav={nav} />
      case "admin-anuncios":
        return <AdminAnunciosPage nav={nav} />
      case "erro-404":
        return <Erro404Page nav={nav} />
      case "confirmacao":
        return <ConfirmacaoPage nav={nav} />
      case "estados-vazios":
        return <EstadosVaziosPage nav={nav} />
      case "loading":
        return <LoadingPage />
      default:
        return <Erro404Page nav={nav} />
    }
  }

  if (noShell) {
    return (
      <div key={page} ref={pageRef} className="eo-page-transition">
        {renderPage()}
      </div>
    )
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header page={page} nav={nav} isLoggedIn={isLoggedIn} onLogout={logout} />
      <main
        key={page}
        ref={pageRef}
        className="eo-page-transition"
        style={{ flex: 1 }}
      >
        {renderPage()}
      </main>
      {!noFooter && <Footer nav={nav} />}
    </div>
  )
}
