// Chat input aligned with Meridian dashboard design system.
import { useState } from 'react'

function ChatInput({ onSend, disabled = false }) {
	const [value, setValue] = useState('')

	function handleSubmit(event) {
		event.preventDefault()
		const next = value.trim()
		if (!next || disabled) {
			return
		}
		onSend(next)
		setValue('')
	}

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
			<input
				value={value}
				onChange={(event) => setValue(event.target.value)}
				placeholder="Ask about stays, spa, or dining..."
				disabled={disabled}
				style={{
					flex: 1,
					border: '1px solid #d5dfdc',
					borderRadius: '8px',
					padding: '9px 12px',
					fontSize: '12px',
					background: '#f8fafa',
					color: '#163d4a',
					outline: 'none',
				}}
			/>
			<button
				type="submit"
				disabled={disabled || !value.trim()}
				style={{
					border: 'none',
					background: '#176b63',
					color: '#ffffff',
					borderRadius: '8px',
					padding: '0 16px',
					fontSize: '12px',
					fontWeight: 600,
					cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
					opacity: disabled || !value.trim() ? 0.6 : 1,
				}}
			>
				Send
			</button>
		</form>
	)
}

export default ChatInput