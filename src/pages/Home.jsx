import "tailwindcss";
import Navbar from '../components/Navbar';
import GameBoard from '../components/GameBoard';
import StatsPanel from '../components/StatsPanel';
import NextPiece from '../components/NextPiece';
import Controls from '../components/Controls';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500">
      <Navbar />
      
      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stats & Lifelines */}
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
          <StatsPanel />
          <NextPiece />
        </div>

        {/* Center: The Vault (Game Board) */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <GameBoard />
          </div>
        </div>

        {/* Right: Controls & Info */}
        <div className="lg:col-span-3 order-3 space-y-6">
          <Controls />
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-500 leading-relaxed">
            <p className="font-bold mb-1 uppercase text-indigo-400">System Note:</p>
            Clear lines to strengthen Core Stability. Fail to clear, and system access will be terminated.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;