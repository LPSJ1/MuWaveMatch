import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'DISCOVER', to: '/home' },
  { label: 'EVENTS', to: '/events' },
];

const getStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem('profile') || 'null');
  } catch {
    return null;
  }
};

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const profile = authenticated ? getStoredProfile() : null;
  const isAdmin = Boolean(profile?.is_admin);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New event: Jazz Night added to your area', read: false, created_at: '2 hours ago' },
    { id: 2, message: 'Your registration for Pop Concert is confirmed', read: false, created_at: '5 hours ago' },
    { id: 3, message: 'EDM Festival starts tomorrow!', read: true, created_at: '1 day ago' },
    { id: 4, message: 'You have a new match based on your interests', read: true, created_at: '2 days ago' },
  ]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate('/login');
  };

  const handleNavigation = (path) => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate(path);
  };

  const markAsRead = (id) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="shrink-0 text-3xl font-extrabold tracking-[2px] text-orange-600"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            MUWAVE
          </Link>

          {authenticated && (
            <div className="hidden items-center gap-10 lg:flex">
              {navItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`pb-1 text-sm font-semibold transition-colors ${
                    index === 0
                      ? 'border-b-2 border-orange-600 text-orange-600'
                      : 'text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            {!authenticated ? (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-orange-600 hover:text-orange-600 dark:border-slate-600 dark:text-gray-200 dark:hover:border-orange-500 dark:hover:text-orange-400"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div ref={notifDropdownRef} className="relative">
                  <button
                    onClick={() => setShowNotifDropdown((current) => !current)}
                    className="relative rounded-full p-2 text-orange-600 transition-colors hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-slate-800"
                    aria-label="Notifications"
                  >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border-2 border-gray-900 bg-white p-2 shadow-xl dark:border-slate-600 dark:bg-slate-800 sm:w-96">
                      <div className="mb-1 border-b border-gray-200 px-3 py-2 dark:border-slate-700">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                          No notifications yet
                        </div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`mb-1 flex items-start gap-3 rounded-md px-3 py-2 ${
                                notification.read
                                  ? 'bg-transparent'
                                  : 'bg-orange-50 dark:bg-orange-950/30'
                              }`}
                            >
                              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                notification.read
                                  ? 'bg-gray-100 text-gray-400 dark:bg-slate-700'
                                  : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300'
                              }`}>
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-5 text-gray-700 dark:text-gray-200">
                                  {notification.message}
                                </p>
                                <div className="mt-1 flex items-center justify-between gap-3">
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {notification.created_at}
                                  </span>
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
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

                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setShowDropdown((current) => !current)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange-600 bg-gray-800 text-white transition-colors hover:bg-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600"
                    aria-label="Profile menu"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-lg border-2 border-gray-900 bg-white p-2 shadow-xl dark:border-slate-600 dark:bg-slate-800">
                      <DropdownItem label="Your Events" onClick={() => handleNavigation('/profile?section=events')} icon="calendar" />
                      <DropdownItem label="Edit Profile" onClick={() => handleNavigation('/profile?section=edit')} icon="edit" />
                      <DropdownItem label="Settings" onClick={() => handleNavigation('/profile')} icon="settings" />
                      {isAdmin && (
                        <DropdownItem label="Your Admin Dashboard" onClick={() => handleNavigation('/admin')} icon="dashboard" />
                      )}
                      <div className="my-1 h-px bg-gray-200 dark:bg-slate-700" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <div ref={mobileMenuRef} className="relative lg:hidden">
                  <button
                    onClick={() => setShowMobileMenu((current) => !current)}
                    className="rounded-full border border-gray-300 p-2 text-gray-700 transition-colors hover:border-orange-600 hover:text-orange-600 dark:border-slate-600 dark:text-gray-200 dark:hover:border-orange-400 dark:hover:text-orange-400"
                    aria-label="Open navigation menu"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </button>

                  {showMobileMenu && (
                    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[calc(100vw-2rem)] rounded-lg border-2 border-gray-900 bg-white p-3 shadow-xl dark:border-slate-600 dark:bg-slate-800 sm:w-80">
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleNavigation(item.to)}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600 dark:text-gray-200 dark:hover:bg-slate-700 dark:hover:text-orange-400"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
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

function DropdownItem({ label, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600 dark:text-gray-200 dark:hover:bg-slate-700 dark:hover:text-orange-400"
    >
      <DropdownIcon icon={icon} />
      {label}
    </button>
  );
}

function DropdownIcon({ icon }) {
  if (icon === 'calendar') {
    return (
      <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  if (icon === 'edit') {
    return (
      <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    );
  }

  if (icon === 'settings') {
    return (
      <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}
