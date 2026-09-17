/**
 * @file GuestServices.tsx
 * @description UI component for guest experience GuestServices.
 */
import React, { useState } from 'react';
import {
  Sparkles,
  Plane,
  Compass,
  Home,
  Shirt,
  Utensils,
  CalendarCheck,
  Anchor,
  Car,
  Gift,
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { GUEST_SERVICES } from '../data/sustainability';
import { GuestService } from '../types';

interface GuestServicesProps {
  onRequestService: (service: GuestService) => void;
}

export const GuestServices: React.FC<GuestServicesProps> = ({ onRequestService }) => {
  const [requestedId, setRequestedId] = useState<string | null>(null);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Plane':
        return Plane;
      case 'Compass':
        return Compass;
      case 'Sparkles':
        return Sparkles;
      case 'Home':
        return Home;
      case 'Shirt':
        return Shirt;
      case 'Utensils':
        return Utensils;
      case 'CalendarCheck':
        return CalendarCheck;
      case 'Anchor':
        return Anchor;
      case 'Car':
        return Car;
      case 'Gift':
        return Gift;
      case 'Users':
        return Users;
      default:
        return Sparkles;
    }
  };

  const handleRequest = (service: GuestService) => {
    setRequestedId(service.id);
    onRequestService(service);
    setTimeout(() => {
      setRequestedId(null);
    }, 2500);
  };

  return (
    <section id="services" className="py-24 sm:py-32 bg-[#F5F0EB]/60 border-t border-[#EFE8DE] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EFE8DE] text-[#C5A880] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#0D242E]">
              Intuitive Hospitality
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#0D242E] tracking-tight leading-tight">
            Everything You Need, Before You Ask
          </h2>
          <div className="w-12 h-[1px] bg-[#C5A880] mx-auto my-5" />
          <p className="text-sm sm:text-base text-[#1C2826]/75 font-sans font-light leading-relaxed">
            At Meridian, our philosophy of service is rooted in quiet anticipation. From
            private seaplane escorts and 24/7 dedicated Thakuru butlers to bespoke milestone
            celebrations, every moment is shaped with effortless grace.
          </p>
        </div>

        {/* Services Grid (12 services) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GUEST_SERVICES.map((service) => {
            const IconComp = getServiceIcon(service.iconName);
            const isJustRequested = requestedId === service.id;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-[#EFE8DE] hover:border-[#C5A880]/60 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#F5F0EB] flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-[#C5A880]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1C2826]/50">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#0D242E] mb-2 leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#1C2826]/75 leading-relaxed font-sans font-light">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#EFE8DE] flex items-center justify-between">
                  <span className="text-[10px] text-[#C5A880] font-semibold tracking-wider uppercase">
                    {service.availableHours}
                  </span>

                  <button
                    onClick={() => handleRequest(service)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#0D242E] hover:text-[#9E8159] transition-colors flex items-center gap-1 focus:outline-none"
                  >
                    {isJustRequested ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Noted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Inquire
                        <ArrowRight className="w-3 h-3 text-[#C5A880]" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
