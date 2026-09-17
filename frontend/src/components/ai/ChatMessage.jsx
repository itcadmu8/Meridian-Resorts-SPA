/**
 * @file ChatMessage.jsx
 * @description React component for ChatMessage.
 */
export default function ChatMessage({ message }) {
	return <article className={`chat-message ${message.role === 'user' ? 'chat-message-user' : ''}`}><span>{message.role === 'user' ? 'You' : 'Meridian AI'}</span><p>{message.content}</p>{message.sources?.length > 0 && <small>Sources: {message.sources.map((source) => source.title || source.source || source).join(', ')}</small>}</article>
}
// Chat message placeholder.