export default function Profile() {
  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'June 2024',
    interests: ['Jazz', 'Hip-Hop', 'Electronic', 'Reggae'],
    eventsAttended: 8,
    connections: 124,
  };

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
                  {user.name}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {user.email}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Member Since
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {user.joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* Music Interests */}
          <div className="card p-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎵 Music Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
            <button className="btn-secondary w-full">Update Interests</button>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Events Stats */}
          <div className="card p-6 text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              {user.eventsAttended}
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Events Attended
            </p>
          </div>

          {/* Connections Stats */}
          <div className="card p-6 text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              {user.connections}
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Connections
            </p>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 space-y-3">
            <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full">View Saved Events</button>
            <button className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors w-full">My Followers</button>
            <button className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors w-full">Settings</button>
            <button className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold py-2 px-4 rounded-lg transition-colors w-full">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
