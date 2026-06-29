import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  // Mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New event: Jazz Night added to your area', read: false, created_at: '2 hours ago' },
    { id: 2, message: 'Your registration for Pop Concert is confirmed', read: false, created_at: '5 hours ago' },
    { id: 3, message: 'EDM Festival starts tomorrow!', read: true, created_at: '1 day ago' },
    { id: 4, message: 'You have a new match based on your interests', read: true, created_at: '2 days ago' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const handleNavigation = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Link to="/" style={{ fontSize: '2rem', fontWeight: '800', textDecoration: 'none', color: '#f97316', fontFamily: 'Syne, sans-serif', letterSpacing: '2px' }}>
            MUWAVE
          </Link>

          {authenticated && (
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
          )}

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {!authenticated ? (
              <>
                <Link
                  to="/login"
                  style={{
                    color: '#374151',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '999px',
                    border: '1px solid #d1d5db'
                  }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#f97316',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    padding: '0.7rem 1.15rem',
                    borderRadius: '999px'
                  }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search your frequency..."
                style={{ padding: '0.6rem 1rem', borderRadius: '2rem', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', fontSize: '0.9rem', width: '220px', outline: 'none' }}
              />
            </div>

            {/* Notification Bell with Dropdown */}
            <div ref={notifDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#f97316', position: 'relative' }}
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    width: '360px',
                    padding: '6px',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                      Notifications
                    </h3>
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '10px 14px',
                            backgroundColor: notif.read ? 'transparent' : '#fef2f2',
                            borderRadius: '8px',
                            marginBottom: '2px'
                          }}
                        >
                          {/* Icon */}
                          <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: notif.read ? '#f3f4f6' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={notif.read ? '#9ca3af' : '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: '1.4' }}>
                              {notif.message}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                {notif.created_at}
                              </span>
                              {!notif.read && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#f97316',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    padding: 0
                                  }}
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Avatar with Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
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
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    minWidth: '220px',
                    padding: '6px',
                    zIndex: 100
                  }}
                >
                  {/* Your Events */}
                  <button
                    onClick={() => handleNavigation('/profile?section=events')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#374151'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Your Events
                  </button>

                  {/* Edit Profile */}
                  <button
                    onClick={() => handleNavigation('/profile?section=edit')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#374151'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Profile
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => handleNavigation('/profile')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#374151'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </button>

                  {/* Your Admin Dashboard - can later be gated with isAdmin */}
                  <button
                    onClick={() => handleNavigation('/admin')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#374151'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M8 8h8" />
                      <path d="M8 12h8" />
                      <path d="M8 16h5" />
                    </svg>
                    Your Admin Dashboard
                  </button>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#ef4444'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
