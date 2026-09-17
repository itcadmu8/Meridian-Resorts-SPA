const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const API_PREFIX = '/api/v1'

function withPrefix(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${API_PREFIX}${normalized}`
}

function toQueryString(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    search.set(key, String(value))
  })
  const result = search.toString()
  return result ? `?${result}` : ''
}

async function request(method, path, options = {}) {
  const { params, signal, body, headers = {} } = options
  const tokenRaw = localStorage.getItem('meridian-auth')
  let token = null
  try {
    token = tokenRaw ? JSON.parse(tokenRaw)?.token : null
  } catch {
    token = null
  }

  const finalHeaders = {
    Accept: 'application/json',
    ...headers,
  }
  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
  }
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${withPrefix(path)}${toQueryString(params)}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null)

  if (!response.ok) {
    const detail = typeof payload === 'object' && payload ? payload.detail : null
    throw new Error(detail || `${method} ${path} failed with ${response.status}`)
  }

  return {
    data: payload,
    status: response.status,
  }
}

const client = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options = {}) => request('POST', path, { ...options, body }),
}

export default client
