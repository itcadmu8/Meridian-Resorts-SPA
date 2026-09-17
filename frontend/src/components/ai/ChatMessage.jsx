// Chat message component aligned with Meridian dashboard design system.
function ChatMessage({ message }) {
	const isUser = message.role === 'user'

	return (
		<div
			style={{
				alignSelf: isUser ? 'flex-end' : 'flex-start',
				maxWidth: '88%',
				padding: '10px 14px',
				borderRadius: '8px',
				background: isUser ? '#176b63' : '#ffffff',
				color: isUser ? '#ffffff' : '#163d4a',
				border: isUser ? 'none' : '1px solid #d5dfdc',
				boxShadow: '0 1px 2px rgba(23, 32, 31, 0.05)',
				fontSize: '12.5px',
				lineHeight: '1.45',
			}}
		>
			{message.text}
		</div>
	)
}

export default ChatMessage