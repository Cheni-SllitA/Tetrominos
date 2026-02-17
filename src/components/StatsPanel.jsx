import { useState } from "react";

const StatsPanel = () => {
  const [score] = useState(10);
  const [lines] = useState(1);
  const [level] = useState(1);
  const [time] = useState("5:00");
  const [hearts] = useState(3);

  return (
    <div className="stats-panel">
      <div>Score: {score}</div>
      <div>Lines: {lines}</div>
      <div>Level: {level}</div>
      <div>Time: {time}</div>
      <div>
        Hearts: {"❤️".repeat(hearts)}
      </div>
    </div>
  );
};

export default StatsPanel;
