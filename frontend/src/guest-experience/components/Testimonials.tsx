import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { TESTIMONIALS } from '../data/sustainability';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Auto-advance every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 sm:py-32 bg-[#FBF9F5] overflow-hidden border-t border-[#EFE8DE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F0EB] border border-[#EFE8DE] text-[#C5A880] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
            Guest Impressions
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight mb-12">
          Echoes from Our Sanctuaries
        </h2>

        {/* Carousel Container */}
        <div className="relative min-h-[320px] sm:min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl mx-auto"
            >
              {/* Star Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif italic text-xl sm:text-2xl md:text-3xl font-light text-[#0D242E] leading-relaxed">
                "{current.quote}"
              </blockquote>

              {/* Author Details */}
              <div className="mt-8 space-y-1">
                <p className="font-sans font-semibold text-sm sm:text-base text-[#0D242E] tracking-wide">
                  {current.guestName}
                </p>
                <p className="text-xs text-[#1C2826]/60 font-sans">
                  {current.location} · {current.roomType}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-[#C5A880] font-sans font-medium">
                  {current.resortVisited}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Dots */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full border border-[#EFE8DE] hover:border-[#C5A880] text-[#0D242E] hover:bg-[#F5F0EB] transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#C5A880]' : 'w-2 bg-[#EFE8DE]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-full border border-[#EFE8DE] hover:border-[#C5A880] text-[#0D242E] hover:bg-[#F5F0EB] transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
