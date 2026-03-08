import React from "react";
import { useState } from "react";
import { updateUserScore } from "../services/scoreService";
const GameBoard = ({ board, current, gameOver, score, onHeartClick }) => {
  return (

    <div className="bg-slate-900 p-4 rounded-xl border-4 border-slate-800 flex justify-center relative">

      <div className="absolute top-2 left-2 text-white font-bold">
        Score: {score}
      </div>
      <div className="grid grid-cols-10 gap-1 bg-black p-1 rounded">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isCurrent = current?.shape?.some((shapeRow, sr) =>
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
                  ${isCurrent
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <h2 className="text-red-500 text-2xl font-bold mb-4">GAME OVER</h2>
          <button
            onClick={onHeartClick}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-lg font-bold transition"
          >
            ❤️ Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;