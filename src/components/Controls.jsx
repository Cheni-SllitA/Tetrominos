import { soundManager } from "../services/soundManager";

const Controls = ({ paused, gameOver, onMove, onPauseToggle }) => {
  const disabled = gameOver || paused;

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
      
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded px-3 py-2"
          onClick={() => { onMove("left"); soundManager.play("click"); }}
          disabled={disabled}
        >
          Left
        </button>

        <button
          type="button"
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded px-3 py-2"
          onClick={() => { onMove("down"); soundManager.play("click"); }}
          disabled={disabled}
        >
          Down
        </button>

        <button
          type="button"
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded px-3 py-2"
          onClick={() => { onMove("right"); soundManager.play("click"); }}
          disabled={disabled}
        >
          Right
        </button>
      </div>

      {/* Rotate Button */}
      <button
        type="button"
        className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded px-3 py-2"
        onClick={() => { onMove("rotate"); soundManager.play("click"); }}
        disabled={disabled}
      >
        Rotate
      </button>

      {/* Pause Button */}
      <button
        type="button"
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded px-3 py-2"
        onClick={onPauseToggle}
        disabled={gameOver}
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
};

export default Controls;