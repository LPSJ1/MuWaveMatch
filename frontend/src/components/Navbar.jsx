import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent hover:opacity-80 transition flex items-center gap-2">
            🎵 <span>MuWaveMatch</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/home"
              className="nav-link"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="nav-link"
            >
              Events
            </Link>
            <Link
              to="/profile"
              className="nav-link"
            >
              Profile
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Login Button */}
            <Link
              to="/login"
              className="btn-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
