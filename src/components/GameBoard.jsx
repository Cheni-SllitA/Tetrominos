import react from "react"
const GameBoard = ({ board, current, gameOver }) => {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border-4 border-slate-800 flex justify-center relative">
      <div className="grid grid-cols-10 gap-1 bg-black p-1 rounded">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isCurrent = current.shape.some((shapeRow, sr) =>
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
                className={`w-6 h-6 border rounded-sm
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
        <div className="absolute text-red-500 text-xl font-bold">GAME OVER</div>
      )}
    </div>
  );
};

export default GameBoard;
