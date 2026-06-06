import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  return (
    <nav style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎵 <span>MuWaveMatch</span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link
              to="/home"
              style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}
            >
              Home
            </Link>
            <Link
              to="/events"
              style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}
            >
              Events
            </Link>
            <Link
              to="/profile"
              style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s' }}
            >
              Profile
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#e5e7eb', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Login Button */}
            <Link
              to="/login"
              style={{ backgroundColor: '#0284c7', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.3s' }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
