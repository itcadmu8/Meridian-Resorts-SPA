const defaultApiHost = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://localhost:8000'
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiHost
const BASE_HOST = rawBaseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')

function normalizeUrl(path) {
	const cleanPath = path.startsWith('/') ? path : `/${path}`
	if (cleanPath.startsWith('/api/v1/')) {
		return `${BASE_HOST}${cleanPath}`
	}
	return `${BASE_HOST}/api/v1${cleanPath}`
}

async function request(path, options = {}) {
	const token = window.sessionStorage.getItem('meridian_access_token')
	const headers = new Headers(options.headers)

	headers.set('Accept', 'application/json')
	if (options.body && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json')
	}
	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	const url = normalizeUrl(path)
	const response = await fetch(url, {
		...options,
		headers,
	})
	const contentType = response.headers.get('content-type') || ''
	const payload = contentType.includes('application/json')
		? await response.json()
		: await response.text()

	if (!response.ok) {
		const message = typeof payload === 'object' && payload
			? payload.message || payload.detail || 'Request failed.'
			: payload || 'Request failed.'
		const error = new Error(message)
		error.status = response.status
		error.payload = payload
		throw error
	}

	return payload
}

const client = {
	get(path, options = {}) {
		const query = new URLSearchParams(options.params || {}).toString()
		return request(`${path}${query ? `?${query}` : ''}`, {
			...options,
			method: 'GET',
		})
	},
	post(path, body, options = {}) {
		return request(path, {
			...options,
			method: 'POST',
			body: JSON.stringify(body),
		})
	},
}

export default client