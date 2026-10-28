import { useEffect, useState } from 'react'
import { T, ff, type Page } from '../tokens'
import { Btn, Card, Field, Select, Textarea, H2, H3, SectionLabel, PageWrap, Tag, Modal, EmptyState, Alert, Avatar } from '../components/ui'
import { Icons } from '../components/icons'
import { SidebarLayout, UserSidebar, ItemCard } from '../components/layout'
import { apiRequest, getAuthToken, type ApiAd } from '../lib/api'

export function CriarAnuncioPage({ nav }: { nav: (p: Page) => void }) {
  const [draft, setDraft] = useState({ title: '', description: '', category: 'Móveis', condition: 'Bom estado', city: 'Blumenau', state: 'Santa Catarina', type: 'Venda', price: '', exchange: '' })
  const [image, setImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [published, setPublished] = useState(false)
  const updateDraft = (key: keyof typeof draft, value: string) => setDraft(current => ({ ...current, [key]: value }))

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 10 MB.')
      event.target.value = ''
      return
    }
    setError('')
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!event.currentTarget.reportValidity()) return

    if (!getAuthToken()) {
      nav('login')
      return
    }

    setError('')
    setPublished(false)

    const formData = new FormData()
    for (const [key, value] of Object.entries(draft)) {
      formData.append(key, value)
    }

    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      await apiRequest<{ ad: ApiAd }>('/ads', {
        method: 'POST',
        body: formData,
      })

      setPublished(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível publicar o anúncio.',
      )
    }
  }

  return (
    <PageWrap style={{ maxWidth: 1160 }}>
      <button onClick={() => nav('meus-objetos')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.purple, fontWeight: 600, fontSize: 14, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, fontFamily: ff.body }}>
        <Icons.ChevronLeft size={16} color={T.purple} /> Voltar
      </button>
      <SectionLabel>Anúncio</SectionLabel>
      <H2 style={{ marginBottom: 8 }}>Criar anúncio</H2>
      <p style={{ color: T.muted, marginBottom: 36, fontSize: 15, fontFamily: ff.body }}>Preencha os dados e visualize como o anúncio ficará no marketplace.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)', gap: 24, alignItems: 'start' }}>
        <Card style={{ padding: 28 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <label style={{ display: 'block', border: `2px dashed ${T.borderMid}`, borderRadius: 12, padding: '24px 18px', textAlign: 'center', background: T.lilacFaint, cursor: 'pointer' }}>
              {image ? <img src={image} alt="Prévia da imagem selecionada" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} /> : <Icons.Package size={28} color={T.purple} />}
              <span style={{ display: 'block', fontSize: 14, color: T.text, fontWeight: 600, fontFamily: ff.body }}>{image ? 'Trocar imagem' : 'Adicionar foto do item (opcional)'}</span>
              <span style={{ display: 'block', fontSize: 12, color: T.muted, marginTop: 4, fontFamily: ff.body }}>JPG, PNG ou WEBP · até 10 MB</span>
              <input type="file" accept="image/*" onChange={selectImage} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
            </label>
            <Field label="Nome do item">
              <input required value={draft.title} onChange={event => updateDraft('title', event.target.value)} placeholder="Ex.: poltrona em ótimo estado" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} />
            </Field>
            <Textarea label="Descrição" placeholder="Conte sobre o item, dimensões, detalhes e motivo do desapego..." rows={4} value={draft.description} onChange={value => updateDraft('description', value)} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Select label="Categoria" options={['Roupas','Móveis','Eletrônicos','Utensílios','Livros','Outros']} value={draft.category} onChange={value => updateDraft('category', value)} />
              <Select label="Estado de conservação" options={['Novo com etiqueta','Novo sem uso','Ótimo estado','Bom estado','Com avarias']} value={draft.condition} onChange={value => updateDraft('condition', value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Select label="Cidade" options={['Blumenau']} value={draft.city} onChange={value => updateDraft('city', value)} />
              <Select label="Estado" options={['Santa Catarina']} value={draft.state} onChange={value => updateDraft('state', value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: 'block', marginBottom: 10, fontFamily: ff.body }}>Tipo de operação</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Venda','Troca'].map(option => (
                  <button key={option} type="button" aria-pressed={draft.type === option} onClick={() => updateDraft('type', option)} style={{ flex: '1 1 120px', padding: 12, borderRadius: 10, border: `1.5px solid ${draft.type === option ? T.purple : T.border}`, background: draft.type === option ? T.lilacFaint : T.white, cursor: 'pointer', fontFamily: ff.body, fontSize: 14, fontWeight: 600, color: draft.type === option ? T.purple : T.muted }}>{option}</button>
                ))}
              </div>
            </div>
            {draft.type === 'Venda' && <Field label="Preço (R$)"><input required type="number" min="0.01" step="0.01" value={draft.price} onChange={event => updateDraft('price', event.target.value)} placeholder="0,00" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} /></Field>}
            {draft.type === 'Troca' && <Field label="O que você deseja em troca?"><input required value={draft.exchange} onChange={event => updateDraft('exchange', event.target.value)} placeholder="Ex.: livros ou utensílios de cozinha" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} /></Field>}
            <Alert type="info">O anúncio será vinculado à sua conta após a publicação.</Alert>
            {error && <Alert type="error">{error}</Alert>}
            {published && <Alert type="success">Anúncio publicado com sucesso.</Alert>}
            <Btn full size="lg" type="submit">Publicar anúncio</Btn>
          </form>
        </Card>
        <div style={{ position: 'sticky', top: 88 }}>
          <H3 style={{ marginBottom: 14 }}>Prévia do item</H3>
          <Card style={{ overflow: 'hidden' }}>
            {image ? <img src={image} alt={draft.title || 'Prévia do item'} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', background: T.lilacFaint }} /> : (
              <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.lilacFaint, color: T.muted }}>
                <Icons.Package size={28} color={T.lilac} />
                <span style={{ fontSize: 13, fontFamily: ff.body }}>A prévia da foto aparecerá aqui</span>
              </div>
            )}
            <div style={{ padding: 18 }}>
              <Tag label={draft.type} color={draft.type === 'Troca' ? 'amber' : 'purple'} />
              <p style={{ fontSize: 12, color: T.muted, marginTop: 12, fontFamily: ff.body }}>{draft.category} · {draft.condition}</p>
              <H3 style={{ marginTop: 4, marginBottom: 8 }}>{draft.title || 'Nome do item'}</H3>
              <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{draft.description || 'A descrição do item aparecerá aqui.'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: T.muted, fontSize: 12, fontFamily: ff.body }}>
                <span>{draft.city}, {draft.state}</span>
                <strong style={{ color: T.purple }}>{draft.type === 'Venda' && draft.price ? `R$ ${draft.price}` : 'Troca'}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrap>
  )
}

export function ExplorarPage({ nav, onSelectItem, initialCategory }: { nav: (p: Page) => void; onSelectItem?: (id: number) => void; initialCategory?: string | null }) {
  const [items, setItems] = useState<ApiAd[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string | null>(null)
  const [cat, setCat] = useState<string | null>(initialCategory ?? null)
  const [condition, setCondition] = useState('Qualquer estado')
  const [sort, setSort] = useState('Mais recentes')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const types = ['Venda','Troca']
  const cats = ['Roupas','Calçados','Eletrônicos','Móveis','Livros','Utensílios','Outros']
  useEffect(() => {
    let active = true
    apiRequest<{ ads: ApiAd[] }>('/ads')
      .then(result => { if (active) setItems(result.ads) })
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar os anúncios.') })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  const seenIds = new Set<number>()
  const seenListings = new Set<string>()
  const uniqueItems = items.filter(item => {
    const listingKey = [item.title, item.seller, item.type, item.city]
      .map(value => value.trim().toLocaleLowerCase())
      .join('|')
    if (seenIds.has(item.id) || seenListings.has(listingKey)) return false
    seenIds.add(item.id)
    seenListings.add(listingKey)
    return true
  })
  const filtered = uniqueItems.filter(i =>
    (!search || [i.title, i.desc, i.cat, i.city].some(value => value.toLowerCase().includes(search.toLowerCase()))) &&
    (!type || i.type === type) &&
    (!cat || i.cat === cat) &&
    (condition === 'Qualquer estado' || i.condition === condition)
  ).sort((a, b) => {
    if (sort === 'Menor preço') {
      const price = (value: string) => value === 'Grátis' ? 0 : value === 'Troca' ? Number.POSITIVE_INFINITY : Number(value.replace(/[^\d,]/g, '').replace(',', '.'))
      return price(a.price) - price(b.price)
    }
    if (sort === 'Maior preço') {
      const price = (value: string) => value === 'Grátis' ? 0 : value === 'Troca' ? Number.POSITIVE_INFINITY : Number(value.replace(/[^\d,]/g, '').replace(',', '.'))
      return price(b.price) - price(a.price)
    }
    return uniqueItems.indexOf(a) - uniqueItems.indexOf(b)
  })

  return (
    <div style={{ padding: '52px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28 }}>
        {/* Sidebar filters */}
        <div>
          <Card style={{ padding: 20 }}>
            <H3 style={{ fontSize: 15, marginBottom: 20 }}>Filtros</H3>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, fontFamily: ff.body }}>Tipo</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: ff.body, fontSize: 14 }}>
                  <input type="radio" name="type" checked={type === null} onChange={() => setType(null)} style={{ accentColor: T.purple }} /> Todos
                </label>
                {types.map(t => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: ff.body, fontSize: 14 }}>
                    <input type="radio" name="type" checked={type === t} onChange={() => setType(t)} style={{ accentColor: T.purple }} /> {t}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: T.border, margin: '16px 0' }} />
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, fontFamily: ff.body }}>Categoria</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cats.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: ff.body, fontSize: 14 }}>
                    <input type="checkbox" checked={cat === c} onChange={() => setCat(cat === c ? null : c)} style={{ accentColor: T.purple }} /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: T.border, margin: '16px 0' }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10, fontFamily: ff.body }}>Estado</p>
                <Select label="" options={['Qualquer estado','Novo','Ótimo estado','Bom estado','Com avarias']} value={condition} onChange={setCondition} />
            </div>
            <button onClick={() => { setType(null); setCat(null); setCondition('Qualquer estado'); setSearch('') }} style={{ marginTop: 16, background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer', fontFamily: ff.body }}>Limpar filtros</button>
          </Card>
        </div>

        {/* Results */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Marketplace</SectionLabel>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Icons.Search size={16} />
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar anúncios em Blumenau, Santa Catarina..."
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <Select label="" options={['Mais recentes','Menor preço','Maior preço']} value={sort} onChange={setSort} style={{ width: 160 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setView('grid')} style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${view === 'grid' ? T.purple : T.border}`, background: view === 'grid' ? T.lilacFaint : T.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Grid size={15} color={view === 'grid' ? T.purple : T.muted} />
                </button>
                <button onClick={() => setView('list')} style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${view === 'list' ? T.purple : T.border}`, background: view === 'list' ? T.lilacFaint : T.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.List size={15} color={view === 'list' ? T.purple : T.muted} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: 14, color: T.muted, fontFamily: ff.body }}>{filtered.length} {filtered.length === 1 ? 'anúncio' : 'anúncios'} encontrado{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {isLoading ? (
            <p style={{ padding: 40, textAlign: 'center', color: T.muted, fontFamily: ff.body }}>Carregando anúncios...</p>
          ) : loadError ? (
            <Alert type="error">{loadError}</Alert>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Icons.Search size={28} color={T.lilac} />} title="Nenhum anúncio encontrado" subtitle="Tente outros filtros ou termos de busca." action="Limpar filtros" onAction={() => { setType(null); setCat(null); setCondition('Qualquer estado'); setSearch('') }} />
          ) : view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {filtered.map(item => <ItemCard key={item.id} item={item} onView={() => onSelectItem ? onSelectItem(item.id) : nav('detalhes-anuncio')} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(item => (
                <Card key={item.id} hover style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }} onClick={() => nav('detalhes-anuncio')}>
                  <img src={item.img} alt={item.title} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: T.lilacFaint }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}><Tag label={item.type} color={item.type === 'Doação' ? 'green' : item.type === 'Troca' ? 'amber' : 'purple'} /></div>
                    <p style={{ fontFamily: ff.heading, fontWeight: 600, fontSize: 15, color: T.text, marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>{item.condition} · {item.city}</p>
                  </div>
                  <p style={{ fontFamily: ff.heading, fontWeight: 700, fontSize: 17, color: T.purple, flexShrink: 0 }}>{item.price}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DetalhesAnuncioPage({ nav, itemId = 1, onOpenMessages }: { nav: (p: Page) => void; itemId?: number; onOpenMessages?: (adId: number) => void }) {
  const [item, setItem] = useState<ApiAd | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [tradeSent, setTradeSent] = useState(false)
  const [isStartingMessage, setIsStartingMessage] = useState(false)
  useEffect(() => {
    let active = true
    setIsLoading(true)
    apiRequest<{ ad: ApiAd }>(`/ads/${itemId}`)
      .then(result => { if (active) setItem(result.ad) })
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar o anúncio.') })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [itemId])

  const submitRequest = async (type: 'INTERESSE' | 'TROCA') => {
    if (!getAuthToken()) {
      nav('login')
      return
    }
    setRequestError('')
    setIsSubmittingRequest(true)
    try {
      await apiRequest<{ request: { id: number; status: 'PENDENTE' } }>('/requests', {
        method: 'POST',
        body: JSON.stringify({ anuncio_id: itemId, tipo_solicitacao: type }),
      })
      if (type === 'INTERESSE') {
        setInterestSent(true)
        setShowModal(false)
      } else {
        setTradeSent(true)
        setShowTradeModal(false)
      }
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Não foi possível enviar sua solicitação.')
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  const openConversation = async () => {
    if (!getAuthToken()) {
      nav('login')
      return
    }
    setRequestError('')
    setIsStartingMessage(true)
    try {
      await apiRequest('/messages/start', {
        method: 'POST',
        body: JSON.stringify({ adId: itemId }),
      })
      if (onOpenMessages) onOpenMessages(itemId)
      else nav('mensagens')
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'NÃ£o foi possÃ­vel abrir a conversa.')
    } finally {
      setIsStartingMessage(false)
    }
  }

  if (isLoading) {
    return <div style={{ padding: 64, textAlign: 'center', color: T.muted }}>Carregando anúncio...</div>
  }

  if (!item) {
    return (
      <div style={{ padding: '52px 32px', maxWidth: 760, margin: '0 auto' }}>
        <EmptyState icon={<Icons.Package size={28} color={T.lilac} />} title="Anúncio indisponível" subtitle={loadError || 'Este anúncio não foi encontrado.'} action="Explorar itens" onAction={() => nav('explorar')} />
      </div>
    )
  }

  return (
    <div style={{ padding: '52px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <button onClick={() => nav('explorar')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.purple, fontWeight: 600, fontSize: 14, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, fontFamily: ff.body }}>
        <Icons.ChevronLeft size={16} color={T.purple} /> Voltar para explorar
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Fotos */}
        <div>
          {item.img ? <img src={item.img} alt={item.title} style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 20, background: T.lilacFaint }} /> : (
            <div style={{ width: '100%', height: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 20, background: T.lilacFaint, color: T.muted }}>
              <Icons.Package size={36} color={T.lilac} />
              <span>Este anúncio não tem foto.</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <Tag label={item.type} color="purple" />
            <Tag label={item.cat} color="gray" />
          </div>
          <H2 style={{ marginBottom: 8 }}>{item.title}</H2>
          <p style={{ fontFamily: ff.heading, fontWeight: 700, fontSize: 32, color: T.purple, marginBottom: 16 }}>{item.price}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[['Categoria',item.cat],['Estado',item.condition],['Localização',item.city],['Publicado',item.date]].map(([k,v]) => (
              <div key={k} style={{ background: T.surface, borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 11, color: T.muted, fontFamily: ff.body, marginBottom: 2 }}>{k}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: ff.body }}>{v}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.78, fontFamily: ff.body, marginBottom: 24 }}>{item.desc}</p>

          <Card style={{ padding: 20, marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14, fontFamily: ff.body }}>Anunciante</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar name={item.seller} size={48} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 15, color: T.text, fontFamily: ff.heading }}>{item.seller}</p>
                <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>{item.city}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  {Array.from({ length: Math.round(item.sellerRating) }, (_, index) => <Icons.Star key={index} size={12} color={T.warning} />)}
                </div>
                <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>{item.sellerRating ? `${item.sellerRating} avaliações` : 'Sem avaliações'}</p>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Btn size="md" style={{ flex: 1 }} disabled={interestSent} onClick={() => { setRequestError(''); setShowModal(true) }}>
              {interestSent ? 'Interesse enviado' : 'Tenho interesse'}
            </Btn>
            <Btn size="md" variant="outline" style={{ flex: 1 }} disabled={isStartingMessage} onClick={openConversation}>{isStartingMessage ? 'Abrindo conversa...' : 'Enviar mensagem'}</Btn>
          </div>
          {interestSent && <Alert type="success">Seu interesse foi registrado com status pendente.</Alert>}
          {item.type === 'Troca' && (
            <Btn full variant="soft" style={{ marginTop: 10 }} disabled={tradeSent} onClick={() => { setRequestError(''); setShowTradeModal(true) }}>
              {tradeSent ? 'Proposta enviada' : 'Propor troca'}
            </Btn>
          )}
          {requestError && !showModal && !showTradeModal && <Alert type="error">{requestError}</Alert>}
        </div>
      </div>

      {showModal && (
        <Modal title="Confirmar interesse" onClose={() => setShowModal(false)}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, fontFamily: ff.body, marginBottom: 24 }}>Seu interesse será registrado como pendente. Depois, você poderá combinar os detalhes com o anunciante.</p>
          {requestError && <Alert type="error">{requestError}</Alert>}
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn full disabled={isSubmittingRequest} onClick={() => submitRequest('INTERESSE')}>{isSubmittingRequest ? 'Enviando...' : 'Confirmar interesse'}</Btn>
            <Btn full variant="outline" onClick={() => setShowModal(false)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
      {showTradeModal && (
        <Modal title="Propor troca" onClose={() => setShowTradeModal(false)}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, fontFamily: ff.body }}>
            Sua solicitação será registrada como pendente. Você poderá combinar os detalhes da troca com o anunciante.
          </p>
          {requestError && <div style={{ marginTop: 14 }}><Alert type="error">{requestError}</Alert></div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Btn full disabled={isSubmittingRequest} onClick={() => submitRequest('TROCA')}>{isSubmittingRequest ? 'Enviando...' : 'Enviar proposta'}</Btn>
            <Btn full variant="outline" onClick={() => setShowTradeModal(false)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

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
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar suas publicações.') })
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
    ? '1 publicação no total'
    : `${pubs.length} publicações no total`

  const updateAd = async (id: number, changes: { title?: string; status?: ApiAd['status'] }) => {
    try {
      const result = await apiRequest<{ ad: ApiAd }>(`/ads/${id}`, { method: 'PATCH', body: JSON.stringify(changes) })
      setPubs(items => items.map(item => item.id === id ? result.ad : item))
      setEditId(null)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Não foi possível atualizar o anúncio.')
    }
  }

  const deleteAd = async (id: number) => {
    try {
      await apiRequest<void>(`/ads/${id}`, { method: 'DELETE' })
      setPubs(items => items.filter(item => item.id !== id))
      setDeleteId(null)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Não foi possível excluir o anúncio.')
    }
  }

  return (
    <PageWrap>
      <SidebarLayout sidebar={<UserSidebar nav={nav} active="minhas-publicacoes" />}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
                    <SectionLabel>Anúncios</SectionLabel>
                      <H2 style={{ marginBottom: 4 }}>Minhas publicações</H2>
                      <p style={{ color: T.muted, fontSize: 15, fontFamily: ff.body }}>{publicationCount}</p>
            </div>
            <Btn onClick={() => nav('criar-anuncio')}>+ Novo anúncio</Btn>
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: T.surface, borderRadius: 12, padding: 4, width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: tab === t ? T.white : 'transparent', color: tab === t ? T.purple : T.muted, fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: 'pointer', fontFamily: ff.body, boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.07)' : 'none', transition: 'all 0.15s' }}>{t}</button>
            ))}
          </div>

          {loadError && <Alert type="error">{loadError}</Alert>}
          {isLoading ? (
            <p style={{ padding: 32, textAlign: 'center', color: T.muted }}>Carregando publicações...</p>
          ) : shown.length === 0 ? (
            pubs.length === 0 ? (
              <EmptyState icon={<Icons.Tag size={28} color={T.lilac} />} title="Nenhuma publicação" subtitle="Crie seu primeiro anúncio e comece a vender ou trocar." action="Criar anúncio" onAction={() => nav('criar-anuncio')} />
            ) : (
              <EmptyState icon={<Icons.Tag size={28} color={T.lilac} />} title="Nenhuma publicação nesta aba." />
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
                        <p style={{ fontSize: 13, color: T.muted, fontFamily: ff.body }}>{item.price} · {item.type}</p>
                        <p style={{ fontSize: 12, color: T.muted, marginTop: 4, fontFamily: ff.body }}>{item.views} visualizações · Publicado em {item.date}</p>
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
        <Modal title="Editar publicação" onClose={() => setEditId(null)}>
          <Field label="Nome do item">
            <input value={editTitle} onChange={event => setEditTitle(event.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} />
          </Field>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Btn full disabled={!editTitle.trim()} onClick={() => updateAd(editId, { title: editTitle.trim() })}>Salvar alteração</Btn>
            <Btn full variant="outline" onClick={() => setEditId(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
      {deleteId !== null && (
        <Modal title="Excluir publicação" onClose={() => setDeleteId(null)}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, fontFamily: ff.body, marginBottom: 20 }}>Esta ação removerá permanentemente o anúncio e sua imagem.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Btn full variant="danger" onClick={() => deleteAd(deleteId)}>Excluir</Btn>
            <Btn full variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </PageWrap>
  )
}
