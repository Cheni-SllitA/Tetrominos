import { useGame } from "../hooks/useGame";
import { useGameControls } from "../hooks/useGameControls";

import GameBoard from "../components/GameBoard";
import StatsPanel from "../components/StatsPanel";
import NextPiece from "../components/NextPiece";
import Controls from "../components/Controls";
import HeartModal from "../components/HeartModal";

const Home = () => {
  const game = useGame();

  const { togglePause } = useGameControls({
    move: game.move,
    setPaused: game.setPaused,
    gameOver: game.gameOver,
  });

  const resetGame = () => {
    game.setBoard(game.emptyBoard());
    game.setCurrent(game.withSpawnPosition(game.randomPiece()));
    game.setScore(0);
    game.setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500">
      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left panel */}
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
          <StatsPanel score={game.score} lives={game.lives} />
          <Controls
            paused={game.paused}
            gameOver={game.gameOver}
            onMove={game.move}
            onPauseToggle={togglePause}
          />
        </div>

        {/* Game board */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <GameBoard
              board={game.board}
              current={game.current}
              gameOver={game.gameOver}
              score={game.score}
              onHeartClick={() => game.setShowHeartModal(true)}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-3 order-3 space-y-6"></div>

      </main>

      {/*
        HeartModal sits OUTSIDE the grid at the page root so its
        position:fixed overlay covers the full viewport correctly.
        - No `puzzle` prop — the modal fetches its own fresh puzzle on mount.
        - onSubmit(answer, puzzle) → useGame validates and revives or ends game.
      */}
      {game.showHeartModal && (
        <HeartModal onSubmit={game.submitHeartAnswer} />
      )}

    </div>
  );
};

export default Home;
