import { useState } from 'react';

export default function Events() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const genres = ['All', 'Pop', 'EDM', 'Rap', 'Funk', 'Jazz', 'Rock', 'Afrobeats'];

  // Mock data for UI demonstration
  const mockEvents = [
    { id: 1, title: 'Jazz Event', genre: 'Jazz' },
    { id: 2, title: 'Pop Meetup', genre: 'Pop' },
    { id: 3, title: 'Rap Event', genre: 'Rap' },
    { id: 4, title: 'EDM Party', genre: 'EDM' },
    { id: 5, title: 'Funk Night', genre: 'Funk' },
    { id: 6, title: 'Rock Concert', genre: 'Rock' },
    { id: 7, title: 'Afrobeats Festival', genre: 'Afrobeats' },
    { id: 8, title: 'Pop Showcase', genre: 'Pop' },
  ];

  const eventsList = mockEvents;

  // Filter events based on genre and search
  const filteredEvents = eventsList.filter(event => {
    const matchesGenre = selectedGenre === 'All' || 
      event.genre?.toLowerCase() === selectedGenre.toLowerCase();
    
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-xl">Logo</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Events
            </h1>

            {/* Profile Button */}
            <button className="w-16 h-16 rounded-full border-2 border-gray-900 dark:border-white flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Genre Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedGenre === genre
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:border-gray-900 dark:hover:border-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Created by You Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white underline">
            Created by You
          </h2>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search or filter criteria' : 'Check back later for upcoming music events!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-slate-800 border-2 border-gray-900 dark:border-white rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow"
              >
                {/* Event Title */}
                <div className="flex-1 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                </div>

                {/* Register Button */}
                <button className="w-full py-2 border-2 border-gray-900 dark:border-white rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors">
                  Register
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create New Button */}
      <button className="fixed bottom-8 right-8 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full shadow-lg transition-colors">
        Create New
      </button>
    </div>
  );
}