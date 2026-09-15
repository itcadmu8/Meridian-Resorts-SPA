import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles } from 'lucide-react';

interface NewsletterProps {
  onSubscribe: (email: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
    onSubscribe(email);
  };

  return (
    <section className="py-14 sm:py-16 bg-[#FBF9F5] border-t border-[#EFE8DE] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0EB] border border-[#EFE8DE] text-[#C5A880] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
            Private Dispatches
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
          Receive the Meridian Journal
        </h2>
        <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
        <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed max-w-xl mx-auto">
          Be the first to discover new resort openings, seasonal private island offers,
          and curated travel inspiration delivered quarterly to your correspondence.
        </p>

        {/* Form or Confirmation */}
        <div className="mt-8 max-w-md mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#1C2826]/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#EFE8DE] rounded-full text-xs text-[#0D242E] placeholder:text-[#1C2826]/40 focus:outline-none focus:border-[#C5A880] shadow-2xs font-sans"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#0D242E] hover:bg-[#133845] text-[#FBF9F5] hover:text-[#C5A880] rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-colors duration-200 shadow-sm shrink-0"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F5F0EB] border border-[#C5A880]/40 flex items-center justify-center gap-2 text-xs font-sans text-[#0D242E]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you for your correspondence. A welcome dispatch has been sent.</span>
            </div>
          )}

          <p className="mt-3 text-[11px] text-[#1C2826]/50 font-sans">
            We honor your sanctuary. We never share your data. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
