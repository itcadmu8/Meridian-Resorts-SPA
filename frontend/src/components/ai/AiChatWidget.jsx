import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { useAiChat } from '../../hooks/useAiChat'

function AiChatWidget({ isOpen, onClose, username }) {
	const { messages, isSending, error, sendMessage } = useAiChat()

	if (!isOpen) {
		return null
	}

	return (
		<div className="guest-home-ai-panel" role="dialog" aria-label="Ask Meridian AI">
			<button
				className="guest-home-ai-close"
				type="button"
				onClick={onClose}
				aria-label="Close Ask Meridian AI"
			>
				Close
			</button>
			<h3>Ask Meridian AI</h3>
			<p>Signed in as {username}.</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', margin: '12px 0' }}>
				{messages.map((message) => <ChatMessage key={message.id} message={message} />)}
			</div>
			{error ? <p style={{ color: '#9f1239', marginBottom: '8px' }}>{error}</p> : null}
			<ChatInput onSend={sendMessage} disabled={isSending} />
		</div>
	)
}

export default AiChatWidget