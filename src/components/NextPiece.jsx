import "tailwindcss";

const PREVIEW_SIZE = 4;

const buildPreviewGrid = (piece) => {
  const grid = Array.from({ length: PREVIEW_SIZE }, () =>
    Array(PREVIEW_SIZE).fill(0)
  );

  if (!piece?.shape) {
    return grid;
  }

  const startRow = Math.floor((PREVIEW_SIZE - piece.shape.length) / 2);
  const startCol = Math.floor((PREVIEW_SIZE - piece.shape[0].length) / 2);

  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;
      grid[startRow + rowIndex][startCol + colIndex] = 1;
    });
  });

  return grid;
};

const NextPiece = ({ piece }) => {
  const previewGrid = buildPreviewGrid(piece);
  const filledClass = piece?.color ?? "bg-cyan-400";

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 w-max">
      <h2 className="text-sm text-indigo-400 mb-2">Next Piece</h2>

      <div className="grid grid-cols-4 gap-1">
        {previewGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-5 h-5 rounded-sm ${
                cell ? filledClass : "bg-slate-800"
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;
