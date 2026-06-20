import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex gap-6">
            <Link
              to="/home"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Events
            </Link>
            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Profile
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
