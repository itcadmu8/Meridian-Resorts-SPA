import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, Loader2, Sparkles } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/api';

interface DisplayMessage extends ChatMessage {
  id: string;
  reservationId?: string;
}

const WELCOME_MESSAGE: DisplayMessage = {
  id: 'welcome',
  role: 'model',
  text: "Hi, I'm Nova, your Meridian Resorts & Spa concierge. I can help you book a stay, check a reservation, look up guest preferences, or answer questions about our properties and amenities. How can I help?",
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isSending]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: DisplayMessage = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    const history = messages.map(({ role, text }) => ({ role, text }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsSending(true);

    try {
      const response = await sendChatMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: response.reply,
          reservationId: response.reservation?.reservation_id,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close concierge chat' : 'Open concierge chat'}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#0f766e] text-white shadow-lg hover:bg-[#0d6660] transition-colors flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-8rem))] bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#0f766e] text-white px-4 py-3 flex items-center gap-2 shrink-0">
            <Sparkles className="w-5 h-5" />
            <div>
              <p className="text-sm font-bold leading-tight">Nova · Meridian Concierge</p>
              <p className="text-[11px] text-teal-100 leading-tight">Ask me to book a stay or find guest info</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#0f766e] text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  {msg.reservationId && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] font-semibold text-emerald-600">
                      ✓ Reservation {msg.reservationId} confirmed
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-lg rounded-bl-none px-3 py-2 flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Nova is thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-3 border-t border-slate-100 flex items-center gap-2 shrink-0 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Nova anything..."
              disabled={isSending}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 shrink-0 rounded-lg bg-[#0f766e] text-white flex items-center justify-center hover:bg-[#0d6660] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
