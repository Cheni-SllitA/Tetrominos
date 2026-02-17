const rows = 20;
const cols = 10;

const GameBoard = () => {
  return (
    <div className="game-board">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => (
          <div key={`${row}-${col}`} className="cell"></div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
