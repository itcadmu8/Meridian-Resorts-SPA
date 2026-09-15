import React from 'react';
import { Waves, ShieldCheck, Sun, HeartHandshake, Sparkles, Leaf } from 'lucide-react';
import { SUSTAINABILITY_PILLARS } from '../data/sustainability';

export const SustainabilitySection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Waves':
        return Waves;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Sun':
        return Sun;
      case 'HeartHandshake':
        return HeartHandshake;
      default:
        return Leaf;
    }
  };

  return (
    <section id="sustainability" className="py-24 sm:py-32 bg-[#22382B] text-white scroll-mt-12 relative overflow-hidden">
      {/* Soft natural mist overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#DFCDAA] mb-4">
            <Leaf className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
              Ecological Stewardship
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#FBF9F5] tracking-tight leading-tight">
            Luxury With a Lighter Footprint
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#F5F0EB]/80 font-sans font-light leading-relaxed">
            We hold a deep reverence for the delicate ecosystems that host us. Through coral
            restoration nurseries, on-site solar desalination, and community empowerment,
            we protect pristine marine sanctuaries for generations to come.
          </p>
        </div>

        {/* 4 Pillars Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SUSTAINABILITY_PILLARS.map((pillar) => {
            const IconComp = getIcon(pillar.iconName);
            return (
              <div
                key={pillar.id}
                className="bg-white/5 border border-white/10 p-7 rounded-2xl backdrop-blur-xs hover:border-[#C5A880]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                    <IconComp className="w-6 h-6 text-[#DFCDAA]" />
                  </div>
                  <p className="font-serif text-3xl sm:text-4xl font-light text-[#DFCDAA]">
                    {pillar.stat}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider font-sans text-white/60 font-medium mt-1">
                    {pillar.statLabel}
                  </p>
                  <h3 className="font-serif text-lg font-medium text-white mt-4">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#F5F0EB]/75 font-sans leading-relaxed mt-2 font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Holistic Principles Strip */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs text-[#F5F0EB]/85 font-sans">
          <div>
            <span className="block font-serif text-base text-[#DFCDAA] mb-1">Ocean Conservation</span>
            Active reef nurseries & turtle rehabilitation
          </div>
          <div>
            <span className="block font-serif text-base text-[#DFCDAA] mb-1">Native Landscaping</span>
            100% endemic flora preserving natural water tables
          </div>
          <div>
            <span className="block font-serif text-base text-[#DFCDAA] mb-1">Water Desalination</span>
            Thermal multi-effect solar powered water plants
          </div>
          <div>
            <span className="block font-serif text-base text-[#DFCDAA] mb-1">Wildlife Sanctuary</span>
            Certified ethical marine interaction charters
          </div>
        </div>
      </div>
    </section>
  );
};
