import client from './client'

export async function getAuthHealth() {
	const response = await client.get('/auth/health')
	return response.data
}