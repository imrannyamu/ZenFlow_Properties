
import React from 'react';

const RevenueChart: React.FC = () => {
  // Hardcoded trend data for the last 6 months
  const data = [45, 52, 48, 61, 58, 72];
  const max = Math.max(...data);
  const height = 120;
  const width = 400;
  const padding = 20;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - (val / max) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revenue Trend (6m)</h4>
        <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
          {/* Fix: Replaced invalid 'size' attribute with standard 'width' and 'height' attributes for SVG */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="m19 12-7 7-7-7"/></svg>
          +18.4%
        </span>
      </div>
      <div className="flex-1 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${padding},${height} L ${points} L ${width - padding},${height} Z`}
            fill="url(#gradient)"
          />
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="animate-[draw_2s_ease-in-out]"
          />
        </svg>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
        <span>OCT</span>
        <span>NOV</span>
        <span>DEC</span>
        <span>JAN</span>
        <span>FEB</span>
        <span>MAR</span>
      </div>
    </div>
  );
};

export default RevenueChart;
