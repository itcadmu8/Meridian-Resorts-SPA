/**
 * @file JournalModal.tsx
 * @description UI component for guest experience JournalModal.
 */
import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Calendar, User, Sparkles } from 'lucide-react';
import { JournalArticle } from '../types';

interface JournalModalProps {
  article: JournalArticle | null;
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FBF9F5] w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-[#C5A880]/40 my-8 max-h-[90vh] flex flex-col"
      >
        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#0D242E]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D242E] via-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[11px] uppercase tracking-widest text-[#DFCDAA] font-sans">
              {article.category}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mt-1 leading-snug">
              {article.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-white/80 font-sans">
              <span>{article.author}</span>
              <span>·</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6 overflow-y-auto text-[#1C2826]/85 font-sans font-light leading-relaxed text-sm sm:text-base">
          <p className="font-serif italic text-lg sm:text-xl text-[#0D242E] leading-relaxed border-l-2 border-[#C5A880] pl-4">
            "{article.excerpt}"
          </p>

          <div className="space-y-4 pt-2">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-[#EFE8DE] flex items-center justify-between">
            <span className="text-xs text-[#1C2826]/60">Published by Meridian Editorial Atelier</span>
            <button
              onClick={onClose}
              className="text-xs uppercase tracking-wider font-semibold text-[#0D242E] hover:text-[#C5A880]"
            >
              Back to Stories
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
