import "tailwindcss";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar flex items-center justify-between p-4 bg-slate-900 text-white">
      <h2 className="text-xl font-bold text-cyan-400">Tetrominos</h2>
      <div className="nav-links flex items-center gap-3">
        <button
          className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm"
          onClick={() => navigate("/")}
        >
          Play
        </button>
        <button
          className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm"
          onClick={() => navigate("/leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm">
          Logout
        </button>
        <span className="text-sm">👤 Chenitha</span>
      </div>
    </div>
  );
};

export default Navbar;