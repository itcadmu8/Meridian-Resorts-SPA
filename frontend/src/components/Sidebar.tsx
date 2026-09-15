import React from 'react';
import { NavScreen } from '../types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Briefcase,
  Sparkles,
  Building2,
  FileText,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentScreen: NavScreen;
  onSelectScreen: (screen: NavScreen) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavScreen; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fb-covers', label: "Today's F&B Covers", icon: UtensilsCrossed },
    { id: 'arrivals', label: 'Arrivals', icon: Briefcase },
    { id: 'spa', label: 'Spa Bookings', icon: Sparkles },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const content = (
    <aside
      id="sidebar-nav"
      data-purpose="sidebar-nav"
      className="w-64 border-r flex flex-col justify-between shrink-0 select-none h-full"
      style={{
        backgroundColor: 'rgb(237, 246, 245)',
        borderColor: 'rgb(216, 227, 225)',
      }}
    >
      {/* Top: Logo & Main Navigation List */}
      <div className="p-6">
        {/* Brand Logo */}
        <div
          id="brand-logo-container"
          className="flex items-center justify-between pb-8 mb-4 border-b"
          style={{ borderColor: 'rgb(216, 227, 225)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#176B63] flex items-center justify-center text-white shrink-0 shadow-sm">
              {/* Waves Icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M2 12c3.5-3 6.5-3 10 0s6.5 3 10 0" />
                <path d="M2 17c3.5-3 6.5-3 10 0s6.5 3 10 0" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold tracking-wider text-[#10201E] leading-tight">
                MERIDIAN
              </div>
              <div className="text-[10px] uppercase font-medium tracking-[0.2em] text-[#647572]">
                RESORTS &amp; SPA
              </div>
            </div>
          </div>
          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-gray-500 hover:text-gray-800 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const Icon = item.icon;

            if (isActive) {
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  type="button"
                  aria-current="page"
                  onClick={() => {
                    onSelectScreen(item.id);
                    onCloseMobile();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold relative focus-visible:ring-2 focus:outline-none transition-all duration-150 cursor-pointer text-left"
                  style={{
                    backgroundColor: 'rgb(213, 239, 241)',
                    color: 'rgb(22, 61, 74)',
                  }}
                >
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r"
                    style={{ backgroundColor: 'rgb(23, 107, 99)' }}
                  />
                  <Icon className="w-4 h-4 shrink-0 text-[#176B63]" />
                  <span className="font-bold" style={{ color: 'rgb(22, 61, 74)' }}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectScreen(item.id);
                  onCloseMobile();
                }}
                className="w-full group flex items-center gap-3 px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B63]/40 text-xs font-medium transition-colors duration-150 cursor-pointer text-left hover:bg-[#E1F0F2]"
                style={{ color: 'rgb(22, 61, 74)' }}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#496A73] group-hover:text-[#176B63] group-hover:translate-x-0.5 transition-all duration-150" />
                <span className="text-[#163D4A] group-hover:text-[#163D4A]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status */}
      <div
        id="sidebar-status-footer"
        className="px-6 py-4 border-t flex items-center justify-between text-xs"
        style={{
          borderColor: 'rgb(216, 227, 225)',
          color: 'rgb(73, 106, 115)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Ops Network Active</span>
        </div>
        <span className="font-mono text-[11px]" style={{ color: 'rgb(73, 106, 115)' }}>
          v2.4.8
        </span>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">{content}</div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
