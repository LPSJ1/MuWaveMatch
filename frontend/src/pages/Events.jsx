import { useState } from 'react';

export default function Events() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const genres = ['All', 'Pop', 'EDM', 'Rap', 'Funk', 'Jazz', 'Rock', 'Afrobeats'];

  // Mock data for UI demonstration
  const mockEvents = [
    { id: 1, title: 'Jazz Event', genre: 'Jazz', description: 'Smooth jazz night with live performances' },
    { id: 2, title: 'Pop Meetup', genre: 'Pop', description: 'Pop music showcase and networking' },
    { id: 3, title: 'Rap Event', genre: 'Rap', description: 'Underground rap battle event' },
    { id: 4, title: 'EDM Party', genre: 'EDM', description: 'Electronic dance music festival' },
    { id: 5, title: 'Funk Night', genre: 'Funk', description: 'Funky vibes and groovy beats' },
    { id: 6, title: 'Rock Concert', genre: 'Rock', description: 'Live rock performance' },
    { id: 7, title: 'Afrobeats Festival', genre: 'Afrobeats', description: 'Celebrate Afrobeats culture' },
    { id: 8, title: 'Pop Showcase', genre: 'Pop', description: 'Pop artists showcase event' },
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
                  ? 'bg-orange-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:border-orange-600'
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

        {/* Toggle Buttons */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 font-semibold text-lg transition-colors relative ${
                  activeTab === 'all'
                    ? 'text-orange-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All events
                {activeTab === 'all' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-orange-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`px-4 py-3 font-semibold text-lg transition-colors relative ${
                  activeTab === 'created'
                    ? 'text-orange-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Created by you
                {activeTab === 'created' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-orange-600" />
                )}
              </button>
            </div>
          </div>
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

                  {/* Register Button */}
                  <button className="w-full py-2 border-2 border-gray-900 dark:border-white rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors">
                    Register
                  </button>
                </div>
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