import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Compass, User, Calendar, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenLogin: () => void;
  onOpenMyStay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenLogin,
  onOpenMyStay,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Resorts', href: '#resorts' },
    { label: 'Villas', href: '#stay' },
    { label: 'Dining & Spa', href: '#wellness-dining' },
    { label: 'My Stay', action: onOpenMyStay },
  ];

  const handleNavClick = (link: { label: string; href?: string; action?: () => void }) => {
    setMobileMenuOpen(false);
    if (link.action) {
      link.action();
      return;
    }
    if (link.href) {
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FBF9F5]/95 backdrop-blur-md shadow-sm border-b border-[#C5A880]/20 py-3.5 text-[#0D242E]'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <a
            href="#"
            className="flex flex-col items-start group focus:outline-none"
            id="brand-logo"
          >
            <span className="font-serif tracking-[0.22em] text-xl sm:text-2xl font-normal uppercase transition-colors">
              Meridian
            </span>
            <span
              className={`text-[9px] tracking-[0.35em] uppercase font-sans font-medium transition-colors ${
                isScrolled ? 'text-[#C5A880]' : 'text-[#DFCDAA]'
              }`}
            >
              Resorts & Spas
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-7 text-[13px] tracking-[0.14em] uppercase font-sans font-medium">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`relative py-1 transition-colors hover:text-[#C5A880] focus:outline-none ${
                  isScrolled ? 'text-[#1C2826]' : 'text-white/90'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C5A880] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
            <button
              onClick={onOpenMyStay}
              id="header-mystay-btn"
              className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium px-3 py-1.5 rounded-full transition-all ${
                isScrolled
                  ? 'text-[#0D242E] hover:bg-[#F5F0EB]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>My Stay</span>
            </button>

            <button
              onClick={onOpenLogin}
              id="header-login-btn"
              className={`flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium px-3 py-1.5 rounded-full transition-all ${
                isScrolled
                  ? 'text-[#0D242E] hover:bg-[#F5F0EB]'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Login</span>
            </button>

            <button
              onClick={() => window.location.assign(window.localStorage.getItem('meridian_access_token') ? '/booking' : '/login?redirect=/booking')}
              id="header-book-btn"
              className="bg-[#C5A880] hover:bg-[#9E8159] text-white text-xs uppercase tracking-[0.18em] font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2 transform active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Your Stay</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-3 xl:hidden">
            <button
              onClick={() => window.location.assign(window.localStorage.getItem('meridian_access_token') ? '/booking' : '/login?redirect=/booking')}
              className="md:hidden bg-[#C5A880] text-white text-[11px] uppercase tracking-wider font-semibold px-3.5 py-1.5 rounded-full"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${
                isScrolled ? 'text-[#0D242E] hover:bg-[#F5F0EB]' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#0D242E] text-white flex flex-col justify-between p-6 sm:p-8 xl:hidden overflow-y-auto"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <span className="font-serif tracking-[0.2em] text-xl font-normal uppercase text-[#FBF9F5]">
                    Meridian
                  </span>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#C5A880]">
                    Resorts & Spas
                  </p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white rounded-full bg-white/5"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="flex items-center justify-between py-2 text-left text-lg font-serif tracking-wider text-white/90 hover:text-[#C5A880] transition-colors border-b border-white/5"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/30" />
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMyStay();
                  }}
                  className="flex items-center justify-center gap-2 border border-white/20 rounded-full py-2.5 text-xs uppercase tracking-wider font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>My Stay</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="flex items-center justify-center gap-2 border border-white/20 rounded-full py-2.5 text-xs uppercase tracking-wider font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Login</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full bg-[#C5A880] hover:bg-[#9E8159] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Stay</span>
              </button>

              <p className="text-center text-[10px] tracking-widest uppercase text-[#C5A880]/70 pt-2 font-serif">
                Where the Ocean Meets the Art of Living
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
