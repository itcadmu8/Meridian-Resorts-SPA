/**
 * @file ReportsView.tsx
 * @description React component for ReportsView.
 */
import React, { useState } from 'react';
import { PropertyCoverData } from '../types';
import { FileText, Download, Check, Calendar, TrendingUp } from 'lucide-react';

interface ReportsViewProps {
  properties: PropertyCoverData[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ properties }) => {
  const [downloaded, setDownloaded] = useState(false);
  const totalCovers = properties.reduce((acc, p) => acc + p.covers, 0);

  const handleExportCSV = () => {
    const headers = 'Property Code,Property Name,Location,Today Covers,% of Total,Target,Variance\n';
    const rows = properties
      .map(
        (p) =>
          `"${p.code}","${p.name}","${p.location}",${p.covers},${p.percentage}%,${p.target},${
            p.variance >= 0 ? `+${p.variance}` : p.variance
          }`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-fb-covers-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-[#647572] font-medium mb-1.5 flex items-center gap-1.5">
          <span>Executive Auditing</span>
          <span className="text-[#A5B3B0]">&gt;</span>
          <span className="text-[#10201E] font-semibold">Daily F&amp;B Covers Audit Report</span>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#E8F2F0] rounded-[10px] text-[#176B63] mt-0.5">
              <FileText className="w-6 h-6 text-[#176B63]" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#10201E] tracking-tight">
                Daily Operations &amp; Covers Audit
              </h3>
              <p className="text-xs sm:text-sm text-[#647572] mt-0.5">
                Official reporting manifest certified for resort asset management.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#176B63] hover:bg-[#125650] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloaded CSV</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Audit (CSV)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-[#D8E3E1] p-6 shadow-[0_1px_3px_rgba(23,32,31,0.05)]">
        <div className="flex items-center justify-between pb-4 border-b border-[#D8E3E1] mb-5">
          <div>
            <h4 className="font-semibold text-sm text-[#10201E]">
              Consolidated Covers Manifest
            </h4>
            <span className="text-xs text-[#647572]">Audit date: Tuesday, September 9, 2026</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#647572] block">Total Covers Recorded</span>
            <span className="text-xl font-bold text-[#176B63]">{totalCovers}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBF9] text-[#647572] font-medium border-b border-[#D8E3E1] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Breakfast</th>
                <th className="py-3 px-4">Lunch</th>
                <th className="py-3 px-4">Dinner</th>
                <th className="py-3 px-4">Room Svc</th>
                <th className="py-3 px-4">Total Covers</th>
                <th className="py-3 px-4">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E3E1]">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-[#F1F5F3]">
                  <td className="py-3 px-4 font-mono font-bold text-[#10201E]">{p.code}</td>
                  <td className="py-3 px-4 font-semibold text-[#10201E]">{p.name}</td>
                  <td className="py-3 px-4 text-[#647572]">{p.breakdown.breakfast}</td>
                  <td className="py-3 px-4 text-[#647572]">{p.breakdown.lunch}</td>
                  <td className="py-3 px-4 text-[#647572]">{p.breakdown.dinner}</td>
                  <td className="py-3 px-4 text-[#647572]">{p.breakdown.roomService}</td>
                  <td className="py-3 px-4 font-bold text-[#10201E]">{p.covers}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        p.variance >= 0 ? 'text-[#176B63]' : 'text-[#B38012]'
                      }`}
                    >
                      {p.variance >= 0 ? `+${p.variance}` : p.variance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#FAFBF9] border-t border-[#D8E3E1] font-semibold text-[#10201E]">
              <tr>
                <td colSpan={2} className="py-3.5 px-4">
                  Portfolio Audit Total
                </td>
                <td className="py-3.5 px-4 text-[#647572]">
                  {properties.reduce((acc, p) => acc + p.breakdown.breakfast, 0)}
                </td>
                <td className="py-3.5 px-4 text-[#647572]">
                  {properties.reduce((acc, p) => acc + p.breakdown.lunch, 0)}
                </td>
                <td className="py-3.5 px-4 text-[#647572]">
                  {properties.reduce((acc, p) => acc + p.breakdown.dinner, 0)}
                </td>
                <td className="py-3.5 px-4 text-[#647572]">
                  {properties.reduce((acc, p) => acc + p.breakdown.roomService, 0)}
                </td>
                <td className="py-3.5 px-4 text-[#176B63] text-sm">{totalCovers}</td>
                <td className="py-3.5 px-4 text-[#176B63]">+12% overall</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
