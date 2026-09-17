/**
 * @file ArrivalShareDonut.tsx
 * @description React component for ArrivalShareDonut.
 */
import React, { useState } from 'react';
import { PropertyArrivalStats } from '../types';

interface ArrivalShareDonutProps {
  data: PropertyArrivalStats[];
  totalArrivals: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const ArrivalShareDonut: React.FC<ArrivalShareDonutProps> = ({
  data,
  totalArrivals,
  isLoading = false,
  isEmpty = false,
  selectedCategory,
  onSelectCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs h-[330px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="w-32 h-32 rounded-full border-8 border-slate-200 border-t-slate-300"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="h-3 bg-slate-200 rounded"></div>
          <div className="h-3 bg-slate-200 rounded"></div>
          <div className="h-3 bg-slate-200 rounded"></div>
          <div className="h-3 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const effectiveTotal = isEmpty ? 0 : totalArrivals || 1;
  const radius = 52;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Split into left and right columns matching the screenshot exactly
  // Col 1: Beach (8, 33%), Mountain (5, 21%), Desert (2, 8%)
  // Col 2: Lake (6, 25%), City (2, 8%), Forest (1, 4%)
  const col1 = [data[0], data[2], data[4]].filter(Boolean);
  const col2 = [data[1], data[3], data[5]].filter(Boolean);

  // Calculate SVG stroke dashes for donut segments
  let accumulatedOffset = 0;
  const segments = data.map((item) => {
    const fraction = isEmpty ? 0 : item.count / effectiveTotal;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += fraction * circumference;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-[340px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-3.5 bg-[#0f766e] rounded-full inline-block"></span>
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Share of Today&apos;s Arrivals
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
          {isEmpty ? '0 Total' : `${totalArrivals} Total`}
        </span>
      </div>

      {/* Donut Graphic */}
      <div className="relative w-full flex items-center justify-center my-1">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 select-none overflow-visible" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {!isEmpty &&
              segments.map((seg) => {
                const isHovered = hoveredCategory === seg.category;
                const isSelected = selectedCategory === seg.category;
                return (
                  <circle
                    key={seg.category}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(seg.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => onSelectCategory && onSelectCategory(isSelected ? '' : seg.category)}
                  />
                );
              })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
              {isEmpty ? 0 : totalArrivals}
            </span>
            <span className="text-[9.5px] font-bold tracking-widest text-slate-500 uppercase mt-1">
              ARRIVALS
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Legend matching screenshot */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100">
        {/* Column 1 */}
        <div className="space-y-1.5">
          {col1.map((item) => {
            const isHovered = hoveredCategory === item.category;
            const isSelected = selectedCategory === item.category;
            return (
              <div
                key={item.category}
                className={`flex items-center justify-between text-[11px] cursor-pointer rounded px-1 py-0.5 transition-colors ${
                  isHovered || isSelected ? 'bg-teal-50' : 'hover:bg-slate-50'
                }`}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onSelectCategory && onSelectCategory(isSelected ? '' : item.category)}
              >
                <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="truncate text-slate-700 font-medium" title={item.propertyName}>
                    {item.propertyName.length > 12 ? `${item.propertyName.slice(0, 12)}...` : item.propertyName}
                  </span>
                </div>
                <div className="shrink-0 text-slate-600 font-semibold text-[10.5px]">
                  {item.count} <span className="text-slate-400 font-normal">({item.sharePercentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="space-y-1.5">
          {col2.map((item) => {
            const isHovered = hoveredCategory === item.category;
            const isSelected = selectedCategory === item.category;
            return (
              <div
                key={item.category}
                className={`flex items-center justify-between text-[11px] cursor-pointer rounded px-1 py-0.5 transition-colors ${
                  isHovered || isSelected ? 'bg-teal-50' : 'hover:bg-slate-50'
                }`}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onSelectCategory && onSelectCategory(isSelected ? '' : item.category)}
              >
                <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="truncate text-slate-700 font-medium" title={item.propertyName}>
                    {item.propertyName.length > 12 ? `${item.propertyName.slice(0, 12)}...` : item.propertyName}
                  </span>
                </div>
                <div className="shrink-0 text-slate-600 font-semibold text-[10.5px]">
                  {item.count} <span className="text-slate-400 font-normal">({item.sharePercentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
