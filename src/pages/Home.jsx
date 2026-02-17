import { useState, useEffect, useCallback } from "react";

const ROWS = 20;
const COLS = 10;

const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1],[1, 1]],
  T: [[0, 1, 0],[1, 1, 1]],
  L: [[1, 0],[1, 0],[1, 1]],
  J: [[0, 1],[0, 1],[1, 1]],
  S: [[0, 1, 1],[1, 1, 0]],
  Z: [[1, 1, 0],[0, 1, 1]],
};

const PIECE_COLORS = {
  I: { bg: "bg-cyan-400", glow: "shadow-[0_0_12px_rgba(34,211,238,0.9)]", border: "border-cyan-300", hex: "#22d3ee" },
  O: { bg: "bg-yellow-300", glow: "shadow-[0_0_12px_rgba(253,224,71,0.9)]", border: "border-yellow-200", hex: "#fde047" },
  T: { bg: "bg-purple-400", glow: "shadow-[0_0_12px_rgba(192,132,252,0.9)]", border: "border-purple-300", hex: "#c084fc" },
  L: { bg: "bg-orange-400", glow: "shadow-[0_0_12px_rgba(251,146,60,0.9)]", border: "border-orange-300", hex: "#fb923c" },
  J: { bg: "bg-blue-400", glow: "shadow-[0_0_12px_rgba(96,165,250,0.9)]", border: "border-blue-300", hex: "#60a5fa" },
  S: { bg: "bg-green-400", glow: "shadow-[0_0_12px_rgba(74,222,128,0.9)]", border: "border-green-300", hex: "#4ade80" },
  Z: { bg: "bg-red-400", glow: "shadow-[0_0_12px_rgba(248,113,113,0.9)]", border: "border-red-300", hex: "#f87171" },
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
  const [flashRow, setFlashRow] = useState([]);
  const [combo, setCombo] = useState(0);

  const collision = useCallback((newX, newY, shape, b = board) => {
    return shape.some((row, y) =>
      row.some((cell, x) => {
        if (!cell) return false;
        const px = newX + x;
        const py = newY + y;
        return px < 0 || px >= COLS || py >= ROWS || (py >= 0 && b[py][px]);
      })
    );
  }, [board]);

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

  const clearLines = useCallback((newBoard) => {
    const fullRows = [];
    newBoard.forEach((row, i) => {
      if (row.every((cell) => cell)) fullRows.push(i);
    });
    if (fullRows.length > 0) setFlashRow(fullRows);
    setTimeout(() => setFlashRow([]), 200);

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
    if (cleared > 1) setCombo((c) => c + 1);
    else setCombo(0);

    return [...emptyRows, ...filtered];
  }, [level]);

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
  }, [pos, piece, board, nextPiece, started, gameOver, collision, mergePiece, clearLines]);

  const rotate = useCallback(() => {
    const rotated = piece.shape[0].map((_, i) =>
      piece.shape.map((row) => row[i]).reverse()
    );
    if (!collision(pos.x, pos.y, rotated)) {
      setPiece({ ...piece, shape: rotated });
    }
  }, [piece, pos, collision]);

  const move = useCallback((dir) => {
    if (!collision(pos.x + dir, pos.y, piece.shape)) {
      setPos((prev) => ({ ...prev, x: prev.x + dir }));
    }
  }, [pos, piece, collision]);

  const hardDrop = useCallback(() => {
    let newY = pos.y;
    while (!collision(pos.x, newY + 1, piece.shape)) newY++;
    setPos((prev) => ({ ...prev, y: newY }));
  }, [pos, piece, collision]);

  const restart = () => {
    setBoard(emptyBoard());
    const p = randomPiece();
    const np = randomPiece();
    setPiece(p);
    setNextPiece(np);
    setPos({ x: 3, y: 0 });
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setStarted(true);
    setCombo(0);
  };

  useEffect(() => {
    if (!started || gameOver) return;
    const speed = Math.max(100, 800 - (level - 1) * 70);
    const interval = setInterval(drop, speed);
    return () => clearInterval(interval);
  }, [drop, level, gameOver, started]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!started) { if (e.key === "Enter") restart(); return; }
      if (gameOver) { if (e.key === "Enter") restart(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      if (e.key === "ArrowDown") { e.preventDefault(); drop(); }
      if (e.key === "ArrowUp") { e.preventDefault(); rotate(); }
      if (e.key === " ") { e.preventDefault(); hardDrop(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Ghost piece
  const getGhostY = () => {
    let ghostY = pos.y;
    while (!collision(pos.x, ghostY + 1, piece.shape)) ghostY++;
    return ghostY;
  };

  const renderBoard = () => {
    const tempBoard = board.map((row) => [...row]);
    const ghostY = getGhostY();

    // Ghost
    piece.shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell && ghostY + y >= 0 && !tempBoard[ghostY + y][pos.x + x]) {
          tempBoard[ghostY + y][pos.x + x] = `ghost_${piece.type}`;
        }
      })
    );

    // Active piece
    piece.shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell && pos.y + y >= 0) {
          tempBoard[pos.y + y][pos.x + x] = piece.type;
        }
      })
    );

    return tempBoard.map((row, y) =>
      row.map((cell, x) => {
        const isFlashing = flashRow.includes(y);
        const isGhost = typeof cell === "string" && cell.startsWith("ghost_");
        const pieceType = isGhost ? cell.replace("ghost_", "") : cell;
        const colors = pieceType && PIECE_COLORS[pieceType];

        return (
          <div
            key={`${y}-${x}`}
            className={`
              relative w-full aspect-square
              ${isFlashing ? "animate-pulse" : ""}
            `}
          >
            {cell ? (
              <div
                className={`
                  absolute inset-[1px] rounded-sm
                  ${isGhost
                    ? `border ${colors?.border} opacity-30`
                    : `${colors?.bg} ${colors?.glow} border border-white/20`
                  }
                  transition-all duration-75
                `}
              >
                {!isGhost && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-sm" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-black/20 rounded-sm" />
                  </>
                )}
              </div>
            ) : (
              <div className="absolute inset-[1px] rounded-sm bg-slate-900/40 border border-slate-800/30" />
            )}
          </div>
        );
      })
    );
  };

  const renderNextPiece = () => {
    const grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    const shape = nextPiece.shape;
    const offsetY = Math.floor((4 - shape.length) / 2);
    const offsetX = Math.floor((4 - shape[0].length) / 2);
    shape.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell) grid[offsetY + y][offsetX + x] = nextPiece.type;
      })
    );
    const colors = PIECE_COLORS[nextPiece.type];
    return grid.map((row, y) =>
      row.map((cell, x) => (
        <div key={`next-${y}-${x}`} className="w-6 h-6 relative">
          {cell ? (
            <div className={`absolute inset-[1px] rounded-sm ${colors.bg} ${colors.glow} border border-white/20`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-sm" />
            </div>
          ) : (
            <div className="absolute inset-[1px] rounded-sm bg-slate-900/30 border border-slate-800/20" />
          )}
        </div>
      ))
    );
  };

  const levelColor = level <= 3 ? "text-green-400" : level <= 6 ? "text-yellow-400" : level <= 9 ? "text-orange-400" : "text-red-400";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden"
      style={{
        fontFamily: "'Courier New', monospace",
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px),
          radial-gradient(ellipse 80% 80% at 50% 50%, rgba(88, 28, 135, 0.15), transparent)
        `,
      }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex gap-6 items-start z-10">
        {/* Left panel */}
        <div className="flex flex-col gap-4 w-36">
          {/* Score */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm shadow-xl">
            <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Score</div>
            <div className="text-cyan-400 text-2xl font-bold tabular-nums" style={{ textShadow: "0 0 10px rgba(34,211,238,0.6)" }}>
              {score.toString().padStart(6, "0")}
            </div>
          </div>

          {/* Level */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm shadow-xl">
            <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Level</div>
            <div className={`text-3xl font-bold ${levelColor}`} style={{ textShadow: `0 0 10px currentColor` }}>
              {level}
            </div>
          </div>

          {/* Lines */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm shadow-xl">
            <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Lines</div>
            <div className="text-slate-200 text-2xl font-bold tabular-nums">{lines}</div>
          </div>

          {/* Combo */}
          {combo > 1 && (
            <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4 backdrop-blur-sm shadow-xl animate-pulse">
              <div className="text-yellow-400 text-xs uppercase tracking-widest mb-1">Combo</div>
              <div className="text-yellow-300 text-2xl font-bold" style={{ textShadow: "0 0 10px rgba(253,224,71,0.6)" }}>
                ×{combo}
              </div>
            </div>
          )}

          {/* Controls hint */}
          <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-slate-600 text-xs uppercase tracking-widest mb-2">Controls</div>
            <div className="space-y-1 text-slate-500 text-xs">
              <div>← → <span className="text-slate-400">Move</span></div>
              <div>↑ <span className="text-slate-400">Rotate</span></div>
              <div>↓ <span className="text-slate-400">Soft drop</span></div>
              <div>Space <span className="text-slate-400">Hard drop</span></div>
            </div>
          </div>
        </div>

        {/* Main board */}
        <div className="relative">
          {/* Board chrome */}
          <div
            className="relative bg-slate-950 rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(148,163,184,0.15)",
              boxShadow: "0 0 0 1px rgba(148,163,184,0.05), 0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/* Game title bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/60 bg-slate-900/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-slate-500 text-xs tracking-[0.3em] uppercase">Tetrominos</span>
              <div className="w-12" />
            </div>

            {/* Board grid */}
            <div
              className="grid p-3"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, 28px)`,
                gridTemplateRows: `repeat(${ROWS}, 28px)`,
                gap: "1px",
                background: "rgba(15, 23, 42, 0.9)",
              }}
            >
              {renderBoard()}
            </div>

            {/* Overlay screens */}
            {(!started || gameOver) && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm">
                {gameOver ? (
                  <>
                    <div
                      className="text-red-400 text-4xl font-bold mb-2 tracking-widest uppercase"
                      style={{ textShadow: "0 0 20px rgba(248,113,113,0.8), 0 0 40px rgba(248,113,113,0.4)" }}
                    >
                      Game Over
                    </div>
                    <div className="text-slate-400 text-sm mb-1">Final Score</div>
                    <div
                      className="text-cyan-400 text-5xl font-bold mb-6 tabular-nums"
                      style={{ textShadow: "0 0 20px rgba(34,211,238,0.6)" }}
                    >
                      {score.toString().padStart(6, "0")}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="text-5xl font-black mb-2 tracking-tight"
                      style={{
                        background: "linear-gradient(135deg, #22d3ee, #a855f7, #f87171)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "none",
                        filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))",
                      }}
                    >
                      TETROMINOS
                    </div>
                    <div className="text-slate-500 text-sm mb-8 tracking-widest">BLOCK PUZZLE GAME</div>
                  </>
                )}
                <button
                  onClick={restart}
                  className="group relative px-8 py-3 bg-transparent border border-cyan-500/60 rounded-lg text-cyan-400 text-sm tracking-widest uppercase font-bold overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:text-white"
                  style={{ textShadow: "0 0 10px rgba(34,211,238,0.5)" }}
                >
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ boxShadow: "inset 0 0 20px rgba(34,211,238,0.1)" }} />
                  <span className="relative">{gameOver ? "↩ Restart" : "▶ Start Game"}</span>
                </button>
                <div className="mt-4 text-slate-600 text-xs tracking-widest">PRESS ENTER</div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 w-36">
          {/* Next piece */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm shadow-xl">
            <div className="text-slate-500 text-xs uppercase tracking-widest mb-3">Next</div>
            <div
              className="grid mx-auto"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 24px)",
                gridTemplateRows: "repeat(4, 24px)",
                gap: "1px",
              }}
            >
              {renderNextPiece()}
            </div>
          </div>

          {/* Speed indicator */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm shadow-xl">
            <div className="text-slate-500 text-xs uppercase tracking-widest mb-2">Speed</div>
            <div className="space-y-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i < level
                      ? level <= 3 ? "bg-green-400" : level <= 6 ? "bg-yellow-400" : "bg-red-400"
                      : "bg-slate-800"
                  }`}
                  style={i < level ? { boxShadow: `0 0 6px currentColor` } : {}}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm shadow-xl">
            <div className="text-slate-500 text-xs uppercase tracking-widest mb-3">Stats</div>
            <div className="space-y-2">
              {Object.entries(PIECE_COLORS).map(([type, colors]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${colors.bg} shrink-0`} style={{ boxShadow: `0 0 6px ${colors.hex}` }} />
                  <span className="text-slate-500 text-xs font-bold">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}