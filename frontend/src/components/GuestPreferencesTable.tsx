/**
 * @file GuestPreferencesTable.tsx
 * @description React component for GuestPreferencesTable.
 */
import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GuestPreference } from '../types';

interface GuestPreferencesTableProps {
  preferences: GuestPreference[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onSelectGuest?: (guest: GuestPreference) => void;
}

export const GuestPreferencesTable: React.FC<GuestPreferencesTableProps> = ({
  preferences,
  isLoading = false,
  isEmpty = false,
  onSelectGuest,
}) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter preferences by guest name
  const filteredPreferences = useMemo(() => {
    if (!searchTerm.trim()) return preferences;
    return preferences.filter((item) =>
      item.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [preferences, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredPreferences.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * pageSize;
  const currentPreferences = filteredPreferences.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs mb-8 overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-3.5 bg-[#0f766e] rounded-full inline-block"></span>
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
            Guest Preferences
          </h3>
        </div>
        <p className="text-xs text-slate-500 font-normal">
          Special requests &amp; accommodations for today&apos;s arrivals
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="guest-preference-search-input"
            type="text"
            placeholder="Search by guest name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[10.5px] font-bold text-slate-500 tracking-wider uppercase">
              <th className="py-3 px-4 font-semibold w-28">GUEST ID</th>
              <th className="py-3 px-4 font-semibold w-48">GUEST NAME</th>
              <th className="py-3 px-4 font-semibold">PREFERENCE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-4"><div className="h-3 w-16 bg-slate-200 rounded"></div></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200"></div>
                      <div className="h-3 w-28 bg-slate-200 rounded"></div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><div className="h-3 w-72 bg-slate-200 rounded"></div></td>
                </tr>
              ))
            ) : isEmpty || preferences.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400">
                  No special guest preferences recorded for today&apos;s arrivals.
                </td>
              </tr>
            ) : filteredPreferences.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-500 text-sm">No guests match your search</p>
                    <p className="text-xs text-slate-400">Try a different guest name.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentPreferences.map((item) => (
                <tr
                  key={item.guestId}
                  onClick={() => onSelectGuest && onSelectGuest(item)}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                >
                  {/* Guest ID */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 font-medium whitespace-nowrap">
                    {item.guestId}
                  </td>

                  {/* Guest Name with circle avatar */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold border shrink-0 ${item.avatarColor}`}>
                        {item.guestInitials}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {item.guestName}
                      </span>
                    </div>
                  </td>

                  {/* Preference */}
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    {item.preference}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {filteredPreferences.length === 0 ? 0 : startIndex + 1}
          </span>
          -
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + pageSize, filteredPreferences.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredPreferences.length}</span> preferences
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setCurrentPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-8 h-8 rounded text-xs font-semibold ${pageNumber === page ? 'bg-[#0f766e] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setCurrentPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
