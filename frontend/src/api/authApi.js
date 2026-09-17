/**
 * @file authApi.js
 * @description API client service for auth requests and backend communication.
 */
import client from './client'

function unwrap(payload) {
	return payload?.data ?? payload
}

export async function login({ username, password, role }) {
	const endpoint = role === 'GUEST' ? '/auth/guest/login' : '/auth/login'
	const payload = await client.post(endpoint, { username, password })
	return unwrap(payload)
}

export async function getCurrentUser() {
	const payload = await client.get('/auth/me')
	return unwrap(payload)
}

export async function logout() {
	try {
		await client.post('/auth/logout', {})
	} finally {
		window.sessionStorage.removeItem('meridian_access_token')
		window.sessionStorage.removeItem('meridian_user')
	}
}