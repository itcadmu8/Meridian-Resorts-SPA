import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/journal';
import { JournalArticle } from '../types';
import { JournalModal } from './JournalModal';

export const JournalSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null);

  return (
    <section id="journal" className="py-24 sm:py-32 bg-[#F5F0EB]/60 border-t border-[#EFE8DE] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EFE8DE] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              The Meridian Gazette
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
            Stories From Meridian
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed">
            Essays on slow travel, mindful wellness, island cuisine, and extraordinary
            encounters across the world's most remote coastlines.
          </p>
        </div>

        {/* 6 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-[#0D242E]">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full text-[#0D242E]">
                    {article.category}
                  </span>
                  <span className="absolute bottom-3 right-3 text-white/90 text-xs font-sans flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/15">
                    <Clock className="w-3 h-3 text-[#C5A880]" />
                    {article.readTime}
                  </span>
                </div>

                <div className="p-6">
                  <span className="text-[11px] text-[#1C2826]/60 font-sans block mb-1">
                    {article.date} · By {article.author}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#0D242E] group-hover:text-[#9E8159] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#1C2826]/75 font-sans leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-2.5 px-4 rounded-full border border-[#0D242E]/15 hover:border-[#0D242E] text-xs uppercase tracking-[0.14em] font-semibold text-[#0D242E] hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <JournalModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
};
