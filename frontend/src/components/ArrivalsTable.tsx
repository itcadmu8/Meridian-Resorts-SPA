import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ArrivalReservation } from '../types';

interface ArrivalsTableProps {
  arrivals: ArrivalReservation[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onViewReservation: (reservation: ArrivalReservation) => void;
  onExport: () => void;
  selectedProperty: string;
  onPropertyChange: (property: string) => void;
}

export const ArrivalsTable: React.FC<ArrivalsTableProps> = ({
  arrivals,
  isLoading = false,
  isEmpty = false,
  onViewReservation,
  onExport,
  selectedProperty,
  onPropertyChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter arrivals by search term and selected property
  const filteredArrivals = useMemo(() => {
    if (isEmpty) return [];

    return arrivals.filter((res) => {
      const matchesProperty =
        !selectedProperty ||
        selectedProperty === 'All Properties' ||
        res.property === selectedProperty ||
        res.propertyCategory === selectedProperty;

      const matchesSearch =
        !searchTerm.trim() ||
        res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.reservationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.guestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesProperty && matchesSearch;
    });
  }, [arrivals, selectedProperty, searchTerm, isEmpty]);

  const totalPages = Math.max(1, Math.ceil(filteredArrivals.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentArrivals = filteredArrivals.slice(startIndex, startIndex + pageSize);

  // Loyalty badge colors
  const getLoyaltyBadge = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'text-slate-700 font-semibold';
      case 'Gold':
        return 'text-amber-600 font-semibold';
      case 'Silver':
        return 'text-slate-500 font-semibold';
      default:
        return 'text-slate-600 font-normal';
    }
  };

  const propertyOptions = [
    'All Properties',
    ...Array.from(new Set(arrivals.map((arrival) => arrival.property))).sort(),
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs mb-6 overflow-hidden">
      {/* Table Header with Title and Export Button */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-3.5 bg-[#0f766e] rounded-full inline-block"></span>
          <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
            Arrival Details ({filteredArrivals.length})
          </h3>
        </div>

        <button
          id="export-arrivals-button"
          type="button"
          onClick={onExport}
          className="flex items-center space-x-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>

      {/* Filter and Search Bar matching screenshot */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
        {/* Property Select */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            PROPERTY
          </span>
          <div className="relative">
            <select
              id="property-filter-select"
              value={selectedProperty}
              onChange={(e) => {
                onPropertyChange(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Property"
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 cursor-pointer shadow-2xs font-medium appearance-none"
            >
              {propertyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="guest-search-input"
            type="text"
            placeholder="Search by guest name or reservation ID..."
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
              <th className="py-3 px-4 font-semibold">RESERVATION ID</th>
              <th className="py-3 px-4 font-semibold">GUEST NAME</th>
              <th className="py-3 px-4 font-semibold">PROPERTY</th>
              <th className="py-3 px-4 font-semibold">CHECK-IN DATE</th>
              <th className="py-3 px-4 font-semibold">CHECK-OUT DATE</th>
              <th className="py-3 px-4 font-semibold">LOYALTY TIER</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-3.5 px-4"><div className="h-3 w-16 bg-slate-200 rounded"></div></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200"></div>
                      <div className="h-3 w-28 bg-slate-200 rounded"></div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><div className="h-3 w-36 bg-slate-200 rounded"></div></td>
                  <td className="py-3.5 px-4"><div className="h-3 w-20 bg-slate-200 rounded"></div></td>
                  <td className="py-3.5 px-4"><div className="h-3 w-20 bg-slate-200 rounded"></div></td>
                  <td className="py-3.5 px-4"><div className="h-3 w-14 bg-slate-200 rounded"></div></td>
                  <td className="py-3.5 px-4"><div className="h-4 w-16 bg-slate-200 rounded-full"></div></td>
                  <td className="py-3.5 px-4 text-right"><div className="h-6 w-12 bg-slate-200 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : currentArrivals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-500 text-sm">No arrival reservations match your criteria</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or selected property filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentArrivals.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Reservation ID */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 font-medium">
                    {res.reservationId}
                  </td>

                  {/* Guest Name with Circle Initials Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10.5px] font-bold border shrink-0 ${res.guestAvatarColor}`}>
                        {res.guestInitials}
                      </div>
                      <span className="font-semibold text-slate-800 whitespace-nowrap">
                        {res.guestName}
                      </span>
                    </div>
                  </td>

                  {/* Property */}
                  <td className="py-3 px-4 text-slate-600">
                    <span className="line-clamp-1">{res.property}</span>
                  </td>

                  {/* Check-In Date */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                    {res.checkInDate}
                  </td>

                  {/* Check-Out Date */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                    {res.checkOutDate}
                  </td>

                  {/* Loyalty Tier */}
                  <td className={`py-3 px-4 whitespace-nowrap ${getLoyaltyBadge(res.loyaltyTier)}`}>
                    {res.loyaltyTier}
                  </td>

                  {/* Status Pill */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {res.status}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      id={`view-reservation-${res.reservationId}`}
                      type="button"
                      onClick={() => onViewReservation(res)}
                      className="inline-flex items-center space-x-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {filteredArrivals.length === 0 ? 0 : startIndex + 1}
          </span>
          -
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + pageSize, filteredArrivals.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredArrivals.length}</span> arrivals
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              id="prev-page-button"
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                id={`page-${pageNum}-button`}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#0f766e] text-white shadow-xs'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              id="next-page-button"
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
