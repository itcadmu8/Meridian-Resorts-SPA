import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
	const [value, setValue] = useState('')

	function submit(event) {
		event.preventDefault()
		if (!value.trim()) return
		onSend(value)
		setValue('')
	}

	return <form className="chat-input" onSubmit={submit}><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ask about spa, dining or hours" disabled={disabled} /><button type="submit" disabled={disabled || !value.trim()}>Send</button></form>
}
// Chat input placeholder.