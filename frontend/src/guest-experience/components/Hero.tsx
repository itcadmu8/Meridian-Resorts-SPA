import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreResorts: () => void;
  onPlanStay: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreResorts, onPlanStay }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Slow Subtle Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2200&q=90"
            alt="Meridian Luxury Beachfront Sanctuary"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Layered cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D242E] via-[#0D242E]/40 to-black/50" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-12 sm:mt-8">
        {/* Subtitle / Emblem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 sm:mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#DFCDAA]" />
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#FBF9F5] font-sans font-medium">
            Meridian Resorts & Spas
          </span>
        </motion.div>

        {/* Main Brand Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.04em] leading-[1.08] max-w-4xl"
        >
          Where the Ocean <br className="hidden sm:block" />
          <span className="italic font-serif font-normal text-[#DFCDAA]">
            Meets the Art of Living
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[#F5F0EB]/90 font-sans font-light max-w-2xl mx-auto leading-relaxed"
        >
          Discover secluded shores, restorative wellness, exceptional dining, and
          deeply personalized stays across the Meridian collection.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto justify-center"
        >
          <button
            onClick={onExploreResorts}
            id="hero-explore-resorts-btn"
            className="w-full sm:w-auto px-8 py-4 bg-[#C5A880] hover:bg-[#9E8159] text-white rounded-full text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <span>Explore Our Resorts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onPlanStay}
            id="hero-plan-stay-btn"
            className="w-full sm:w-auto px-8 py-4 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 rounded-full text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 hover:border-white/50"
          >
            <span>Plan Your Stay</span>
          </button>
        </motion.div>
      </div>

    </section>
  );
};
