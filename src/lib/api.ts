import type { MarketplaceItem } from "../tokens"

const TOKEN_KEY = "essencia-organizada-token"

export type ApiUser = {
  id: number

  name: string

  email: string

  city: string

  state: string
}

export type ApiDashboardStats = {
  productsSold: number
  productsExchanged: number
}

export type ApiAd = MarketplaceItem & {
  exchangeDescription: string | null

  ownerId: number

  status: "Ativo" | "Pausado" | "Concluído"

  views: number
}

export type ApiAdRequest = {
  id: number

  adId: number

  adTitle: string

  type: "INTERESSE" | "TROCA"

  status: "PENDENTE" | "ACEITA" | "RECUSADA" | "CANCELADA"

  counterpartName: string

  createdAt: string
}

export type ApiConversation = {
  id: number
  adId: number
  item: string
  counterpartId: number
  counterpartName: string
  lastMessage: string | null
  lastMessageAt: string | null
}

export type ApiMessage = {
  id: number
  senderId: number
  body: string
  createdAt: string
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY)

  sessionStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)

  const token = getAuthToken()

  const isFormData = init.body instanceof FormData

  if (!isFormData && init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`/api${path}`, {
    ...init,

    headers,

    credentials: "same-origin",
  })

  if (response.status === 204) return undefined as T

  const payload = (await response.json().catch(() => null)) as {
    error?: string
  } | null

  if (!response.ok)
    throw new Error(
      payload?.error || "Não foi possível concluir a solicitação.",
    )

  return payload as T
}
