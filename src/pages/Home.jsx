import { useState, useEffect, useCallback } from "react";

const ROWS = 20;
const COLS = 10;

const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

const PIECE_COLORS = {
  I: { bg: "bg-cyan-400", glow: "shadow-[0_0_12px_rgba(34,211,238,0.9)]" },
  O: { bg: "bg-yellow-300", glow: "shadow-[0_0_12px_rgba(253,224,71,0.9)]" },
  T: { bg: "bg-purple-400", glow: "shadow-[0_0_12px_rgba(192,132,252,0.9)]" },
  L: { bg: "bg-orange-400", glow: "shadow-[0_0_12px_rgba(251,146,60,0.9)]" },
  J: { bg: "bg-blue-400", glow: "shadow-[0_0_12px_rgba(96,165,250,0.9)]" },
  S: { bg: "bg-green-400", glow: "shadow-[0_0_12px_rgba(74,222,128,0.9)]" },
  Z: { bg: "bg-red-400", glow: "shadow-[0_0_12px_rgba(248,113,113,0.9)]" },
};

const randomPiece = () => {
  const keys = Object.keys(TETROMINOS);
  const rand = keys[Math.floor(Math.random() * keys.length)];
  return { shape: TETROMINOS[rand], type: rand };
};

const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

export default function Tetrominos() {
  const [board, setBoard] = useState(emptyBoard());
  const [piece, setPiece] = useState(randomPiece());
  const [nextPiece, setNextPiece] = useState(randomPiece());
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const collision = useCallback(
    (newX, newY, shape, b = board) =>
      shape.some((row, y) =>
        row.some((cell, x) => {
          if (!cell) return false;
          const px = newX + x;
          const py = newY + y;
          return px < 0 || px >= COLS || py >= ROWS || (py >= 0 && b[py][px]);
        })
      ),
    [board]
  );

  const mergePiece = useCallback(() => {
    const newBoard = board.map((row) => [...row]);
    piece.shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell && pos.y + y >= 0) {
          newBoard[pos.y + y][pos.x + x] = piece.type;
        }
      })
    );
    return newBoard;
  }, [board, piece, pos]);

  const clearLines = useCallback(
    (newBoard) => {
      const filtered = newBoard.filter((row) => row.some((cell) => !cell));
      const cleared = ROWS - filtered.length;
      const emptyRows = Array.from({ length: cleared }, () => Array(COLS).fill(0));

      const points = [0, 100, 300, 500, 800][cleared] || 0;
      setScore((prev) => prev + points * level);
      setLines((prev) => {
        const newLines = prev + cleared;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });

      return [...emptyRows, ...filtered];
    },
    [level]
  );

  const drop = useCallback(() => {
    if (!started || gameOver) return;

    if (!collision(pos.x, pos.y + 1, piece.shape)) {
      setPos((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      const newBoard = mergePiece();
      const clearedBoard = clearLines(newBoard);
      setBoard(clearedBoard);
      const next = nextPiece;
      setPiece(next);
      setNextPiece(randomPiece());
      setPos({ x: 3, y: 0 });

      if (collision(3, 0, next.shape, clearedBoard)) {
        setGameOver(true);
      }
    }
  }, [pos, piece, nextPiece, started, gameOver, collision, mergePiece, clearLines]);

  const move = (dir) => {
    if (!collision(pos.x + dir, pos.y, piece.shape)) {
      setPos((prev) => ({ ...prev, x: prev.x + dir }));
    }
  };

  const rotate = () => {
    const rotated = piece.shape[0].map((_, i) => piece.shape.map((row) => row[i]).reverse());
    if (!collision(pos.x, pos.y, rotated)) {
      setPiece({ ...piece, shape: rotated });
    }
  };

  const hardDrop = () => {
    let newY = pos.y;
    while (!collision(pos.x, newY + 1, piece.shape)) newY++;
    setPos((prev) => ({ ...prev, y: newY }));
  };

  const restart = () => {
    setBoard(emptyBoard());
    setPiece(randomPiece());
    setNextPiece(randomPiece());
    setPos({ x: 3, y: 0 });
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || gameOver) return;
    const speed = Math.max(100, 800 - (level - 1) * 70);
    const interval = setInterval(drop, speed);
    return () => clearInterval(interval);
  }, [drop, level, gameOver, started]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!started || gameOver) {
        if (e.key === "Enter") restart();
        return;
      }
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowDown") drop();
      if (e.key === "ArrowUp") rotate();
      if (e.key === " ") hardDrop();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const renderBoard = () => {
    const tempBoard = board.map((row) => [...row]);

    piece.shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell && pos.y + y >= 0) {
          tempBoard[pos.y + y][pos.x + x] = piece.type;
        }
      })
    );

    return tempBoard.map((row, y) =>
      row.map((cell, x) => {
        const colors = cell && PIECE_COLORS[cell];
        return (
          <div key={`${y}-${x}`} className="relative w-full h-full">
            {cell ? (
              <div className={`absolute inset-[1px] rounded-sm ${colors.bg} ${colors.glow} border border-white/20`} />
            ) : (
              <div className="absolute inset-[1px] rounded-sm bg-slate-900/40 border border-slate-800/30" />
            )}
          </div>
        );
      })
    );
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-950 px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1600px]">

        {/* LEFT PANEL */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div>
            <div className="text-slate-400 text-xs uppercase">Score</div>
            <div className="text-cyan-400 text-3xl font-bold">{score.toString().padStart(6, "0")}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase">Level</div>
            <div className="text-yellow-400 text-2xl font-bold">{level}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase">Lines</div>
            <div className="text-white text-2xl font-bold">{lines}</div>
          </div>
        </div>

        {/* GAME BOARD */}
        <div
          className="grid bg-slate-900 p-2 rounded-xl shadow-2xl flex-1"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            aspectRatio: `${COLS} / ${ROWS}`,
            gap: "1px",
          }}
        >
          {renderBoard()}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 text-center space-y-6">
          <button
            onClick={restart}
            className="px-6 py-3 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition"
          >
            {gameOver ? "Restart" : started ? "Reset" : "Start"}
          </button>

          {gameOver && <div className="text-red-400 font-bold text-lg">Game Over</div>}
        </div>

      </div>
    </div>
  );
}
