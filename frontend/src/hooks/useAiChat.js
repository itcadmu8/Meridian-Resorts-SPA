import { useState } from 'react'

import { chatWithAi } from '../api/aiApi'

export function useAiChat() {
	const [messages, setMessages] = useState([
		{
			id: 'welcome',
			role: 'model',
			text: "Hello, I'm Meridian AI. I can help with reservations, spa planning, and property questions.",
		},
	])
	const [isSending, setIsSending] = useState(false)
	const [error, setError] = useState('')

	async function sendMessage(text) {
		const trimmed = text.trim()
		if (!trimmed || isSending) {
			return
		}

		const userMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed }
		const nextMessages = [...messages, userMessage]
		setMessages(nextMessages)
		setIsSending(true)
		setError('')

		try {
			const history = nextMessages.map(({ role, text: line }) => ({ role, text: line }))
			const response = await chatWithAi({ message: trimmed, history })
			setMessages((current) => [
				...current,
				{ id: `m-${Date.now()}`, role: 'model', text: response?.reply || 'No response.' },
			])
		} catch (sendError) {
			setError(sendError instanceof Error ? sendError.message : 'Unable to reach Meridian AI.')
		} finally {
			setIsSending(false)
		}
	}

	return {
		messages,
		isSending,
		error,
		sendMessage,
	}
}

export default useAiChat