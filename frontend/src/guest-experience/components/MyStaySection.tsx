/**
 * @file MyStaySection.tsx
 * @description UI component for guest experience MyStaySection.
 */
import React from 'react';
import { Compass, Key, MessageSquare, ArrowRight } from 'lucide-react';

interface MyStaySectionProps {
  onAccessMyStay: () => void;
}

export const MyStaySection: React.FC<MyStaySectionProps> = ({ onAccessMyStay }) => {
  return (
    <section id="mystay" className="py-14 sm:py-16 bg-[#0D242E] text-white scroll-mt-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-md">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#DFCDAA] text-[10px] tracking-[0.2em] uppercase font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Resident Experience</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#FBF9F5] font-light">
              Your Stay. <span className="italic text-[#DFCDAA]">Your Way.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F0EB]/80 font-light leading-relaxed font-sans">
              Bypass the check-in desk with your mobile key, converse directly with your dedicated private butler, and customize in-villa preferences in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onAccessMyStay}
              id="my-stay-section-access-btn"
              className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#9E8159] text-white rounded-full text-xs uppercase tracking-[0.16em] font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Access Guest Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
