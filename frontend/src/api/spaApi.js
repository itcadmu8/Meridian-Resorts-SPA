import client from './client'

export async function getSpaServices(options = {}) {
	const response = await client.get('/spa', options)
	return Array.isArray(response.data) ? response.data : []
}