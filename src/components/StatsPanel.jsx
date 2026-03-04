import "tailwindcss";
import { Heart } from "lucide-react";

const StatsPanel = ({ gameOver, checkingHeart, lives }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">
          Heart API Lifelines
        </label>

        <div className="flex gap-3">
          <Heart fill="#f43f5e" className="text-rose-500" />
        </div>

        {checkingHeart && (
          <p className="text-xs text-cyan-400 mt-3 animate-pulse">
            Checking Heart API...
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;