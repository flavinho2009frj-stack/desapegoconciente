import { useEffect, useState } from "react"
import { T, ff, type Page } from "../../tokens"
import { Btn, Card, Field, H2, SectionLabel, PageWrap, Tag, Modal, EmptyState, Alert } from "../../components/ui"
import { Icons } from "../../components/icons"
import { SidebarLayout, UserSidebar } from "../../components/layout"
import { apiRequest, type ApiAd } from "../../lib/api"
export function MinhasPublicacoesPage({ nav }: { nav: (p: Page) => void }) {
  const [tab, setTab] = useState('Ativos')
  const tabs = ['Ativos', 'Pausados', 'Concluídos']
  const [pubs, setPubs] = useState<ApiAd[]>([])
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  useEffect(() => {
    let active = true
    apiRequest<{ ads: ApiAd[] }>('/ads/mine')
      .then(result => { if (active) setPubs(result.ads) })
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'NÃ£o foi possível carregar suas publicaÃ§Ãµes.') })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])
  const statusByTab: Record<string, ApiAd['status']> = {
    Ativos: 'Ativo',
    Pausados: 'Pausado',
    Concluídos: 'Concluído',
  }
  const shown = pubs.filter(p => p.status === statusByTab[tab])

  const publicationCount = pubs.length === 1
    ? '1 publicaÃ§Ã£o no total'
    : `${pubs.length} publicaÃ§Ãµes no total`

  const updateAd = async (id: number, changes: { title?: string; status?: ApiAd['status'] }) => {
    try {
      const result = await apiRequest<{ ad: ApiAd }>(`/ads/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
      setPubs(items => items.map(item => item.id === id ? result.ad : item))
      setEditId(null)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'NÃ£o foi possível atualizar o anÃºncio.')
    }
  }

  const deleteAd = async (id: number) => {
    try {
      await apiRequest<void>(`/ads/${id}`, { method: 'DELETE' })
      setPubs(items => items.filter(item => item.id !== id))
      setDeleteId(null)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'NÃ£o foi possível excluir o anÃºncio.')
    }
  }

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="minhas-publicacoes" />}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
                    <SectionLabel>AnÃºncios</SectionLabel>
                      <H2 style={{ marginBottom: 4 }}>Minhas publicaÃ§Ãµes</H2>
                      <p style={{ color: T.muted, fontSize: 15, fontFamily: ff.body }}>{publicationCount}</p>
            </div>
            <Btn onClick={() => nav('criar-anuncio')}>+ Novo anÃºncio</Btn>
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: T.surface, borderRadius: 12, padding: 4, width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: tab === t ? T.white : 'transparent', color: tab === t ? T.purple : T.muted, fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: 'pointer', fontFamily: ff.body, boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.07)' : 'none', transition: 'all 0.15s' }}>{t}</button>
            ))}
          </div>

          {loadError && <Alert type="error">{loadError}</Alert>}
          {isLoading ? (
            <p style={{ padding: 32, textAlign: 'center', color: T.muted }}>Carregando publicaÃ§Ãµes...</p>
          ) : shown.length === 0 ? (
            pubs.length === 0 ? (
              <EmptyState icon={<Icons.Tag size={28} color={T.lilac} />} title="Nenhuma publicaÃ§Ã£o" subtitle="Crie seu primeiro anÃºncio e comece a vender ou trocar." action="Criar anÃºncio" onAction={() => nav('criar-anuncio')} />
            ) : (
              <EmptyState icon={<Icons.Tag size={28} color={T.lilac} />} title="Nenhuma publicaÃ§Ã£o nesta aba." />
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {shown.map(item => {
                const sc = item.status === 'Ativo' ? 'green' : item.status === 'Pausado' ? 'amber' : 'gray'
                const statusActions: { label: string; status: ApiAd['status'] }[] =
                  item.status === 'Ativo'
                    ? [{ label: 'Pausar', status: 'Pausado' }, { label: 'Concluir', status: 'Concluído' }]
                    : item.status === 'Pausado'
                      ? [{ label: 'Reativar', status: 'Ativo' }, { label: 'Concluir', status: 'Concluído' }]
                      : [{ label: 'Reativar', status: 'Ativo' }, { label: 'Pausar', status: 'Pausado' }]
                return (
                  <Card key={item.id} style={{ padding: 18 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <img src={item.img} alt={item.title} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0, background: T.lilacFaint }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                          <p style={{ fontFamily: ff.heading, fontWeight: 600, fontSize: 15, color: T.text }}>{item.title}</p>
                          <Tag label={item.status} color={sc as any} />
                        </div>
                        <p style={{ fontSize: 13, color: T.muted, fontFamily: ff.body }}>{item.price} Â· {item.type}</p>
                        <p style={{ fontSize: 12, color: T.muted, marginTop: 4, fontFamily: ff.body }}>{item.views} visualizaÃ§Ãµes Â· Publicado em {item.date}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <Btn variant="soft" size="sm" onClick={() => { setEditId(item.id); setEditTitle(item.title) }}>Editar</Btn>
                        {statusActions.map(action => (
                          <Btn key={action.status} variant="outline" size="sm" onClick={() => updateAd(item.id, { status: action.status })}>{action.label}</Btn>
                        ))}
                        <Btn variant="ghost" size="sm" style={{ color: T.danger }} onClick={() => setDeleteId(item.id)}>Excluir</Btn>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </SidebarLayout>
      {editId !== null && (
        <Modal title="Editar publicaÃ§Ã£o" onClose={() => setEditId(null)}>
          <Field label="Nome do item">
            <input value={editTitle} onChange={event => setEditTitle(event.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} />
          </Field>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Btn full disabled={!editTitle.trim()} onClick={() => updateAd(editId, { title: editTitle.trim() })}>Salvar alteraÃ§Ã£o</Btn>
            <Btn full variant="outline" onClick={() => setEditId(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
      {deleteId !== null && (
        <Modal title="Excluir publicaÃ§Ã£o" onClose={() => setDeleteId(null)}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, fontFamily: ff.body, marginBottom: 20 }}>Esta aÃ§Ã£o removerÃ¡ permanentemente o anÃºncio e sua imagem.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn full variant="danger" onClick={() => deleteAd(deleteId)}>Excluir</Btn>
            <Btn full variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </PageWrap>
  )
}

