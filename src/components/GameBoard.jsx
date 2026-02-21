import "tailwindcss";

const GameBoard = () => {
  const rows = 10;
  const cols = 10;

  // Hard-coded filled cells (row, col)
  const filledCells = [[0, 3], [1, 3], [2, 3], 
                      [3, 3], [6, 1], [6, 2], 
                      [7, 1], [7, 2], [4, 6], [5, 6], 
                      [6, 6], [6, 7]];

  const isFilled = (row, col) =>
    filledCells.some(([r, c]) => r === row && c === col);

  return (
    <div className="bg-slate-900 p-2 rounded-xl border-4 border-slate-800 flex justify-center backdrop-blur-sm">
      <div className="grid grid-cols-10 gap-1 bg-black p-1 rounded shadow-inner">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`w-6 h-6 md:w-7 md:h-7 border rounded-sm
                ${
                  isFilled(row, col)
                    ? "bg-cyan-400 border-cyan-500"
                    : "bg-slate-900/30 border-slate-800/20"
                }`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;