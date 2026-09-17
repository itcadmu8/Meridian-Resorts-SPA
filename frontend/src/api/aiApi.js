/**
 * @file aiApi.js
 * @description API client service for ai requests and backend communication.
 */
import client from './client'

export async function sendAiMessage({ message, sessionId, context = {} }, options = {}) {
	const payload = await client.post('/ai/chat', { message, session_id: sessionId, context }, options)
	return payload?.data ?? payload
}
// Guest AI API placeholder.