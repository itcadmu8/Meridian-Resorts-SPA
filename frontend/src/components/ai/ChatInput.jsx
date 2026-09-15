// Chat input placeholder.
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
				placeholder="Ask about stays, spa, or dining"
				disabled={disabled}
				style={{
					flex: 1,
					border: '1px solid #d7ccbb',
					borderRadius: '9px',
					padding: '10px 12px',
					fontSize: '13px',
					background: '#fff',
				}}
			/>
			<button
				type="submit"
				disabled={disabled || !value.trim()}
				style={{
					border: '1px solid #2f5d55',
					background: '#2f5d55',
					color: '#fff',
					borderRadius: '9px',
					padding: '0 14px',
					fontSize: '12px',
					fontWeight: 700,
				}}
			>
				Send
			</button>
		</form>
	)
}

export default ChatInput