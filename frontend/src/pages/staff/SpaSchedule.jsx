import React, { useState } from 'react';
import { useSpaAppointments } from '../../hooks/useSpaAppointments';

export default function SpaSchedule() {
  const [selectedProperty, setSelectedProperty] = useState('');
  const { appointments, loading, error, refetch } = useSpaAppointments({ property_id: selectedProperty || undefined });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Spa Schedule & Appointments</h1>
          <p className="text-sm text-slate-500">Member 2 — Spa Operations & Booking Management</p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh Schedule
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading spa appointments...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Treatment Service</th>
                <th className="px-6 py-4">Therapist</th>
                <th className="px-6 py-4">Start Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No spa appointments scheduled</td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.service}</td>
                    <td className="px-6 py-4">{item.therapist || 'Assigned Staff'}</td>
                    <td className="px-6 py-4">{new Date(item.starts_at).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                        {item.status}
                      </span>
                    </td>
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