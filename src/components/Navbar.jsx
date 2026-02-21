
import "tailwindcss";

const Navbar = () => {
  return (
    <div className="navbar">
      
      <div className="nav-links">
        <h2 className="text-xl font-bold text-cyan-400">Tetrominos</h2>
        <button className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm">Play</button>
        <button className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm">Leaderboard</button>
        <button className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm">Logout</button>
        <span className="text-sm">👤 Chenitha</span>
      </div>
      <div className="user-section">
        
      </div>
    </div>
  );
};

export default Navbar;
