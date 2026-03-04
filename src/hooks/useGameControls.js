import { useEffect } from "react";

export const useGameControls = ({ move, setPaused, gameOver }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move("left");
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        move("right");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        move("down");
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        move("rotate")
        return;
      }

      if (event.key.toLowerCase() === "p") {
        setPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move, gameOver, setPaused]);

  return {
    togglePause: () => setPaused((prev) => !prev),
  };
};
