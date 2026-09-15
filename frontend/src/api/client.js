const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const API_BASE_URL = configuredBaseUrl.endsWith('/api/v1')
	? configuredBaseUrl
	: `${configuredBaseUrl.replace(/\/$/, '')}/api/v1`

async function request(path, options = {}) {
	const token = window.localStorage.getItem('meridian_access_token')
	const headers = new Headers(options.headers)

	headers.set('Accept', 'application/json')
	if (options.body && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json')
	}
	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
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