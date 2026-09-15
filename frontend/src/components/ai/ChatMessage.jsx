// Chat message placeholder.
function ChatMessage({ message }) {
	const isUser = message.role === 'user'

	return (
		<div
			style={{
				alignSelf: isUser ? 'flex-end' : 'flex-start',
				maxWidth: '88%',
				padding: '10px 12px',
				borderRadius: '10px',
				background: isUser ? '#edf7f5' : '#fff6e6',
				border: '1px solid rgba(44, 32, 21, 0.15)',
				fontSize: '13px',
			}}
		>
			{message.text}
		</div>
	)
}

export default ChatMessage