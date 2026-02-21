import "tailwindcss";
import Navbar from "../components/Navbar";

const Register = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md relative group">
          {/* Gradient background blur */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

          {/* Registration panel */}
          <div className="relative bg-slate-900 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Create Your Account</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 rounded-md bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-2 px-4 rounded-md transition"
              >
                Register
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-cyan-400 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;