import { useState, useEffect, useCallback } from "react";
import { fetchHeartPuzzle } from "../services/heartService";
import { updateUserScore } from "../services/scoreService";

const ROWS = 10;
const COLS = 10;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" },
  O: { shape: [[1, 1], [1, 1]], color: "bg-yellow-400" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-purple-400" },
  L: { shape: [[1, 0], [1, 0], [1, 1]], color: "bg-orange-400" },
  J: { shape: [[0, 1], [0, 1], [1, 1]], color: "bg-blue-400" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-green-400" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-red-400" },
};

const randomPiece = () => {
  const keys = Object.keys(TETROMINOS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const piece = TETROMINOS[key];

  return {
    shape: piece.shape.map((row) => [...row]),
    color: piece.color,
  };
};

const rotate = (matrix) =>
  matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());

const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const withSpawnPosition = (piece) => ({
  ...piece,
  position: { row: 0, col: Math.floor((COLS - piece.shape[0].length) / 2) },
});

export const useGame = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [current, setCurrent] = useState(() => withSpawnPosition(randomPiece()));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const [lives, setLives] = useState(2);
  const [checkingHeart, setCheckingHeart] = useState(false);
  const [heartPuzzle, setHeartPuzzle] = useState(null);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [heartInProgress, setHeartInProgress] = useState(false);

  const handleGameOver = async () => {
    if (heartInProgress) return;

    setHeartInProgress(true);

    if (lives > 0) {
      const puzzle = await fetchHeartPuzzle();

      if (puzzle) {
        setHeartPuzzle(puzzle);
        setShowHeartModal(true);
        // Still mark gameOver so UI shows overlay/button
        setGameOver(true);
        return;
      }
    }

    setGameOver(true);
  };

  const submitHeartAnswer = (answer) => {
    if (!heartPuzzle) return;

    if (Number(answer) === Number(heartPuzzle.solution)) {
      // Correct answer → revive
      setLives((prev) => prev - 1);
      setBoard(emptyBoard());
      setCurrent(withSpawnPosition(randomPiece()));
      setShowHeartModal(false);
      setGameOver(false);
    } else {
      // Wrong answer → real game over
      setShowHeartModal(false);
      setGameOver(true);
    }
    setHeartInProgress(false);
  };
  const collision = useCallback(
    (shape, pos) => {
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
    },
    [board]
  );

  const lockCurrentPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const nextBoard = prevBoard.map((row) => [...row]);

      current.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell) return;
          const boardRow = current.position.row + r;
          const boardCol = current.position.col + c;

          if (
            boardRow >= 0 &&
            boardRow < ROWS &&
            boardCol >= 0 &&
            boardCol < COLS
          ) {
            nextBoard[boardRow][boardCol] = current.color;
          }
        });
      });

      const keptRows = nextBoard.filter((row) => row.some((cell) => !cell));
      const clearedRows = ROWS - keptRows.length;

      if (clearedRows > 0) {
        setScore((prev) => {
          const newScore = prev + clearedRows * 10;

          updateUserScore(newScore); // update Firebase

          return newScore;
        });
      }

      const rebuiltBoard = [
        ...Array.from({ length: clearedRows }, () => Array(COLS).fill(null)),
        ...keptRows,
      ];

      const nextPiece = withSpawnPosition(randomPiece());
      const spawnBlocked = nextPiece.shape.some((row, r) =>
        row.some((cell, c) => {
          if (!cell) return false;
          const boardRow = nextPiece.position.row + r;
          const boardCol = nextPiece.position.col + c;
          return rebuiltBoard[boardRow] && rebuiltBoard[boardRow][boardCol];
        })
      );

      if (spawnBlocked) {
        handleGameOver();
      } else {
        setCurrent(nextPiece);
      }

      return rebuiltBoard;
    });
  }, [current]);

  const move = useCallback(
    (dir) => {
      if (paused || gameOver) return;

      if (dir === "rotate") {
        const rotatedShape = rotate(current.shape);

        // prevent rotating out of bounds / into blocks
        if (!collision(rotatedShape, current.position)) {
          setCurrent((prev) => ({
            ...prev,
            shape: rotatedShape,
          }));
        }

        return;
      }

      const newPos = { ...current.position };
      if (dir === "left") newPos.col--;
      if (dir === "right") newPos.col++;
      if (dir === "down") newPos.row++;

      if (!collision(current.shape, newPos)) {
        setCurrent((prev) => ({ ...prev, position: newPos }));
        return;
      }

      if (dir === "down") {
        lockCurrentPiece();
      }
    },
    [current, paused, gameOver, collision, lockCurrentPiece]
  );

  useEffect(() => {
    if (paused || gameOver) return;
    const interval = setInterval(() => move("down"), 700);
    return () => clearInterval(interval);
  }, [move, paused, gameOver]);

  return {
    board,
    current,
    score,
    gameOver,
    lives,
    showHeartModal,
    heartPuzzle,
    submitHeartAnswer,
    move,
    emptyBoard,
    withSpawnPosition,
    randomPiece,
    setBoard,
    setCurrent,
    setScore,
    setGameOver,
    setShowHeartModal
  };
};
