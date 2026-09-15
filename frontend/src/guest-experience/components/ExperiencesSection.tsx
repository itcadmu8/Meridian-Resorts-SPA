import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, Users } from 'lucide-react';
import { EXPERIENCES } from '../data/experiences';
import { ExperienceItem } from '../types';
import { ExperienceModal } from './ExperienceModal';

interface ExperiencesSectionProps {
  onInquireExperience: (exp: ExperienceItem) => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ onInquireExperience }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<ExperienceItem | null>(null);

  const categories = ['All', 'Ocean', 'Nature', 'Culture', 'Wellness', 'Romance'];

  const filtered =
    activeCategory === 'All'
      ? EXPERIENCES
      : EXPERIENCES.filter((exp) => exp.category === activeCategory);

  return (
    <section id="experiences" className="py-24 sm:py-32 bg-[#FBF9F5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0EB] border border-[#EFE8DE] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Bespoke Expeditions
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
            Curated Island & Coastal Experiences
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed">
            Whether chartering a private luxury catamaran across uninhabited atolls,
            kayaking through bioluminescent mangroves, or savoring private starlight sandbank
            dinners.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.14em] font-sans font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0D242E] text-white shadow-sm'
                    : 'bg-white hover:bg-[#F5F0EB] text-[#1C2826]/70 border border-[#EFE8DE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-[#0D242E]">
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full text-[#0D242E]">
                    {exp.category}
                  </span>
                  <span className="absolute bottom-3 right-3 text-white font-serif text-sm font-light bg-black/40 px-2.5 py-1 rounded-full border border-white/15">
                    {exp.priceIndicator}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#1C2826]/60 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{exp.duration}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{exp.groupSize}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#0D242E] group-hover:text-[#9E8159] transition-colors leading-snug">
                    {exp.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#1C2826]/75 font-sans leading-relaxed line-clamp-3">
                    {exp.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedExp(exp)}
                  className="w-full py-2.5 px-4 rounded-full border border-[#0D242E]/15 hover:border-[#0D242E] text-xs uppercase tracking-[0.14em] font-semibold text-[#0D242E] hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Discover Experience</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExperienceModal
        experience={selectedExp}
        onClose={() => setSelectedExp(null)}
        onInquire={onInquireExperience}
      />
    </section>
  );
};
