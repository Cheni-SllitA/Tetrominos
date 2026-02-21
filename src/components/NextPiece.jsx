import "tailwindcss";

const NextPiece = ({ piece }) => {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h2 className="text-sm text-indigo-400 mb-2">Next Piece</h2>

      <div className="grid grid-cols-4 gap-1">
        {piece?.shape.map((row, y) =>
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