import { useState, useEffect, useCallback } from "react";

const ROWS = 10;
const COLS = 10;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" },
  O: { shape: [[1, 1],[1, 1]], color: "bg-yellow-400" },
  T: { shape: [[0,1,0],[1,1,1]], color: "bg-purple-400" },
  L: { shape: [[1,0],[1,0],[1,1]], color: "bg-orange-400" },
  J: { shape: [[0,1],[0,1],[1,1]], color: "bg-blue-400" },
  S: { shape: [[0,1,1],[1,1,0]], color: "bg-green-400" },
  Z: { shape: [[1,1,0],[0,1,1]], color: "bg-red-400" },
};

const randomPiece = () => {
  const keys = Object.keys(TETROMINOS);
  return TETROMINOS[keys[Math.floor(Math.random() * keys.length)]];
};

const rotate = (matrix) =>
  matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

const GameBoard = () => {
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [current, setCurrent] = useState({
    ...randomPiece(),
    position: { row: 0, col: 3 },
  });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);

  const collision = (shape, pos) => {
    return shape.some((row, r) =>
      row.some((cell, c) => {
        if (!cell) return false;
        const newRow = pos.row + r;
        const newCol = pos.col + c;
        return (
          newCol < 0 ||
          newCol >= COLS ||
          newRow >= ROWS ||
          (board[newRow] && board[newRow][newCol])
        );
      })
    );
  };

  const mergePiece = () => {
    const newBoard = board.map(row => [...row]);
    current.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          newBoard[current.position.row + r][current.position.col + c] =
            current.color;
        }
      });
    });
    return newBoard;
  };

  const clearLines = (newBoard) => {
    const filtered = newBoard.filter(row => row.some(cell => !cell));
    const linesCleared = ROWS - filtered.length;
    const emptyRows = Array.from({ length: linesCleared }, () =>
      Array(COLS).fill(null)
    );
    setScore(prev => prev + linesCleared * 100);
    return [...emptyRows, ...filtered];
  };

  const move = (dir) => {
    if (paused || gameOver) return;
    const newPos = { ...current.position };
    if (dir === "left") newPos.col--;
    if (dir === "right") newPos.col++;
    if (dir === "down") newPos.row++;

    if (!collision(current.shape, newPos)) {
      setCurrent(prev => ({ ...prev, position: newPos }));
    } else if (dir === "down") {
      const merged = mergePiece();
      const cleared = clearLines(merged);
      setBoard(cleared);
      const newPiece = {
        ...randomPiece(),
        position: { row: 0, col: 3 },
      };
      if (collision(newPiece.shape, newPiece.position)) {
        setGameOver(true);
      }
      setCurrent(newPiece);
    }
  };

  const rotatePiece = () => {
    if (paused || gameOver) return;
    const rotated = rotate(current.shape);
    if (!collision(rotated, current.position)) {
      setCurrent(prev => ({ ...prev, shape: rotated }));
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
      if (e.key === "ArrowDown") move("down");
      if (e.key === "ArrowUp") rotatePiece();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    if (paused || gameOver) return;
    const interval = setInterval(() => move("down"), 700);
    return () => clearInterval(interval);
  });

  return (
    <div className="bg-slate-900 p-4 rounded-xl border-4 border-slate-800 flex justify-center">
      <div className="grid grid-cols-10 gap-1 bg-black p-1 rounded">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isCurrent =
              current.shape.some((shapeRow, sr) =>
                shapeRow.some(
                  (val, sc) =>
                    val &&
                    r === current.position.row + sr &&
                    c === current.position.col + sc
                )
              );

            return (
              <div
                key={`${r}-${c}`}
                className={`w-6 h-6 md:w-7 md:h-7 border rounded-sm
                  ${
                    isCurrent
                      ? current.color
                      : cell
                      ? cell
                      : "bg-slate-900/30 border-slate-800/20"
                  }`}
              />
            );
          })
        )}
      </div>

      {gameOver && (
        <div className="absolute text-red-500 text-xl font-bold">
          GAME OVER
        </div>
      )}
    </div>
  );
};

export default GameBoard;