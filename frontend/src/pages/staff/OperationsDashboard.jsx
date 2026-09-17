/**
 * @file OperationsDashboard.jsx
 * @description Page view component for OperationsDashboard.
 */
import React from 'react';
import { useOperationsDashboard } from '../../hooks/useOperationsDashboard';

export default function OperationsDashboard() {
  const { data, loading, error, refetch } = useOperationsDashboard();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cross-Property Operations Dashboard</h1>
          <p className="text-sm text-slate-500">Member 4 — Operational Overview across 6 Resort Properties</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading cross-property dashboard...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">{error}</div>
      ) : data ? (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs uppercase font-semibold text-slate-400">Total Properties</span>
              <div className="text-3xl font-extrabold text-slate-800 mt-1">{data.summary.total_properties}</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs uppercase font-semibold text-slate-400">Today's Arriving Guests</span>
              <div className="text-3xl font-extrabold text-teal-600 mt-1">{data.summary.total_arrivals}</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs uppercase font-semibold text-slate-400">Spa Bookings</span>
              <div className="text-3xl font-extrabold text-indigo-600 mt-1">{data.summary.total_spa_bookings}</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs uppercase font-semibold text-slate-400">F&B Covers</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{data.summary.total_fb_covers}</div>
            </div>
          </div>

          {/* Property Breakdown Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              Property Level Metrics
            </div>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Arrivals</th>
                  <th className="px-6 py-4 text-right">Spa Bookings</th>
                  <th className="px-6 py-4 text-right">F&B Covers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.properties.map((p) => (
                  <tr key={p.property_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.property_name}</td>
                    <td className="px-6 py-4">{p.location}</td>
                    <td className="px-6 py-4 text-right font-semibold text-teal-700">{p.arrivals_count}</td>
                    <td className="px-6 py-4 text-right font-semibold text-indigo-700">{p.spa_bookings_count}</td>
                    <td className="px-6 py-4 text-right font-semibold text-amber-700">{p.fb_covers_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}