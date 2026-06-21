import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { events } from '../services/api';

export default function Events() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await events.getAll();
        // Backend might return { events: [...] } or just [...]
        const eventsArray = data.events || data;
        setEventsList(Array.isArray(eventsArray) ? eventsArray : []);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Redirect to home if not logged in
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

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
      {eventsList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No events available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for upcoming music events!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map((event) => (
            <div key={event.id || event.event_id} className="card p-6 flex flex-col space-y-4 hover:scale-105 transition-transform">
              <div className="text-5xl">{event.image || event.emoji || '🎵'}</div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {event.title || event.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="flex items-center gap-2">
                    📅 <span>{event.date || new Date(event.event_date).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    🕐 <span>{event.time || new Date(event.event_date).toLocaleTimeString()}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    📍 <span>{event.location || event.venue}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    👥 <span>{event.attendees || event.participant_count || 0} attending</span>
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
      )}
    </div>
  );
}