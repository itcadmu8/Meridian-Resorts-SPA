/**
 * @file useAiChat.js
 * @description Custom React hook for managing AiChat state and operations.
 */
import { useState } from 'react'

import { sendAiMessage } from '../api/aiApi'

export default function useAiChat() {
	const [messages, setMessages] = useState([])
	const [sessionId, setSessionId] = useState(() => window.crypto?.randomUUID?.() || `${Date.now()}`)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	async function sendMessage(message) {
		const cleanMessage = message.trim()
		if (!cleanMessage || isLoading) return
		setError('')
		setMessages((current) => [...current, { role: 'user', content: cleanMessage }])
		setIsLoading(true)
		try {
			const response = await sendAiMessage({ message: cleanMessage, sessionId })
			if (response.session_id) setSessionId(response.session_id)
			setMessages((current) => [...current, { role: 'assistant', content: response.message || response.response || 'I could not find an answer for that request.', sources: response.sources || [] }])
		} catch (requestError) {
			setError(requestError.message || 'Meridian AI is unavailable right now.')
		} finally {
			setIsLoading(false)
		}
	}

	function resetChat() {
		setMessages([])
		setSessionId(window.crypto?.randomUUID?.() || `${Date.now()}`)
		setError('')
	}

	return { messages, isLoading, error, sendMessage, resetChat }
}
// Guest AI chat hook placeholder.