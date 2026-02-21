import "tailwindcss";
import Navbar from '../components/Navbar';

const leaderboardData = [
  { rank: 1, name: "Chenitha", score: 4200 },
  { rank: 2, name: "Dulitha", score: 3800 },
  { rank: 3, name: "Yasas", score: 3500 },
  { rank: 4, name: "Ammar", score: 3200 },
  { rank: 5, name: "Sahan", score: 3000 },
  { rank: 6, name: "Nimal", score: 2800 },
  { rank: 7, name: "Kamal", score: 2500 },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500">


      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left panel for stats or info */}
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
          <div className="p-4 bg-slate-900 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Leaderboard Info</h3>
            <p className="text-sm text-gray-300">
              Top players in Tetrominos! Keep playing to climb the ranks.
            </p>
          </div>
        </div>

        {/* Center: Leaderboard Table */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-900 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Leaderboard</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-4 text-gray-300">Rank</th>
                    <th className="py-2 px-4 text-gray-300">Player</th>
                    <th className="py-2 px-4 text-gray-300">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((player) => (
                    <tr key={player.rank} className="hover:bg-slate-800 transition">
                      <td className="py-2 px-4 text-cyan-400 font-semibold">{player.rank}</td>
                      <td className="py-2 px-4">{player.name}</td>
                      <td className="py-2 px-4">{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right panel for extra info or ads */}
        <div className="lg:col-span-3 order-3 space-y-6">
          <div className="p-4 bg-slate-900 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Tips</h3>
            <p className="text-sm text-gray-300">
              Practice regularly, clear lines efficiently, and focus on combos to maximize your score!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;