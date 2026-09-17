/**
 * @file ExperiencePhilosophy.tsx
 * @description UI component for guest experience ExperiencePhilosophy.
 */
import React from 'react';
import { Compass, Sparkles, Utensils, ArrowRight } from 'lucide-react';

export const ExperiencePhilosophy: React.FC = () => {
  const pillars = [
    {
      icon: Compass,
      title: 'Discover',
      tagline: 'Untamed Lands & Marine Horizons',
      description: 'Explore local culture, ancient coastal traditions, vibrant marine ecosystems, and unforgettable destinations guided by resident scholars.',
      actionText: 'Explore Expeditions',
      targetId: '#experiences'
    },
    {
      icon: Sparkles,
      title: 'Restore',
      tagline: 'Ancient Rhythms & Cellular Rebirth',
      description: 'Reconnect with yourself through personalized Ayurvedic wellness, restorative seawater therapies, and grounding daily meditation rituals.',
      actionText: 'Discover Wellness',
      targetId: '#spa'
    },
    {
      icon: Utensils,
      title: 'Indulge',
      tagline: 'Gastronomy & Starlit Gatherings',
      description: 'Experience exceptional oceanfront cuisine, open-flame beach grills, sommelier cellar pairings, and intimate candlelit sandbank feasts.',
      actionText: 'View Restaurants',
      targetId: '#dining'
    }
  ];

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="philosophy" className="py-24 sm:py-32 bg-[#0D242E] text-white overflow-hidden scroll-mt-12 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#133845] rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2A4736] rounded-full blur-3xl opacity-20 -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Split Screen Concept */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Storytelling */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#DFCDAA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
                The Meridian Philosophy
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight leading-tight text-[#FBF9F5]">
              More Than a Stay
            </h2>

            <p className="font-serif italic text-xl sm:text-2xl text-[#DFCDAA] font-light leading-relaxed">
              "At Meridian, every detail is designed around the rhythm of your journey — from
              the first sunrise over the water to evenings spent under the stars."
            </p>

            <p className="text-sm text-[#F5F0EB]/70 font-sans leading-relaxed">
              We believe true luxury is found in stillness, privacy, and authentic immersion.
              Our sanctuaries are built in harmony with coastal ecosystems, honoring indigenous
              heritage while presenting world-class intuitive hospitality.
            </p>

            {/* Immersive Photo Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 h-64 sm:h-72 mt-6">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85"
                alt="Meridian Resort Sunset Atmosphere"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D242E] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-serif italic text-[#DFCDAA]">
                "Where time slows down to the cadence of the tide."
              </div>
            </div>
          </div>

          {/* Right Column: The Three Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {pillars.map((pillar, index) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-7 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C5A880]/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-[#DFCDAA]" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-2xl text-white font-normal tracking-wide">
                            {pillar.title}
                          </h3>
                          <span className="text-[11px] font-sans tracking-widest text-[#DFCDAA]/70 uppercase">
                            0{index + 1}
                          </span>
                        </div>
                        <p className="text-xs uppercase tracking-wider text-[#C5A880] font-sans font-medium">
                          {pillar.tagline}
                        </p>
                        <p className="text-sm text-[#F5F0EB]/75 font-sans leading-relaxed pt-1">
                          {pillar.description}
                        </p>

                        <div className="pt-3">
                          <button
                            onClick={() => scrollToSection(pillar.targetId)}
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#DFCDAA] hover:text-white transition-colors"
                          >
                            <span>{pillar.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
