import "tailwindcss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser } from "../services/authService";
import { auth, db } from "../services/firebase";
import { soundManager } from "../services/soundManager";

const Navbar = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    isAuthenticated: false,
    name: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserProfile({
          isAuthenticated: false,
          name: "",
        });
        return;
      }

      const fallbackName =
        user.displayName || user.email?.split("@")[0] || "Player";

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const storedUsername = docSnap.exists()
          ? docSnap.data().username
          : null;

        setUserProfile({
          isAuthenticated: true,
          name: storedUsername || fallbackName,
        });
      } catch {
        setUserProfile({
          isAuthenticated: true,
          name: fallbackName,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    soundManager.play("click");
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
    soundManager.play("click");
  };

  return (
    <div className="navbar flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 text-white">
      <h2 className="text-xl font-bold text-cyan-400">Tetrominos</h2>

      <div className="ml-auto flex items-center gap-3">
        <button
          className="rounded-md bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
          onClick={() => handleNavigate("/")}
        >
          Play
        </button>
        <button
          className="rounded-md bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
          onClick={() => handleNavigate("/leaderboard")}
        >
          Leaderboard
        </button>

        {userProfile.isAuthenticated ? (
          <>
            <span className="rounded-full border border-cyan-500/40 bg-slate-800 px-3 py-1 text-sm text-cyan-300">
              {userProfile.name}
            </span>
            <button
              className="rounded-md bg-red-700 px-3 py-1 text-sm hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="rounded-md bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
              onClick={() => handleNavigate("/login")}
            >
              Login
            </button>
            <button
              className="rounded-md bg-slate-800 px-3 py-1 text-sm hover:bg-slate-700"
              onClick={() => handleNavigate("/register")}
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
