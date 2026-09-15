import React from 'react';
import { Compass, Instagram, Facebook, Youtube, Twitter, ArrowUp, Globe } from 'lucide-react';

interface FooterProps {
  onOpenLogin: () => void;
  onOpenMyStay: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin, onOpenMyStay }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#0A1D24] text-white pt-12 pb-8 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-8 border-b border-white/10 gap-6">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#DFCDAA]" />
            <span className="font-serif text-2xl tracking-[0.2em] font-light uppercase text-[#FBF9F5]">
              Meridian
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#DFCDAA] uppercase font-sans ml-2">
              Resorts & Spas
            </span>
          </div>

          <div className="flex items-center gap-5 text-[#DFCDAA]">
            <a href="#instagram" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#facebook" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#youtube" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#twitter" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-[#C5A880] text-[#DFCDAA] hover:text-white transition-colors ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="py-8 flex flex-wrap justify-center sm:justify-between items-center gap-4 text-xs border-b border-white/10 text-[#F5F0EB]/70">
          <div className="flex flex-wrap gap-6">
            <a href="#resorts" className="hover:text-white transition-colors">Resorts</a>
            <a href="#stay" className="hover:text-white transition-colors">Villas</a>
            <a href="#wellness-dining" className="hover:text-white transition-colors">Dining & Spa</a>
            <button onClick={onOpenMyStay} className="hover:text-[#DFCDAA] transition-colors">
              My Stay Portal
            </button>
            <button onClick={onOpenLogin} className="hover:text-[#DFCDAA] transition-colors">
              Guest & Colleague Login
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#DFCDAA]">
            <Globe className="w-3.5 h-3.5" />
            <span>English · USD ($)</span>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F5F0EB]/40 gap-3">
          <div className="flex flex-wrap gap-4">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Stay</a>
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
          <p>© {new Date().getFullYear()} Meridian Resorts & Spas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
