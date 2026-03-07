import "tailwindcss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { logoutUser } from "../services/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch username from Firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        }
      } else {
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

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

        {username ? (
          <>
            <span className="text-sm text-cyan-400">👤 {username}</span>
            <button
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-md text-sm"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;