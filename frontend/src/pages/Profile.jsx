import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interests as interestsApi } from '../services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [userInterests, setUserInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's interests from backend
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const data = await interestsApi.getMyInterests();
        setUserInterests(data.interests || []);
      } catch (err) {
        console.error('Error fetching interests:', err);
        // Don't show error, just leave interests empty
        setUserInterests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  // Redirect to home if not logged in
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // Get user data from auth context or token
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || 'No email';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="section-heading">
          <span>👤</span>
          <span>My Profile</span>
        </h1>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info Card */}
          <div className="card p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-pink-500 rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>
              </div>
              <button className="btn-secondary px-6">Edit Profile</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Name
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {userEmail}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Member Since
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* Music Interests */}
          <div className="card p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎵 Music Interests
            </h2>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading interests...</p>
              </div>
            ) : userInterests.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {userInterests.map((interest) => (
                    <span
                      key={interest.interest_id || interest.genre_id}
                      className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium"
                    >
                      {interest.genre_name || interest.genres?.name || `Genre ${interest.genre_id}`}
                    </span>
                  ))}
                </div>
                <button className="btn-secondary w-full">Update Interests</button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No interests selected yet
                </p>
                <button 
                  onClick={() => window.location.href = '/genres'}
                  className="btn-primary"
                >
                  Select Your Interests
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Events Stats */}
          <div className="card p-6 text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              {userInterests.length}
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Music Interests
            </p>
          </div>

          {/* Connections Stats */}
          <div className="card p-6 text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              0
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Connections
            </p>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 space-y-3">
            <button 
              onClick={() => window.location.href = '/matches'}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full"
            >
              View Matches
            </button>
            <button className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors w-full">
              My Followers
            </button>
            <button className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors w-full">
              Settings
            </button>
            <button 
              onClick={logout}
              className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold py-2 px-4 rounded-lg transition-colors w-full"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}