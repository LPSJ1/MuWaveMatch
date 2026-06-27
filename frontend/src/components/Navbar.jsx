import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Link to="/" style={{ fontSize: '2rem', fontWeight: '800', textDecoration: 'none', color: '#f97316', fontFamily: 'Syne, sans-serif', letterSpacing: '2px' }}>
            MUWAVE
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link
              to="/home"
              style={{ color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', borderBottom: '2px solid #f97316', paddingBottom: '0.25rem' }}
            >
              DISCOVER
            </Link>
            <Link
              to="/events"
              style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.3s' }}
            >
              COMMUNITIES
            </Link>
            <Link
              to="/events"
              style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem', transition: 'color 0.3s' }}
            >
              EVENTS
            </Link>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search your frequency..."
                style={{ padding: '0.6rem 1rem', borderRadius: '2rem', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', fontSize: '0.9rem', width: '220px', outline: 'none' }}
              />
            </div>

            {/* Notification Bell */}
            <button
              style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#f97316' }}
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </button>

            {/* User Profile Avatar */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #f97316',
                overflow: 'hidden',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}
            >
              👤
            </div>
          </div>
        </div>
      </div>
    </nav>
  );}
