import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Luggage, 
  Sparkles, 
  Building2, 
  FileText 
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange,
  mobileOpen = false,
  onCloseMobile 
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fb-covers', label: "Today's F&B Covers", icon: Utensils },
    { id: 'arrivals', label: 'Arrivals', icon: Luggage },
    { id: 'spa-bookings', label: 'Spa Bookings', icon: Sparkles },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 pb-5 flex items-center space-x-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#115e59] flex items-center justify-center text-white shadow-sm shadow-teal-900/10 shrink-0">
              <svg 
                className="w-5 h-5 text-emerald-200" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              </svg>
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-[0.14em] text-slate-900 leading-tight">
                MERIDIAN
              </div>
              <div className="text-[9.5px] font-semibold tracking-[0.25em] text-slate-400 leading-tight mt-0.5">
                RESORTS &amp; SPA
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#e6f4f1] text-[#0f766e] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#0f766e]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="text-slate-600">Ops Network Active</span>
            </div>
            <span className="text-slate-400 font-mono text-[10px]">v2.4.8</span>
          </div>
        </div>
      </aside>
    </>
  );
};
