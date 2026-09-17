import React, { useState } from 'react';
import { useArrivals } from '../../hooks/useArrivals';

export default function Arrivals() {
  const [selectedProperty, setSelectedProperty] = useState('');
  const { arrivals, loading, error, refetch } = useArrivals({ property_id: selectedProperty || undefined });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Today's Arrivals</h1>
          <p className="text-sm text-slate-500">Member 1 — Property Arrivals Operations</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading today's arrivals...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Guests / Members</th>
                <th className="px-6 py-4">Check-In</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {arrivals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No arrivals recorded for today</td>
                </tr>
              ) : (
                arrivals.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.guest_name}</td>
                    <td className="px-6 py-4">{row.property_name}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {row.adults || 1} Adult{(row.adults || 1) !== 1 ? 's' : ''}
                      {row.children ? `, ${row.children} Child${row.children !== 1 ? 'ren' : ''}` : ''}
                    </td>
                    <td className="px-6 py-4">{row.check_in}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{row.loyalty_tier || 'Standard'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}