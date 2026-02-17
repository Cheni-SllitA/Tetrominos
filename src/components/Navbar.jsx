const Navbar = () => {
  return (
    <div className="navbar">
      <h2>Tetrominos</h2>
      <div className="nav-links">
        <button>Play</button>
        <button>Leaderboard</button>
      </div>
      <div className="user-section">
        <span>👤 Chenitha</span>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
