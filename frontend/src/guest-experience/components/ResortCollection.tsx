import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { RESORTS } from '../data/resorts';
import { Resort } from '../types';
import { ResortCard } from './ResortCard';
import { ResortModal } from './ResortModal';

interface ResortCollectionProps {
  onBookResort: (resort: Resort) => void;
}

export const ResortCollection: React.FC<ResortCollectionProps> = ({ onBookResort }) => {
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedResorts = showAll ? RESORTS : RESORTS.slice(0, 3);

  return (
    <section id="resorts" className="py-16 sm:py-20 bg-[#FBF9F5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F0EB] border border-[#EFE8DE] text-[#C5A880] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              The Portfolio
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#0D242E] tracking-tight">
            Extraordinary Coastal Sanctuaries
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-3.5" />
          <p className="text-xs sm:text-sm text-[#1C2826]/75 font-sans font-light leading-relaxed">
            Secluded shores, architectural stillness, and intuitive hospitality across the world's most pristine coastlines.
          </p>
        </div>

        {/* Resort Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedResorts.map((resort) => (
            <ResortCard
              key={resort.id}
              resort={resort}
              onExplore={(r) => setSelectedResort(r)}
            />
          ))}
        </div>

        {/* View All / Collapse Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 border border-[#0D242E] text-[#0D242E] hover:bg-[#0D242E] hover:text-white rounded-full text-xs uppercase tracking-[0.16em] font-semibold transition-colors"
          >
            {showAll ? 'Show Less' : `View All ${RESORTS.length} Sanctuaries`}
          </button>
        </div>
      </div>

      {/* Resort Details Modal */}
      <ResortModal
        resort={selectedResort}
        onClose={() => setSelectedResort(null)}
        onBookResort={onBookResort}
      />
    </section>
  );
};
