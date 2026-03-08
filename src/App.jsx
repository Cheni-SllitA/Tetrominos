import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Leaderboard from "./components/Leaderboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AudioProvider from "./components/AudioProvider";

import Home from "./pages/Home";

function App() {
  return (
    <>
    <AudioProvider/>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes - no protection */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - wrap each element individually */}
          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><Leaderboard /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </>

  );
}

export default App;