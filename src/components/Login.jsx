import "tailwindcss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await loginUser(email, password);
      navigate("/", { replace: true });

    } catch (err) {
      //setError("Invalid email or password");
      console.log(err);
      setError(err.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Login to Tetrominos
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-800"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 py-2 rounded-md text-slate-950 font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;