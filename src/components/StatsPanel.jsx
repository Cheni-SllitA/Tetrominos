import "tailwindcss";
import { Heart, Shield } from 'lucide-react';

const StatsPanel = () => {
  return (
    <div className="space-y-4">
      {/* <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 mb-3">
          <Shield size={14} className="text-cyan-400" /> Core Stability
        </label>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div className="h-full bg-cyan-500 w-[75%] shadow-[0_0_10px_#06b6d4]" />
        </div>
        <div className="flex justify-between mt-2 font-mono text-sm text-cyan-500">
          <span>STABLE</span>
          <span>75%</span>
        </div>
      </div> */}

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">
          Heart API Lifelines
        </label>
        <div className="flex gap-3">
          <Heart fill="#f43f5e" className="text-rose-500 drop-shadow-[0_0_5px_#f43f5e]" />
          <Heart fill="#f43f5e" className="text-rose-500 drop-shadow-[0_0_5px_#f43f5e]" />
          <Heart className="text-slate-700" />
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;