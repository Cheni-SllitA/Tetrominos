import { useGame } from "../hooks/useGame";
import { useGameControls } from "../hooks/useGameControls";

import GameBoard from "../components/GameBoard";
import StatsPanel from "../components/StatsPanel";
import NextPiece from "../components/NextPiece";
import Controls from "../components/Controls";

const Home = () => {
  const game = useGame();
  const { togglePause } = useGameControls({
    move: game.move,
    setPaused: game.setPaused,
    gameOver: game.gameOver,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500">
      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
          <StatsPanel gameOver={game.gameOver} />
          <NextPiece />
          <Controls
            paused={game.paused}
            gameOver={game.gameOver}
            onMove={game.move}
            onPauseToggle={togglePause}
          />
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <GameBoard board={game.board} current={game.current} gameOver={game.gameOver} />
          </div>
        </div>

        <div className="lg:col-span-3 order-3 space-y-6"></div>
      </main>
    </div>
  );
};

export default Home;
