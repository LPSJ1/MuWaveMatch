import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interests as interestsApi } from '../services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [userInterests, setUserInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditInterests, setShowEditInterests] = useState(false);
  const [interestToRemove, setInterestToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [showEditEvents, setShowEditEvents] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([
    { id: 1, title: 'Jazz Night', description: 'Smooth jazz evening', genre: 'Jazz' },
    { id: 2, title: 'Pop Concert', description: 'Pop music showcase', genre: 'Pop' },
    { id: 3, title: 'EDM Festival', description: 'Electronic dance music', genre: 'EDM' },
    { id: 4, title: 'Rock Show', description: 'Live rock performance', genre: 'Rock' },
  ]);

  // Edit profile form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [editPreferences, setEditPreferences] = useState({
    emailNotifications: true,
    eventReminders: true,
    marketingEmails: false,
  });

  // Auto-open modals based on URL query parameter
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'events') {
      setShowEditEvents(true);
    } else if (section === 'edit') {
      setShowEditProfile(true);
    }
  }, [searchParams]);

  // Fetch user's interests from backend only if user is logged in
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchInterests = async () => {
      try {
        const data = await interestsApi.getMyInterests();
        setUserInterests(data.interests || []);
      } catch (err) {
        console.error('Error fetching interests:', err);
        setUserInterests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [user]);

  // Initialize edit form with current user data
  useEffect(() => {
    if (showEditProfile && user) {
      setEditName(user?.user_metadata?.name || user?.email?.split('@')[0] || '');
      setEditBio(user?.user_metadata?.bio || '');
      setSelectedProfilePic(null);
      setPreviewPic(null);
    }
  }, [showEditProfile, user]);

  // Get user data from auth context or token
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest User';
  const userEmail = user?.email || 'Not logged in';
  const userBio = user?.user_metadata?.bio || 'Music enthusiast and event lover';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';

  const handleRemoveInterest = async (interest) => {
    setInterestToRemove(interest);
  };

  const confirmRemoveInterest = async () => {
    if (!interestToRemove) return;

    setRemoving(true);
    try {
      await interestsApi.remove(interestToRemove.interest_id || interestToRemove.genre_id);
      setUserInterests(userInterests.filter(
        i => (i.interest_id || i.genre_id) !== (interestToRemove.interest_id || interestToRemove.genre_id)
      ));
      setInterestToRemove(null);
    } catch (err) {
      console.error('Error removing interest:', err);
      alert('Failed to remove interest. Please try again.');
    } finally {
      setRemoving(false);
    }
  };

  const handleUnregisterEvent = (eventId) => {
    setRegisteredEvents(registeredEvents.filter(e => e.id !== eventId));
  };

  const handleSaveProfile = () => {
    // Mock save - in real app, this would call an API endpoint
    alert('Profile updated successfully! (Mock - API integration pending)');
    setShowEditProfile(false);
    // In real implementation, you would:
    // 1. Call API to update profile
    // 2. Update user context with new data
    // 3. Refresh the page or update state
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handlePreferenceChange = (pref) => {
    setEditPreferences({
      ...editPreferences,
      [pref]: !editPreferences[pref]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            {/* Profile Photo */}
            <div className="w-32 h-32 rounded-full border-4 border-gray-900 dark:border-white overflow-hidden bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* User Info */}
            <div className="flex-1 ml-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {userBio}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Date Joined: {joinDate}
              </p>
            </div>

            {/* Right Side Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowEditProfile(true)}
                className="px-6 py-2 border-2 border-gray-900 dark:border-white rounded-full font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                Edit Profile
              </button>
              <button className="px-6 py-2 border-2 border-gray-900 dark:border-white rounded-full font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors">
                Settings
              </button>
              {user && (
                <button 
                  onClick={logout}
                  className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-full font-medium hover:bg-red-600 hover:text-white transition-colors"
                >
                  LOG OUT
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Interests */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Interests ({userInterests.length})
              </h2>
              <button 
                onClick={() => setShowEditInterests(true)}
                className="px-4 py-1 border-2 border-gray-900 dark:border-white rounded-full text-sm font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                Edit
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading interests...</p>
              </div>
            ) : userInterests.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {userInterests.slice(0, 4).map((interest) => (
                  <div
                    key={interest.interest_id || interest.genre_id}
                    className="px-6 py-3 border-2 border-gray-900 dark:border-white rounded-full font-medium text-center text-gray-900 dark:text-white"
                  >
                    {interest.genre_name || interest.genres?.name || `Genre ${interest.genre_id}`}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No interests selected yet
                </p>
                <button 
                  onClick={() => window.location.href = '/genres'}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
                >
                  Select Your Interests
                </button>
              </div>
            )}
          </div>

          {/* Registered Events */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Registered Events ({registeredEvents.length})
              </h2>
              <button 
                onClick={() => setShowEditEvents(true)}
                className="px-4 py-1 border-2 border-gray-900 dark:border-white rounded-full text-sm font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {registeredEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="px-6 py-3 border-2 border-gray-900 dark:border-white rounded-full font-medium text-center text-gray-900 dark:text-white"
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture - Centered */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Profile Picture
                </label>
                  <div className="relative w-28 h-28 rounded-full overflow-hidden cursor-pointer group">
                    <div className="w-full h-full border-2 border-gray-900 dark:border-white rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      {previewPic ? (
                        <img src={previewPic} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-white font-medium">Change Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </div>
                {selectedProfilePic && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {selectedProfilePic.name}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setShowEditProfile(false)}
                className="px-6 py-2 border-2 border-gray-900 dark:border-white rounded-full font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Interests Overlay */}
      {showEditInterests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Your Interests
              </h2>
              <button
                onClick={() => setShowEditInterests(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {userInterests.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {userInterests.map((interest) => (
                  <div
                    key={interest.interest_id || interest.genre_id}
                    className="px-6 py-3 border-2 border-gray-900 dark:border-white rounded-full font-medium text-center text-gray-900 dark:text-white relative inline-flex items-center justify-center"
                  >
                    <span>{interest.genre_name || interest.genres?.name || `Genre ${interest.genre_id}`}</span>
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-2 text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No interests to edit
              </p>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setShowEditInterests(false)}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Interests */}
      {interestToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Remove Interest
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove <span className="font-semibold">{interestToRemove.genre_name || interestToRemove.genres?.name || `Genre ${interestToRemove.genre_id}`}</span>?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setInterestToRemove(null)}
                disabled={removing}
                className="px-6 py-2 border-2 border-gray-900 dark:border-white rounded-full font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveInterest}
                disabled={removing}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
              >
                {removing ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registered Events Modal */}
      {showEditEvents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Registered Events
              </h2>
              <button
                onClick={() => setShowEditEvents(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {registeredEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {registeredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white dark:bg-slate-800 border-2 border-gray-900 dark:border-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    >
                      {/* Event Image Placeholder */}
                      <div className="w-full h-32 bg-gray-200 dark:bg-slate-700" />

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                          {event.description}
                        </p>

                        {/* Event Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full">
                            {event.genre}
                          </span>
                        </div>

                        {/* Unregister Button */}
                        <button
                          onClick={() => handleUnregisterEvent(event.id)}
                          className="w-full py-2 border-2 border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors"
                        >
                          Unregister
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowEditEvents(false)}
                    className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No registered events
                </p>
                <button
                  onClick={() => setShowEditEvents(false)}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}