import { useEffect, useRef, useState } from 'react'
import { T, ff, type Page } from '../tokens'
import { Btn, Card, Field, Select, Textarea, H2, H3, SectionLabel, PageWrap, Tag, Modal, EmptyState, Alert, Avatar } from '../components/ui'
import { Icons } from '../components/icons'
import { ItemCard } from '../components/layout'
import { apiRequest, getAuthToken, type ApiAd } from '../lib/api'

type ImageAspect = 'original' | '4:3' | '1:1' | '3:4'

type ImageEditorState = {
  src: string
  name: string
  type: string
  naturalWidth: number
  naturalHeight: number
  aspect: ImageAspect
  zoom: number
  offsetX: number
  offsetY: number
}

const IMAGE_FRAME_WIDTH = 360

function aspectRatioValue(aspect: ImageAspect, naturalWidth: number, naturalHeight: number) {
  if (aspect === '1:1') return 1
  if (aspect === '4:3') return 4 / 3
  if (aspect === '3:4') return 3 / 4
  return naturalWidth > 0 && naturalHeight > 0 ? naturalWidth / naturalHeight : 4 / 3
}

function getEditorMetrics(editor: ImageEditorState) {
  const ratio = aspectRatioValue(editor.aspect, editor.naturalWidth, editor.naturalHeight)
  const frameWidth = IMAGE_FRAME_WIDTH
  const frameHeight = frameWidth / ratio
  const fitScale = Math.min(frameWidth / editor.naturalWidth, frameHeight / editor.naturalHeight)
  const scale = fitScale * editor.zoom
  const drawWidth = editor.naturalWidth * scale
  const drawHeight = editor.naturalHeight * scale
  const baseX = (frameWidth - drawWidth) / 2
  const baseY = (frameHeight - drawHeight) / 2
  const limitX = Math.max(0, (drawWidth - frameWidth) / 2)
  const limitY = Math.max(0, (drawHeight - frameHeight) / 2)
  const offsetX = Math.max(-limitX, Math.min(limitX, editor.offsetX))
  const offsetY = Math.max(-limitY, Math.min(limitY, editor.offsetY))
  return { ratio, frameWidth, frameHeight, fitScale, scale, drawWidth, drawHeight, baseX, baseY, offsetX, offsetY }
}

function clampEditorOffset(editor: ImageEditorState) {
  const metrics = getEditorMetrics(editor)
  if (metrics.offsetX === editor.offsetX && metrics.offsetY === editor.offsetY) return editor
  return { ...editor, offsetX: metrics.offsetX, offsetY: metrics.offsetY }
}

function loadImageElement(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('NÃ£o foi possÃ­vel carregar a imagem selecionada.'))
    image.src = src
  })
}

async function renderAdjustedImage(editor: ImageEditorState) {
  const metrics = getEditorMetrics(editor)
  const longest = Math.max(metrics.frameWidth, metrics.frameHeight)
  const outputScale = Math.min(4, 1600 / longest)
  const outputWidth = Math.round(metrics.frameWidth * outputScale)
  const outputHeight = Math.round(metrics.frameHeight * outputScale)
  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('NÃ£o foi possÃ­vel preparar a imagem.')
  context.fillStyle = T.lilacFaint
  context.fillRect(0, 0, outputWidth, outputHeight)
  const image = await loadImageElement(editor.src)
  context.drawImage(
    image,
    (metrics.baseX + metrics.offsetX) * outputScale,
    (metrics.baseY + metrics.offsetY) * outputScale,
    metrics.drawWidth * outputScale,
    metrics.drawHeight * outputScale,
  )
  const outputType = editor.type === 'image/png' || editor.type === 'image/webp' ? editor.type : 'image/jpeg'
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, outputType === 'image/jpeg' ? 0.92 : undefined))
  if (!blob) throw new Error('NÃ£o foi possÃ­vel salvar o ajuste da imagem.')
  const extension = outputType === 'image/png' ? 'png' : outputType === 'image/webp' ? 'webp' : 'jpg'
  const baseName = editor.name.replace(/\.[^.]+$/, '') || 'anuncio'
  const file = new File([blob], `${baseName}-ajustada.${extension}`, { type: outputType })
  const dataUrl = canvas.toDataURL(outputType, outputType === 'image/jpeg' ? 0.92 : undefined)
  return { file, dataUrl }
}

export function CriarAnuncioPage({ nav }: { nav: (p: Page) => void }) {
  const [draft, setDraft] = useState({ title: '', description: '', category: 'MÃ³veis', condition: 'Bom estado', city: 'Blumenau', state: 'Santa Catarina', type: 'Venda', price: '', exchange: '' })
  const [image, setImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageEditor, setImageEditor] = useState<ImageEditorState | null>(null)
  const [error, setError] = useState('')
  const [published, setPublished] = useState(false)
  const [isApplyingImage, setIsApplyingImage] = useState(false)
  const dragState = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null)
  const updateDraft = (key: keyof typeof draft, value: string) => setDraft(current => ({ ...current, [key]: value }))

  const openImageEditor = async (src: string, name: string, type: string) => {
    const image = await loadImageElement(src)
    setImageEditor({
      src,
      name,
      type,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      aspect: '4:3',
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    })
  }

  const selectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter no mÃ¡ximo 10 MB.')
      event.target.value = ''
      return
    }
    try {
      setError('')
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('NÃ£o foi possÃ­vel ler a imagem selecionada.'))
        reader.readAsDataURL(file)
      })
      await openImageEditor(dataUrl, file.name, file.type || 'image/jpeg')
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : 'NÃ£o foi possÃ­vel preparar a imagem selecionada.')
    } finally {
      event.target.value = ''
    }
  }

  const adjustCurrentImage = async () => {
    if (!image || !imageFile) return
    try {
      setError('')
      await openImageEditor(image, imageFile.name, imageFile.type || 'image/jpeg')
    } catch (readError) {
      setError(readError instanceof Error ? readError.message : 'NÃ£o foi possÃ­vel abrir o ajuste da imagem.')
    }
  }

  const updateEditor = (changes: Partial<ImageEditorState>) => {
    setImageEditor(current => (current ? clampEditorOffset({ ...current, ...changes }) : current))
  }

  const applyImageAdjustment = async () => {
    if (!imageEditor) return
    try {
      setIsApplyingImage(true)
      const result = await renderAdjustedImage(imageEditor)
      setImage(result.dataUrl)
      setImageFile(result.file)
      setImageEditor(null)
    } catch (adjustError) {
      setError(adjustError instanceof Error ? adjustError.message : 'NÃ£o foi possÃ­vel aplicar o ajuste da imagem.')
    } finally {
      setIsApplyingImage(false)
    }
  }

  const editorMetrics = imageEditor ? getEditorMetrics(imageEditor) : null

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
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'NÃ£o foi possÃ­vel publicar o anÃºncio.',
      )
    }
  }

  return (
    <PageWrap style={{ maxWidth: 1160 }}>
      <button onClick={() => nav('meus-objetos')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.purple, fontWeight: 600, fontSize: 14, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, fontFamily: ff.body }}>
        <Icons.ChevronLeft size={16} color={T.purple} /> Voltar
      </button>
      <SectionLabel>AnÃºncio</SectionLabel>
      <H2 style={{ marginBottom: 8 }}>Criar anÃºncio</H2>
      <p style={{ color: T.muted, marginBottom: 36, fontSize: 15, fontFamily: ff.body }}>Preencha os dados e visualize como o anÃºncio ficarÃ¡ no marketplace.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.8fr)', gap: 24, alignItems: 'start' }}>
        <Card style={{ padding: 28 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ border: `2px dashed ${T.borderMid}`, borderRadius: 12, padding: '24px 18px', textAlign: 'center', background: T.lilacFaint }}>
              {image ? <img src={image} alt="PrÃ©via da imagem selecionada" style={{ width: '100%', maxHeight: 360, height: 'auto', objectFit: 'contain', borderRadius: 8, marginBottom: 10, background: T.white }} /> : <Icons.Package size={28} color={T.purple} />}
              <span style={{ display: 'block', fontSize: 14, color: T.text, fontWeight: 600, fontFamily: ff.body }}>{image ? 'Foto do item selecionada' : 'Adicionar foto do item (opcional)'}</span>
              <span style={{ display: 'block', fontSize: 12, color: T.muted, marginTop: 4, fontFamily: ff.body }}>JPG, PNG ou WEBP Â· atÃ© 10 MB Â· ajuste tamanho e enquadramento antes de publicar</span>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 14 }}>
                <label style={{ display: 'inline-flex' }}>
                  <span style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${T.purple}`, color: T.purple, fontWeight: 600, fontSize: 13, fontFamily: ff.body, cursor: 'pointer', background: T.white }}>{image ? 'Trocar imagem' : 'Selecionar imagem'}</span>
                  <input type="file" accept="image/*" onChange={selectImage} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
                </label>
                {image && <Btn type="button" variant="outline" size="sm" onClick={adjustCurrentImage}>Ajustar imagem</Btn>}
              </div>
            </div>
            <Field label="Nome do item">
              <input required value={draft.title} onChange={event => updateDraft('title', event.target.value)} placeholder="Ex.: poltrona em Ã³timo estado" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} />
            </Field>
            <Textarea label="DescriÃ§Ã£o" placeholder="Conte sobre o item, dimensÃµes, detalhes e motivo do desapego..." rows={4} value={draft.description} onChange={value => updateDraft('description', value)} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Select label="Categoria" options={['Roupas','MÃ³veis','EletrÃ´nicos','UtensÃ­lios','Livros','Outros']} value={draft.category} onChange={value => updateDraft('category', value)} />
              <Select label="Estado de conservaÃ§Ã£o" options={['Novo com etiqueta','Novo sem uso','Ã“timo estado','Bom estado','Com avarias']} value={draft.condition} onChange={value => updateDraft('condition', value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Select label="Cidade" options={['Blumenau']} value={draft.city} onChange={value => updateDraft('city', value)} />
              <Select label="Estado" options={['Santa Catarina']} value={draft.state} onChange={value => updateDraft('state', value)} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: 'block', marginBottom: 10, fontFamily: ff.body }}>Tipo de operaÃ§Ã£o</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Venda','Troca'].map(option => (
                  <button key={option} type="button" aria-pressed={draft.type === option} onClick={() => updateDraft('type', option)} style={{ flex: '1 1 120px', padding: 12, borderRadius: 10, border: `1.5px solid ${draft.type === option ? T.purple : T.border}`, background: draft.type === option ? T.lilacFaint : T.white, cursor: 'pointer', fontFamily: ff.body, fontSize: 14, fontWeight: 600, color: draft.type === option ? T.purple : T.muted }}>{option}</button>
                ))}
              </div>
            </div>
            {draft.type === 'Venda' && <Field label="PreÃ§o (R$)"><input required type="number" min="0.01" step="0.01" value={draft.price} onChange={event => updateDraft('price', event.target.value)} placeholder="0,00" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, boxSizing: 'border-box' }} /></Field>}
            <Alert type="info">O anÃºncio serÃ¡ vinculado Ã  sua conta apÃ³s a publicaÃ§Ã£o. VocÃª pode ajustar a foto para que o item caiba na tela no formato desejado.</Alert>
            {error && <Alert type="error">{error}</Alert>}
            {published && <Alert type="success">AnÃºncio publicado com sucesso.</Alert>}
            <Btn full size="lg" type="submit">Publicar anÃºncio</Btn>
          </form>
        </Card>
        <div style={{ position: 'sticky', top: 88 }}>
          <H3 style={{ marginBottom: 14 }}>PrÃ©via do item</H3>
          <Card style={{ overflow: 'hidden' }}>
            {image ? <img src={image} alt={draft.title || 'PrÃ©via do item'} style={{ width: '100%', maxHeight: 420, height: 'auto', objectFit: 'contain', display: 'block', background: T.lilacFaint }} /> : (
              <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.lilacFaint, color: T.muted }}>
                <Icons.Package size={28} color={T.lilac} />
                <span style={{ fontSize: 13, fontFamily: ff.body }}>A prÃ©via da foto aparecerÃ¡ aqui</span>
              </div>
            )}
            <div style={{ padding: 18 }}>
              <Tag label={draft.type} color={draft.type === 'Troca' ? 'amber' : 'purple'} />
              <p style={{ fontSize: 12, color: T.muted, marginTop: 12, fontFamily: ff.body }}>{draft.category} Â· {draft.condition}</p>
              <H3 style={{ marginTop: 4, marginBottom: 8 }}>{draft.title || 'Nome do item'}</H3>
              <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{draft.description || 'A descriÃ§Ã£o do item aparecerÃ¡ aqui.'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, color: T.muted, fontSize: 12, fontFamily: ff.body }}>
                <span>{draft.city}, {draft.state}</span>
                <strong style={{ color: T.purple }}>{draft.type === 'Venda' && draft.price ? `R$ ${draft.price}` : 'Troca'}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {imageEditor && editorMetrics && (
        <Modal title="Ajustar foto do anÃºncio" onClose={() => { if (!isApplyingImage) setImageEditor(null) }}>
          <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.6, fontFamily: ff.body, marginBottom: 16 }}>Arraste a imagem, escolha o formato e ajuste o zoom para o item caber na tela como vocÃª deseja.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              onPointerDown={event => {
                dragState.current = { x: event.clientX, y: event.clientY, offsetX: imageEditor.offsetX, offsetY: imageEditor.offsetY }
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={event => {
                if (!dragState.current) return
                updateEditor({
                  offsetX: dragState.current.offsetX + event.clientX - dragState.current.x,
                  offsetY: dragState.current.offsetY + event.clientY - dragState.current.y,
                })
              }}
              onPointerUp={() => { dragState.current = null }}
              onPointerCancel={() => { dragState.current = null }}
              style={{ width: '100%', maxWidth: IMAGE_FRAME_WIDTH, margin: '0 auto', aspectRatio: `${editorMetrics.frameWidth} / ${editorMetrics.frameHeight}`, position: 'relative', overflow: 'hidden', borderRadius: 16, background: T.lilacFaint, border: `1px solid ${T.border}`, cursor: 'grab', touchAction: 'none' }}
            >
              <img
                src={imageEditor.src}
                alt="Ajuste da foto do anÃºncio"
                draggable={false}
                style={{
                  position: 'absolute',
                  left: editorMetrics.baseX + editorMetrics.offsetX,
                  top: editorMetrics.baseY + editorMetrics.offsetY,
                  width: editorMetrics.drawWidth,
                  height: editorMetrics.drawHeight,
                  maxWidth: 'none',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: 'block', marginBottom: 8, fontFamily: ff.body }}>Formato</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([
                  ['original', 'Original'],
                  ['4:3', 'Paisagem (4:3)'],
                  ['1:1', 'Quadrado (1:1)'],
                  ['3:4', 'Retrato (3:4)'],
                ] as [ImageAspect, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateEditor({ aspect: value, offsetX: 0, offsetY: 0 })}
                    style={{ padding: '8px 12px', borderRadius: 999, border: `1.5px solid ${imageEditor.aspect === value ? T.purple : T.border}`, background: imageEditor.aspect === value ? T.lilacFaint : T.white, color: imageEditor.aspect === value ? T.purple : T.muted, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: ff.body }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Field label={`Tamanho da imagem (${Math.round(imageEditor.zoom * 100)}%)`}>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={imageEditor.zoom}
                onChange={event => updateEditor({ zoom: Number(event.target.value) })}
                style={{ width: '100%' }}
              />
            </Field>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Btn type="button" variant="soft" size="sm" onClick={() => updateEditor({ zoom: 1, offsetX: 0, offsetY: 0 })}>Centralizar</Btn>
              <Btn type="button" variant="soft" size="sm" onClick={() => updateEditor({ zoom: Math.max(1, Number((imageEditor.zoom - 0.1).toFixed(2))) })}>- Zoom</Btn>
              <Btn type="button" variant="soft" size="sm" onClick={() => updateEditor({ zoom: Math.min(3, Number((imageEditor.zoom + 0.1).toFixed(2))) })}>+ Zoom</Btn>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn type="button" full disabled={isApplyingImage} onClick={applyImageAdjustment}>{isApplyingImage ? 'Aplicando ajuste...' : 'Aplicar ajuste'}</Btn>
              <Btn type="button" full variant="outline" disabled={isApplyingImage} onClick={() => setImageEditor(null)}>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </PageWrap>
  )
}


export function ExplorarPage({ nav, onSelectItem, initialCategory, initialType }: { nav: (p: Page) => void; onSelectItem?: (id: number) => void; initialCategory?: string | null; initialType?: string | null }) {
  const [items, setItems] = useState<ApiAd[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string | null>(initialType ?? null)
  const [cat, setCat] = useState<string | null>(initialCategory ?? null)
  const [condition, setCondition] = useState('Qualquer estado')
  const [sort, setSort] = useState('Mais recentes')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const types = ['Venda','Troca']
  const cats = ['Roupas','CalÃ§ados','EletrÃ´nicos','MÃ³veis','Livros','UtensÃ­lios','Outros']
  useEffect(() => {
    let active = true
    apiRequest<{ ads: ApiAd[] }>('/ads')
      .then(result => { if (active) setItems(result.ads) })
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'NÃ£o foi possÃ­vel carregar os anÃºncios.') })
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
    if (sort === 'Menor preÃ§o') {
      const price = (value: string) => value === 'GrÃ¡tis' ? 0 : value === 'Troca' ? Number.POSITIVE_INFINITY : Number(value.replace(/[^\d,]/g, '').replace(',', '.'))
      return price(a.price) - price(b.price)
    }
    if (sort === 'Maior preÃ§o') {
      const price = (value: string) => value === 'GrÃ¡tis' ? 0 : value === 'Troca' ? Number.POSITIVE_INFINITY : Number(value.replace(/[^\d,]/g, '').replace(',', '.'))
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
                <Select label="" options={['Qualquer estado','Novo','Ã“timo estado','Bom estado','Com avarias']} value={condition} onChange={setCondition} />
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
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar anÃºncios em Blumenau, Santa Catarina..."
                  style={{ width: '100%', padding: '11px 14px 11px 42px', borderRadius: 10, border: `1.5px solid ${T.borderMid}`, fontSize: 14, fontFamily: ff.body, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <Select label="" options={['Mais recentes','Menor preÃ§o','Maior preÃ§o']} value={sort} onChange={setSort} style={{ width: 160 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setView('grid')} style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${view === 'grid' ? T.purple : T.border}`, background: view === 'grid' ? T.lilacFaint : T.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Grid size={15} color={view === 'grid' ? T.purple : T.muted} />
                </button>
                <button onClick={() => setView('list')} style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${view === 'list' ? T.purple : T.border}`, background: view === 'list' ? T.lilacFaint : T.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.List size={15} color={view === 'list' ? T.purple : T.muted} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: 14, color: T.muted, fontFamily: ff.body }}>{filtered.length} {filtered.length === 1 ? 'anÃºncio' : 'anÃºncios'} encontrado{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {isLoading ? (
            <p style={{ padding: 40, textAlign: 'center', color: T.muted, fontFamily: ff.body }}>Carregando anÃºncios...</p>
          ) : loadError ? (
            <Alert type="error">{loadError}</Alert>
          ) : filtered.length === 0 ? (
            <EmptyState icon={<Icons.Search size={28} color={T.lilac} />} title="Nenhum anÃºncio encontrado" subtitle="Tente outros filtros ou termos de busca." action="Limpar filtros" onAction={() => { setType(null); setCat(null); setCondition('Qualquer estado'); setSearch('') }} />
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
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}><Tag label={item.type} color={item.type === 'DoaÃ§Ã£o' ? 'green' : item.type === 'Troca' ? 'amber' : 'purple'} /></div>
                    <p style={{ fontFamily: ff.heading, fontWeight: 600, fontSize: 15, color: T.text, marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>{item.condition} Â· {item.city}</p>
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

export function DetalhesAnuncioPage({ nav, itemId = 1, onOpenMessages, onRequireLogin }: { nav: (p: Page) => void; itemId?: number; onOpenMessages?: (adId: number) => void; onRequireLogin?: (adId: number) => void }) {
  const [item, setItem] = useState<ApiAd | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [requestError, setRequestError] = useState('')
  const [isStartingMessage, setIsStartingMessage] = useState(false)
  useEffect(() => {
    let active = true
    setIsLoading(true)
    setRequestError('')
    apiRequest<{ ad: ApiAd }>(`/ads/${itemId}`)
      .then(result => { if (active) setItem(result.ad) })
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'NÃ£o foi possÃ­vel carregar o anÃºncio.') })
      .finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [itemId])

  useEffect(() => {
    if (!getAuthToken()) {
      setCurrentUserId(null)
      return
    }
    let active = true
    apiRequest<{ user: { id: number } }>('/auth/me')
      .then(result => { if (active) setCurrentUserId(Number(result.user.id)) })
      .catch(() => { if (active) setCurrentUserId(null) })
    return () => { active = false }
  }, [])

  const openConversation = async () => {
    if (!getAuthToken()) {
      if (onRequireLogin) onRequireLogin(itemId)
      else nav('login')
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
    return <div style={{ padding: 64, textAlign: 'center', color: T.muted }}>Carregando anÃºncio...</div>
  }

  if (!item) {
    return (
      <div style={{ padding: '52px 32px', maxWidth: 760, margin: '0 auto' }}>
        <EmptyState icon={<Icons.Package size={28} color={T.lilac} />} title="AnÃºncio indisponÃ­vel" subtitle={loadError || 'Este anÃºncio nÃ£o foi encontrado.'} action="Explorar itens" onAction={() => nav('explorar')} />
      </div>
    )
  }

  const isOwner = currentUserId !== null && currentUserId === item.ownerId
  const contactLabel = item.type === 'Troca'
    ? 'Enviar mensagem para combinar a troca'
    : 'Enviar mensagem para combinar a compra'

  return (
    <div style={{ padding: '52px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <button onClick={() => nav('explorar')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.purple, fontWeight: 600, fontSize: 14, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, fontFamily: ff.body }}>
        <Icons.ChevronLeft size={16} color={T.purple} /> Voltar para explorar
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Fotos */}
        <div>
          {item.img ? <img src={item.img} alt={item.title} style={{ width: '100%', maxHeight: 520, height: 'auto', objectFit: 'contain', borderRadius: 20, background: T.lilacFaint }} /> : (
            <div style={{ width: '100%', height: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 20, background: T.lilacFaint, color: T.muted }}>
              <Icons.Package size={36} color={T.lilac} />
              <span>Este anÃºncio nÃ£o tem foto.</span>
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
            {[['Categoria',item.cat],['Estado',item.condition],['LocalizaÃ§Ã£o',item.city],['Publicado',item.date]].map(([k,v]) => (
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
                {item.sellerRating ? <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>{item.sellerRating} avaliaÃ§Ãµes</p> : null}
              </div>
            </div>
          </Card>

          {!isOwner && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn size="md" style={{ flex: 1 }} disabled={isStartingMessage} onClick={openConversation}>
                {isStartingMessage ? 'Abrindo conversa...' : contactLabel}
              </Btn>
            </div>
          )}
          {requestError && <Alert type="error">{requestError}</Alert>}
        </div>
      </div>
    </div>
  )
}

