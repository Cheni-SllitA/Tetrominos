import "tailwindcss";
import { useState } from "react";
import { registerUser } from "../services/authService";
import { createUserProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Register auth user
      const user = await registerUser(email, password);

      //  Create Firestore profile
      await createUserProfile(user, username);

      alert("Account created successfully!");
      navigate("/login", { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-800"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-800"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-800"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 py-2 rounded-md text-slate-950 font-semibold"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;