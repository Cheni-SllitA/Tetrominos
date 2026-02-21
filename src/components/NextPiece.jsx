import "tailwindcss";

const NextPiece = () => {
  // Hardcoded sample T piece
  const samplePiece = {
    shape: [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "cyan-400", // optional for styling
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 w-max">
      <h2 className="text-sm text-indigo-400 mb-2">Next Piece</h2>

      <div className="grid grid-cols-4 gap-1">
        {samplePiece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-5 h-5 rounded-sm ${
                cell ? "bg-cyan-400" : "bg-slate-800"
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;