export default function Events() {
  const events = [
    {
      id: 1,
      title: 'Jazz Night at Karen',
      date: 'June 15, 2024',
      time: '8:00 PM',
      location: 'Karen Jazz Club',
      attendees: 342,
      image: '🎷',
    },
    {
      id: 2,
      title: 'Electronic Music Festival',
      date: 'June 22, 2024',
      time: '6:00 PM',
      location: 'Nairobi Convention Centre',
      attendees: 1200,
      image: '🎛️',
    },
    {
      id: 3,
      title: 'Local Hip-Hop Showcase',
      date: 'June 28, 2024',
      time: '7:30 PM',
      location: 'Club Vertigo',
      attendees: 456,
      image: '🎤',
    },
    {
      id: 4,
      title: 'Reggae Vibes & Chill',
      date: 'July 5, 2024',
      time: '5:00 PM',
      location: 'Rooftop Garden',
      attendees: 567,
      image: '🎸',
    },
    {
      id: 5,
      title: 'Indie Pop Night',
      date: 'July 12, 2024',
      time: '8:00 PM',
      location: 'The Spot Venue',
      attendees: 289,
      image: '🎹',
    },
    {
      id: 6,
      title: 'Afrobeats Celebration',
      date: 'July 19, 2024',
      time: '7:00 PM',
      location: 'Safari Park Hotel',
      attendees: 890,
      image: '🥁',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-heading">
          <span>🎵</span>
          <span>Upcoming Events</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover exciting music events happening around Nairobi
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card p-6 flex flex-col space-y-4 hover:scale-105 transition-transform">
            <div className="text-5xl">{event.image}</div>
            
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  📅 <span>{event.date}</span>
                </p>
                <p className="flex items-center gap-2">
                  🕐 <span>{event.time}</span>
                </p>
                <p className="flex items-center gap-2">
                  📍 <span>{event.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  👥 <span>{event.attendees} attending</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
              <button className="btn-primary flex-1">
                View Details
              </button>
              <button className="btn-secondary flex-1">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
