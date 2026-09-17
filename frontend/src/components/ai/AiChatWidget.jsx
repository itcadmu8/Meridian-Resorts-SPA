/**
 * @file AiChatWidget.jsx
 * @description React component for AiChatWidget.
 */
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import useAiChat from '../../hooks/useAiChat'

export default function AiChatWidget({ onClose }) {
	const { messages, isLoading, error, sendMessage, resetChat } = useAiChat()
	return <section className="ai-widget" aria-label="Meridian AI chat"><header><div><p className="eyebrow">Concierge service</p><h2>Ask Meridian AI</h2></div><button type="button" onClick={onClose} aria-label="Close chat">×</button></header><div className="chat-messages">{messages.length === 0 && <p className="chat-intro">Tell me what you are looking for. I can explain our spa treatments, dining and property hours.</p>}{messages.map((message, index) => <ChatMessage key={`${message.role}-${index}`} message={message} />)}{isLoading && <p className="chat-loading">Meridian AI is checking the approved property information...</p>}{error && <p className="form-error" role="alert">{error}</p>}</div><div className="chat-prompts"><button type="button" onClick={() => sendMessage('What spa treatments are available?')}>Spa treatments</button><button type="button" onClick={() => sendMessage('What are the dining hours?')}>Dining hours</button></div><ChatInput onSend={sendMessage} disabled={isLoading} /><button className="chat-reset" type="button" onClick={resetChat}>Clear conversation</button></section>
}
// AI chat widget placeholder.