import client from './client'

export async function chatWithAi({ message, history = [] }, options = {}) {
	const response = await client.post('/ai/chat', { message, history }, options)
	return response.data
}