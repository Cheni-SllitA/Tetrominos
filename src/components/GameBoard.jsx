const GameBoard = () => {
  // Creating a 20x10 empty grid for the UI preview
  const rows = 20;
  const cols = 10;
  
  return (
    <div className="bg-slate-900 p-2 rounded-xl border-4 border-slate-800 flex justify-center backdrop-blur-sm">
      <div className="grid grid-cols-10 gap-1 bg-black p-1 rounded shadow-inner">
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div 
            key={i} 
            className="w-6 h-6 md:w-7 md:h-7 bg-slate-900/30 border border-slate-800/20 rounded-sm"
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;