import { useState } from "react";

const HeartModal = ({ puzzle, onSubmit }) => {
  const [answer, setAnswer] = useState("");

  if (!puzzle) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-6 rounded-xl space-y-4 w-80 text-center">
        <h2 className="text-lg font-bold text-rose-400">
          Solve to Continue ❤️
        </h2>

        <img
          src={puzzle.question}
          alt="Heart Puzzle"
          className="mx-auto rounded"
        />

        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
          placeholder="Enter answer"
        />

        <button
          onClick={() => onSubmit(answer)}
          className="w-full bg-rose-500 hover:bg-rose-600 p-2 rounded font-bold"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default HeartModal;