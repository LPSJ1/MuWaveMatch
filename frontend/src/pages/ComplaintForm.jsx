import { useState, useEffect } from 'react';
import { events as eventsApi, complaints as complaintsApi } from '../services/api';

export default function ComplaintForm() {
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsApi.getAll()
      .then((data) => setEventsList(data.events || []))
      .catch((err) => console.error('Error fetching events:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId || !reason) return;
    setLoading(true);
    setError('');
    try {
      await complaintsApi.submit(eventId, reason);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Attendee support
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Submit a Complaint
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Use this form if you were removed from an event and want an admin to review it.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-lg border-2 border-green-600 bg-green-50 px-6 py-8 text-center dark:bg-green-950/30">
            <p className="text-lg font-bold text-green-800 dark:text-green-200">Complaint submitted!</p>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              An admin will review your complaint and follow up if needed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border-2 border-gray-900 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
            {error && (
              <div className="rounded-lg border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Which event were you removed from?
              </span>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="mt-2 w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                required
              >
                <option value="">Select an event</option>
                {eventsList.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} — {event.location}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                What happened?
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white min-h-40"
                placeholder="Describe why you believe the removal should be reviewed"
                required
              />
            </label>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-orange-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
