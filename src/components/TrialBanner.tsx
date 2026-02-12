import React from 'react';
import { Info, ArrowRight } from 'lucide-react';

const TrialBanner: React.FC = () => {
  return (
    <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-emerald-800">
        <Info size={14} className="text-emerald-500" />
        <p className="font-medium tracking-tight">You are currently in <span className="font-bold">Trial Mode</span>. 28 days left.</p>
        <button className="ml-4 flex items-center gap-1 font-black text-emerald-700 hover:text-emerald-900 transition-colors uppercase tracking-widest text-[10px]">
          Upgrade Now <ArrowRight size={12} />
        </button>
      </div>
      {/* Subtle thin progress accent at the bottom of the banner */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-600 w-[70%] opacity-50" />
    </div>
  );
};

export default TrialBanner;