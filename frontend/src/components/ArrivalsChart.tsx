import React, { useState } from 'react';
import { PropertyArrivalStats } from '../types';

interface ArrivalsChartProps {
  data: PropertyArrivalStats[];
  targetAverage?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const ArrivalsChart: React.FC<ArrivalsChartProps> = ({
  data,
  targetAverage = 4,
  isLoading = false,
  isEmpty = false,
  selectedCategory,
  onSelectCategory,
}) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs h-[330px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-36 bg-slate-200 rounded"></div>
          <div className="h-3 w-44 bg-slate-200 rounded"></div>
        </div>
        <div className="h-48 bg-slate-100 rounded-lg flex items-end justify-around p-4 gap-3">
          {[60, 80, 50, 20, 20, 10].map((h, i) => (
            <div key={i} className="w-9 bg-slate-200 rounded-t" style={{ height: `${h}%` }}></div>
          ))}
        </div>
        <div className="h-3 w-full bg-slate-100 rounded"></div>
      </div>
    );
  }

  // Chart configuration
  const highestCount = Math.max(0, ...data.map((item) => item.count));
  const maxY = Math.max(10, Math.ceil(highestCount / 2) * 2);
  const yTicks = Array.from({ length: maxY / 2 + 1 }, (_, index) => maxY - index * 2);
  const chartHeight = 190;
  const chartWidth = 440;
  const paddingLeft = 46;
  const paddingBottom = 28;
  const paddingTop = 20;
  const paddingRight = 16;

  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const usableWidth = chartWidth - paddingLeft - paddingRight;

  const targetY = paddingTop + usableHeight * (1 - targetAverage / maxY);

  const displayData = isEmpty ? data.map(d => ({ ...d, count: 0 })) : data;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between h-[340px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-3.5 bg-[#0f766e] rounded-full inline-block"></span>
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Arrivals by Property
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-[#0f766e] rounded-xs inline-block"></span>
            <span className="font-medium text-slate-600">Arrivals Today</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 border-b-2 border-dashed border-slate-400 inline-block"></span>
            <span className="font-medium text-slate-500">Target: {targetAverage} avg</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full h-[250px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full select-none overflow-visible"
        >
          {/* Y Axis Label */}
          <text
            x={-chartHeight / 2 + 5}
            y={12}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-slate-400 text-[9.5px] font-bold tracking-widest uppercase"
          >
            ARRIVALS
          </text>

          {/* Grid Lines and Y-Axis Ticks */}
          {yTicks.map((tick) => {
            const y = paddingTop + usableHeight * (1 - tick / maxY);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-medium"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Target Average Horizontal Dashed Line */}
          <line
            x1={paddingLeft}
            y1={targetY}
            x2={chartWidth - paddingRight}
            y2={targetY}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4,3"
          />

          {/* Bars */}
          {displayData.map((item, index) => {
            const barWidth = 32;
            const slotWidth = usableWidth / displayData.length;
            const x = paddingLeft + index * slotWidth + (slotWidth - barWidth) / 2;
            const barHeight = (item.count / maxY) * usableHeight;
            const y = paddingTop + usableHeight - barHeight;
            const isHovered = hoveredBar === item.category;
            const isSelected = selectedCategory === item.category;

            return (
              <g
                key={item.category}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredBar(item.category)}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => onSelectCategory && onSelectCategory(isSelected ? '' : item.category)}
              >
                {/* Bar Value on Top */}
                {item.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="fill-slate-700 text-[11px] font-bold"
                  >
                    {item.count}
                  </text>
                )}

                {/* The Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="3"
                  fill={isSelected ? '#042f2e' : isHovered ? '#115e59' : '#0f766e'}
                  className="transition-colors duration-200"
                />

                {/* X Axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${
                    isHovered || isSelected ? 'fill-[#0f766e] font-bold' : 'fill-slate-500 font-medium'
                  }`}
                >
                  {item.shortLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredBar && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md shadow pointer-events-none z-20">
            {displayData.find((d) => d.category === hoveredBar)?.propertyName}:{' '}
            <span className="font-bold text-teal-300">
              {displayData.find((d) => d.category === hoveredBar)?.count} arrivals
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
