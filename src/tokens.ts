export const T = {
  purple: "#7654C8",
  lilac: "#BCA2F2",
  lilacMid: "#D2C1F2",
  lilacLight: "#EAE1F8",
  lilacFaint: "#F4EFFB",
  white: "#FFFFFF",
  surface: "#F7F4FB",
  text: "#1A1523",
  muted: "#6B6B80",
  border: "#E7DDF4",
  borderMid: "#D2C2EC",
  success: "#059669",
  successBg: "#ECFDF5",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  danger: "#DC2626",
  dangerBg: "#FEF2F2",
}

export const ff = {
  heading: "'Instrument Sans', sans-serif",
  body: "'Inter', sans-serif",
}

export type Page = "home" | "sobre" | "cadastro" | "login" | "recuperar-senha" | "dashboard" | "perfil" | "organizacao" | "adicionar-objeto" | "meus-objetos" | "destino-objeto" | "criar-anuncio" | "explorar" | "detalhes-anuncio" | "minhas-publicacoes" | "meus-interesses" | "solicitacao-troca" | "mensagens" | "biblioteca" | "roleta-tarefas" | "progresso" | "pontos-coleta" | "servicos" | "depoimentos" | "instagram" | "admin" | "admin-usuarios" | "admin-anuncios" | "erro-404" | "confirmacao" | "estados-vazios" | "loading"

export type MarketplaceItem = {
  id: number
  title: string
  cat: string
  type: string
  price: string
  city: string
  img: string
  desc: string
  condition: string
  seller: string
  sellerRating: number
  date: string
}
