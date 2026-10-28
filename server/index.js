import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

const app = express()
const port = Number(process.env.API_PORT || 3001)
const jwtSecret = process.env.JWT_SECRET
const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(serverDirectory, '..', 'uploads'))
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters. Set it in .env.')
}

await pool.execute(`
  CREATE TABLE IF NOT EXISTS ad_requests (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ad_id BIGINT UNSIGNED NOT NULL,
    requester_user_id BIGINT UNSIGNED NOT NULL,
    request_type ENUM('INTERESSE', 'TROCA') NOT NULL,
    status ENUM('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_ad_requests_ad_user (ad_id, requester_user_id),
    KEY idx_ad_requests_requester (requester_user_id),
    CONSTRAINT fk_ad_requests_ad
      FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    CONSTRAINT fk_ad_requests_user
      FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB
`)

await pool.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ad_id BIGINT UNSIGNED NOT NULL,
    sender_user_id BIGINT UNSIGNED NOT NULL,
    recipient_user_id BIGINT UNSIGNED NOT NULL,
    body VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_messages_conversation (ad_id, sender_user_id, recipient_user_id, created_at),
    KEY idx_messages_recipient (recipient_user_id, created_at),
    CONSTRAINT fk_messages_ad FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB
`)

await mkdir(uploadDirectory, { recursive: true })
app.use(express.json({ limit: '32kb' }))
app.use('/uploads', express.static(uploadDirectory))

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDirectory),
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()
    callback(null, `${randomUUID()}${extension}`)
  },
})

const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(Object.assign(new Error('Envie uma imagem JPG, PNG ou WEBP.'), { status: 400 }))
      return
    }
    callback(null, true)
  },
})

function issueToken(user) {
  return jwt.sign({ sub: String(user.id) }, jwtSecret, { expiresIn: '1d' })
}

function requireAuth(request, response, next) {
  const [scheme, token] = (request.headers.authorization || '').split(' ')
  if (scheme !== 'Bearer' || !token) {
    response.status(401).json({ error: 'Entre na sua conta para continuar.' })
    return
  }

  try {
    const payload = jwt.verify(token, jwtSecret)
    request.userId = Number(payload.sub)
    next()
  } catch {
    response.status(401).json({ error: 'Sua sessão expirou. Entre novamente.' })
  }
}

function normalizeUser(row) {
  return {
    id: Number(row.id),
    name: row.full_name,
    email: row.email,
    city: row.city,
    state: row.state,
  }
}

function serializeAd(row) {
  const isSale = row.operation === 'VENDA'
  return {
    id: Number(row.id),
    title: row.title,
    cat: row.category,
    type: isSale ? 'Venda' : 'Troca',
    price: isSale ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(row.price)) : 'Troca',
    city: `${row.city}, ${row.state}`,
    img: row.image_path || '',
    desc: row.description,
    condition: row.condition_label,
    seller: row.seller_name,
    sellerRating: 0,
    date: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'America/Sao_Paulo' }).format(new Date(row.created_at)),
    exchangeDescription: row.exchange_description,
    ownerId: Number(row.user_id),
    status: row.status === 'PAUSADO' ? 'Pausado' : row.status === 'CONCLUIDO' ? 'Concluído' : 'Ativo',
    views: Number(row.view_count || 0),
  }
}

const adSelect = `
  SELECT ads.*, users.full_name AS seller_name
  FROM ads
  INNER JOIN users ON users.id = ads.user_id
`

function parseAd(body) {
  const title = String(body.title || '').trim()
  const description = String(body.description || '').trim()
  const category = String(body.category || '').trim()
  const condition = String(body.condition || '').trim()
  const city = 'Blumenau'
  const state = 'Santa Catarina'
  const type = body.type === 'Venda' || body.type === 'VENDA' ? 'VENDA' : body.type === 'Troca' || body.type === 'TROCA' ? 'TROCA' : null
  const price = type === 'VENDA' ? Number(body.price) : null
  const exchangeDescription = type === 'TROCA' ? String(body.exchange || body.exchangeDescription || '').trim() : null

  if (!title || title.length > 140) throw Object.assign(new Error('Informe um título com até 140 caracteres.'), { status: 400 })
  if (!description || description.length > 10000) throw Object.assign(new Error('Informe uma descrição com até 10.000 caracteres.'), { status: 400 })
  if (!category || category.length > 80 || !condition || condition.length > 60) throw Object.assign(new Error('Categoria ou estado de conservação inválido.'), { status: 400 })
  if (!type) throw Object.assign(new Error('Escolha Venda ou Troca.'), { status: 400 })
  if (type === 'VENDA' && (!Number.isFinite(price) || price <= 0)) throw Object.assign(new Error('Informe um preço válido para a venda.'), { status: 400 })
  if (type === 'TROCA' && !exchangeDescription) throw Object.assign(new Error('Informe o que deseja receber em troca.'), { status: 400 })
  if (!city || !state) throw Object.assign(new Error('Informe cidade e estado.'), { status: 400 })

  return { title, description, category, condition, city, state, type, price, exchangeDescription }
}

app.get('/api/health', async (_request, response) => {
  await pool.query('SELECT 1')
  response.json({ status: 'ok', database: 'connected' })
})

app.post('/api/auth/register', async (request, response) => {
  const body = request.body ?? {}
  const fullName = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  const city = 'Blumenau'
  const state = 'Santa Catarina'

  if (fullName.length < 2 || fullName.length > 120) {
    return response.status(400).json({ error: 'Informe seu nome completo.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return response.status(400).json({ error: 'Informe um e-mail válido.' })
  }
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return response.status(400).json({ error: 'A senha deve ter entre 8 e 72 caracteres.' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password_hash, city, state) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, passwordHash, city, state],
    )
    const user = { id: result.insertId, full_name: fullName, email, city, state }
    response.status(201).json({ token: issueToken(user), user: normalizeUser(user) })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ error: 'Este e-mail já está cadastrado.' })
    }
    throw error
  }
})

app.post('/api/auth/login', async (request, response) => {
  const email = String(request.body.email || '').trim().toLowerCase()
  const password = String(request.body.password || '')
  const [rows] = await pool.execute(
    'SELECT id, full_name, email, password_hash, city, state FROM users WHERE email = ? LIMIT 1',
    [email],
  )
  const user = rows[0]
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return response.status(401).json({ error: 'E-mail ou senha incorretos.' })
  }
  response.json({ token: issueToken(user), user: normalizeUser(user) })
})

app.get('/api/auth/me', requireAuth, async (request, response) => {
  const [rows] = await pool.execute(
    'SELECT id, full_name, email, city, state FROM users WHERE id = ? LIMIT 1',
    [request.userId],
  )
  if (!rows[0]) return response.status(404).json({ error: 'Conta não encontrada.' })
  response.json({ user: normalizeUser(rows[0]) })
})

app.get('/api/ads', async (request, response) => {
  const clauses = ['ads.status = ?']
  const values = ['ATIVO']
  const search = String(request.query.q || '').trim()
  const type = String(request.query.type || '').trim()
  const category = String(request.query.category || '').trim()
  const condition = String(request.query.condition || '').trim()

  if (search) {
    clauses.push('(ads.title LIKE ? OR ads.description LIKE ? OR ads.category LIKE ?)')
    values.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  if (type) {
    const operation = type === 'Venda' || type === 'VENDA' ? 'VENDA' : type === 'Troca' || type === 'TROCA' ? 'TROCA' : null
    if (!operation) return response.status(400).json({ error: 'Tipo de operação inválido.' })
    clauses.push('ads.operation = ?')
    values.push(operation)
  }
  if (category) {
    clauses.push('ads.category = ?')
    values.push(category)
  }
  if (condition) {
    clauses.push('ads.condition_label = ?')
    values.push(condition)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const [rows] = await pool.execute(`${adSelect} ${where} ORDER BY ads.created_at DESC LIMIT 100`, values)
  response.json({ ads: rows.map(serializeAd) })
})

app.get('/api/ads/mine', requireAuth, async (request, response) => {
  const [rows] = await pool.execute(`${adSelect} WHERE ads.user_id = ? ORDER BY ads.created_at DESC`, [request.userId])
  response.json({ ads: rows.map(serializeAd) })
})

app.get('/api/dashboard/stats', requireAuth, async (request, response) => {
  const [rows] = await pool.execute(
    `SELECT
       COUNT(CASE WHEN operation = 'VENDA' THEN 1 END) AS products_sold,
       COUNT(CASE WHEN operation = 'TROCA' THEN 1 END) AS products_exchanged
     FROM ads
     WHERE user_id = ? AND status = 'CONCLUIDO'`,
    [request.userId],
  )

  response.json({
    productsSold: Number(rows[0].products_sold),
    productsExchanged: Number(rows[0].products_exchanged),
  })
})

app.post('/api/ads', requireAuth, uploadImage.single('image'), async (request, response) => {
  try {
    const ad = parseAd(request.body)
    const imagePath = request.file ? `/uploads/${request.file.filename}` : null

    const [result] = await pool.execute(
      `INSERT INTO ads (
        user_id,
        title,
        description,
        category,
        condition_label,
        operation,
        price,
        exchange_description,
        city,
        state,
        image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.userId,
        ad.title,
        ad.description,
        ad.category,
        ad.condition,
        ad.type,
        ad.price,
        ad.exchangeDescription,
        ad.city,
        ad.state,
        imagePath,
      ],
    )

    const [rows] = await pool.execute(
      `${adSelect} WHERE ads.id = ? AND ads.user_id = ?`,
      [result.insertId, request.userId],
    )

    response.status(201).json({ ad: serializeAd(rows[0]) })
  } catch (error) {
    if (request.file) {
      await rm(path.join(uploadDirectory, request.file.filename), { force: true })
    }

    throw error
  }
})

app.get('/api/ads/:id', async (request, response) => {
  const id = Number(request.params.id)
  if (!Number.isSafeInteger(id) || id < 1) return response.status(400).json({ error: 'Anúncio inválido.' })
  await pool.execute('UPDATE ads SET view_count = view_count + 1 WHERE id = ? AND status = \'ATIVO\'', [id])
  const [rows] = await pool.execute(`${adSelect} WHERE ads.id = ? AND ads.status = 'ATIVO' LIMIT 1`, [id])
  if (!rows[0]) return response.status(404).json({ error: 'Anúncio não encontrado.' })
  response.json({ ad: serializeAd(rows[0]) })
})

app.post('/api/requests', requireAuth, async (request, response) => {
  const body = request.body ?? {}
  const adId = Number(body.anuncio_id)
  const requestType = String(body.tipo_solicitacao || '').trim().toUpperCase()
  const allowedTypes = ['INTERESSE', 'TROCA']

  if (!Number.isSafeInteger(adId) || adId < 1 || !allowedTypes.includes(requestType)) {
    return response.status(400).json({ error: 'Dados da solicitação inválidos.' })
  }

  const [ads] = await pool.execute(
    `SELECT id, user_id, operation
     FROM ads
     WHERE id = ? AND status = 'ATIVO'
     LIMIT 1`,
    [adId],
  )

  const ad = ads[0]

  if (!ad) {
    return response.status(404).json({ error: 'Anúncio não encontrado ou indisponível.' })
  }

  if (String(ad.user_id) === String(request.userId)) {
    return response.status(400).json({ error: 'Você não pode solicitar seu próprio anúncio.' })
  }

  if (requestType === 'TROCA' && ad.operation !== 'TROCA') {
    return response.status(400).json({ error: 'Este anúncio não está disponível para troca.' })
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO ad_requests (ad_id, requester_user_id, request_type)
       VALUES (?, ?, ?)`,
      [adId, request.userId, requestType],
    )

    return response.status(201).json({
      request: {
        id: result.insertId,
        adId,
        type: requestType,
        status: 'PENDENTE',
      },
    })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ error: 'Você já solicitou este anúncio.' })
    }

    throw error
  }
})

app.get('/api/requests/mine', requireAuth, async (request, response) => {
  const direction = request.query.direction === 'received' ? 'received' : 'sent'
  const type = String(request.query.type || '').trim()
  if (type && type !== 'INTERESSE' && type !== 'TROCA') {
    return response.status(400).json({ error: 'Tipo de solicitação inválido.' })
  }

  const where = direction === 'received' ? 'ads.user_id = ?' : 'requests.requester_user_id = ?'
  const values = [request.userId]
  const typeClause = type ? ' AND requests.request_type = ?' : ''
  if (type) values.push(type)

  const [rows] = await pool.execute(
    `SELECT requests.id, requests.ad_id, ads.title AS ad_title, requests.request_type,
            requests.status, requests.created_at,
            requester.full_name AS requester_name, owner.full_name AS owner_name
     FROM ad_requests AS requests
     INNER JOIN ads ON ads.id = requests.ad_id
     INNER JOIN users AS requester ON requester.id = requests.requester_user_id
     INNER JOIN users AS owner ON owner.id = ads.user_id
     WHERE ${where}${typeClause}
     ORDER BY requests.created_at DESC`,
    values,
  )

  response.json({
    requests: rows.map(row => ({
      id: Number(row.id),
      adId: Number(row.ad_id),
      adTitle: row.ad_title,
      type: row.request_type,
      status: row.status,
      counterpartName: direction === 'received' ? row.requester_name : row.owner_name,
      createdAt: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'America/Sao_Paulo' }).format(new Date(row.created_at)),
    })),
  })
})

async function findConversation(adId, userId) {
  const [rows] = await pool.execute(
    `SELECT requests.id, requests.ad_id, requests.requester_user_id,
            ads.user_id AS owner_user_id, ads.title,
            requester.full_name AS requester_name, owner.full_name AS owner_name
     FROM ad_requests AS requests
     INNER JOIN ads ON ads.id = requests.ad_id
     INNER JOIN users AS requester ON requester.id = requests.requester_user_id
     INNER JOIN users AS owner ON owner.id = ads.user_id
     WHERE requests.ad_id = ?
       AND (requests.requester_user_id = ? OR ads.user_id = ?)
     LIMIT 1`,
    [adId, userId, userId],
  )
  return rows[0] || null
}

app.post('/api/messages/start', requireAuth, async (request, response) => {
  const adId = Number(request.body?.adId)
  if (!Number.isSafeInteger(adId) || adId < 1) {
    return response.status(400).json({ error: 'AnÃºncio invÃ¡lido.' })
  }

  const [ads] = await pool.execute(
    `SELECT id, user_id, operation
     FROM ads
     WHERE id = ? AND status = 'ATIVO'
     LIMIT 1`,
    [adId],
  )
  const ad = ads[0]
  if (!ad) return response.status(404).json({ error: 'AnÃºncio nÃ£o encontrado ou indisponÃ­vel.' })
  if (Number(ad.user_id) === request.userId) {
    return response.status(400).json({ error: 'VocÃª nÃ£o pode iniciar uma conversa com seu prÃ³prio anÃºncio.' })
  }
  const requestType = ad.operation === 'TROCA' ? 'TROCA' : 'INTERESSE'
  await pool.execute(
    `INSERT IGNORE INTO ad_requests (ad_id, requester_user_id, request_type)
     VALUES (?, ?, ?)`,
    [adId, request.userId, requestType],
  )
  const conversation = await findConversation(adId, request.userId)
  response.status(201).json({ conversation: { id: Number(conversation.id), adId } })
})

function formatSaoPauloDateTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value))
}

function serializeMessage(row) {
  return {
    id: Number(row.id),
    senderId: Number(row.sender_user_id),
    body: row.body,
    createdAt: formatSaoPauloDateTime(row.created_at),
  }
}

app.get('/api/messages/conversations', requireAuth, async (request, response) => {
  const [rows] = await pool.execute(
    `SELECT requests.id, requests.ad_id, ads.title,
            CASE WHEN ads.user_id = ? THEN requests.requester_user_id ELSE ads.user_id END AS counterpart_id,
            CASE WHEN ads.user_id = ? THEN requester.full_name ELSE owner.full_name END AS counterpart_name,
            latest.body AS last_message, latest.created_at AS last_message_at
     FROM ad_requests AS requests
     INNER JOIN ads ON ads.id = requests.ad_id
     INNER JOIN users AS requester ON requester.id = requests.requester_user_id
     INNER JOIN users AS owner ON owner.id = ads.user_id
     LEFT JOIN messages AS latest ON latest.id = (
       SELECT candidate.id
       FROM messages AS candidate
       WHERE candidate.ad_id = requests.ad_id
         AND ((candidate.sender_user_id = requests.requester_user_id AND candidate.recipient_user_id = ads.user_id)
           OR (candidate.sender_user_id = ads.user_id AND candidate.recipient_user_id = requests.requester_user_id))
       ORDER BY candidate.created_at DESC, candidate.id DESC
       LIMIT 1
     )
     WHERE requests.request_type IN ('TROCA', 'INTERESSE')
       AND (requests.requester_user_id = ? OR ads.user_id = ?)
     ORDER BY COALESCE(latest.created_at, requests.created_at) DESC, requests.id DESC`,
    [request.userId, request.userId, request.userId, request.userId],
  )

  response.json({
    conversations: rows.map(row => ({
      id: Number(row.id),
      adId: Number(row.ad_id),
      item: row.title,
      counterpartId: Number(row.counterpart_id),
      counterpartName: row.counterpart_name,
      lastMessage: row.last_message || null,
      lastMessageAt: row.last_message_at ? formatSaoPauloDateTime(row.last_message_at) : null,
    })),
  })
})

app.get('/api/messages', requireAuth, async (request, response) => {
  const adId = Number(request.query.adId)
  if (!Number.isSafeInteger(adId) || adId < 1) return response.status(400).json({ error: 'Item invÃ¡lido.' })
  const conversation = await findConversation(adId, request.userId)
  if (!conversation) return response.status(403).json({ error: 'VocÃª nÃ£o participa desta conversa.' })

  const [rows] = await pool.execute(
    `SELECT id, sender_user_id, body, created_at
     FROM messages
     WHERE ad_id = ?
       AND ((sender_user_id = ? AND recipient_user_id = ?) OR (sender_user_id = ? AND recipient_user_id = ?))
     ORDER BY created_at ASC, id ASC`,
    [adId, conversation.requester_user_id, conversation.owner_user_id, conversation.owner_user_id, conversation.requester_user_id],
  )
  response.json({ messages: rows.map(serializeMessage) })
})

app.post('/api/messages', requireAuth, async (request, response) => {
  const adId = Number(request.body?.adId)
  const body = String(request.body?.body || '').trim()
  if (!Number.isSafeInteger(adId) || adId < 1 || !body || body.length > 2000) {
    return response.status(400).json({ error: 'Escreva uma mensagem com atÃ© 2.000 caracteres.' })
  }
  const conversation = await findConversation(adId, request.userId)
  if (!conversation) return response.status(403).json({ error: 'VocÃª nÃ£o participa desta conversa.' })

  const recipientId = Number(conversation.requester_user_id) === request.userId
    ? Number(conversation.owner_user_id)
    : Number(conversation.requester_user_id)
  const [result] = await pool.execute(
    `INSERT INTO messages (ad_id, sender_user_id, recipient_user_id, body) VALUES (?, ?, ?, ?)`,
    [adId, request.userId, recipientId, body],
  )
  const [rows] = await pool.execute('SELECT id, sender_user_id, body, created_at FROM messages WHERE id = ?', [result.insertId])
  response.status(201).json({ message: serializeMessage(rows[0]) })
})

app.patch('/api/ads/:id', requireAuth, async (request, response) => {
  const id = Number(request.params.id)
  if (!Number.isSafeInteger(id) || id < 1) return response.status(400).json({ error: 'Anúncio inválido.' })
  const [ownedRows] = await pool.execute('SELECT id FROM ads WHERE id = ? AND user_id = ? LIMIT 1', [id, request.userId])
  if (!ownedRows[0]) return response.status(404).json({ error: 'Anúncio não encontrado.' })

  const updates = []
  const values = []
  if (request.body.title !== undefined) {
    const title = String(request.body.title).trim()
    if (!title || title.length > 140) return response.status(400).json({ error: 'Informe um título com até 140 caracteres.' })
    updates.push('title = ?')
    values.push(title)
  }
  if (request.body.status !== undefined) {
    const statusMap = { Ativo: 'ATIVO', Pausado: 'PAUSADO', 'Concluído': 'CONCLUIDO' }
    const status = statusMap[request.body.status]
    if (!status) return response.status(400).json({ error: 'Status de anúncio inválido.' })
    updates.push('status = ?')
    values.push(status)
  }
  if (updates.length === 0) return response.status(400).json({ error: 'Nenhuma alteração informada.' })

  await pool.execute(`UPDATE ads SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, [...values, id, request.userId])
  const [rows] = await pool.execute(`${adSelect} WHERE ads.id = ? AND ads.user_id = ?`, [id, request.userId])
  response.json({ ad: serializeAd(rows[0]) })
})

app.put('/api/ads/:id', requireAuth, uploadImage.single('image'), async (request, response) => {
  const id = Number(request.params.id)
  if (!Number.isSafeInteger(id) || id < 1) return response.status(400).json({ error: 'Anúncio inválido.' })
  try {
    const ad = parseAd(request.body)
    const [existingRows] = await pool.execute('SELECT image_path FROM ads WHERE id = ? AND user_id = ? LIMIT 1', [id, request.userId])
    if (!existingRows[0]) return response.status(404).json({ error: 'Anúncio não encontrado.' })
    const imagePath = request.file ? `/uploads/${request.file.filename}` : existingRows[0].image_path
    await pool.execute(
      `UPDATE ads SET title = ?, description = ?, category = ?, condition_label = ?, operation = ?, price = ?, exchange_description = ?, city = ?, state = ?, image_path = ?
       WHERE id = ? AND user_id = ?`,
      [ad.title, ad.description, ad.category, ad.condition, ad.type, ad.price, ad.exchangeDescription, ad.city, ad.state, imagePath, id, request.userId],
    )
    if (request.file && existingRows[0].image_path) {
      await rm(path.join(uploadDirectory, path.basename(existingRows[0].image_path)), { force: true })
    }
    const [rows] = await pool.execute(`${adSelect} WHERE ads.id = ? AND ads.user_id = ?`, [id, request.userId])
    response.json({ ad: serializeAd(rows[0]) })
  } catch (error) {
    if (request.file) await rm(path.join(uploadDirectory, request.file.filename), { force: true })
    throw error
  }
})

app.delete('/api/ads/:id', requireAuth, async (request, response) => {
  const id = Number(request.params.id)
  if (!Number.isSafeInteger(id) || id < 1) return response.status(400).json({ error: 'Anúncio inválido.' })
  const connection = await pool.getConnection()
  let imagePath = null
  try {
    await connection.beginTransaction()
    const [rows] = await connection.execute('SELECT image_path FROM ads WHERE id = ? AND user_id = ? LIMIT 1', [id, request.userId])
    if (!rows[0]) {
      await connection.rollback()
      return response.status(404).json({ error: 'Anúncio não encontrado.' })
    }
    imagePath = rows[0].image_path
    await connection.execute('DELETE FROM messages WHERE ad_id = ?', [id])
    await connection.execute('DELETE FROM ad_requests WHERE ad_id = ?', [id])
    await connection.execute('DELETE FROM ads WHERE id = ? AND user_id = ?', [id, request.userId])
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
  if (imagePath) await rm(path.join(uploadDirectory, path.basename(imagePath)), { force: true })
  response.status(204).end()
})

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    response.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: 'Não foi possível processar a imagem enviada.' })
    return
  }
  const status = Number(error.status) || 500
  if (status >= 500) console.error(error)
  response.status(status).json({ error: status === 500 ? 'Erro interno. Tente novamente.' : error.message })
})

app.listen(port, () => console.log(`API pronta em http://localhost:${port}`))
