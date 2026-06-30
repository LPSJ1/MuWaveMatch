import { useState } from 'react';

const attendeeSeed = [
  {
    id: 1,
    name: 'Amani Otieno',
    email: 'amani@example.com',
    event: 'Rooftop Afrohouse Night',
    status: 'Checked in',
    requested: false,
  },
  {
    id: 2,
    name: 'Leila Kamau',
    email: 'leila@example.com',
    event: 'Rooftop Afrohouse Night',
    status: 'RSVP confirmed',
    requested: false,
  },
  {
    id: 3,
    name: 'Brian Mwangi',
    email: 'brian@example.com',
    event: 'Indie Showcase',
    status: 'RSVP confirmed',
    requested: false,
  },
];

export default function OrganizerAttendees() {
  const [attendees, setAttendees] = useState(attendeeSeed);
  const [activeEvent, setActiveEvent] = useState('All events');
  const [message, setMessage] = useState('');

  const eventOptions = ['All events', ...new Set(attendeeSeed.map((attendee) => attendee.event))];
  const visibleAttendees =
    activeEvent === 'All events'
      ? attendees
      : attendees.filter((attendee) => attendee.event === activeEvent);

  const handleKickRequest = (attendeeId) => {
    const attendee = attendees.find((item) => item.id === attendeeId);

    setAttendees((currentAttendees) =>
      currentAttendees.map((item) =>
        item.id === attendeeId ? { ...item, requested: true } : item
      )
    );
    setMessage(
      `Kick request prepared for ${attendee?.name || 'attendee'}. This is local until the backend action exists.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Organizer tools
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
              Event Attendees
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
              Review attendee lists and prepare kick requests for admin review.
            </p>
          </div>

          <label className="block w-full max-w-xs">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Event
            </span>
            <select
              value={activeEvent}
              onChange={(event) => setActiveEvent(event.target.value)}
              className="input-field mt-2 w-full"
            >
              {eventOptions.map((eventName) => (
                <option key={eventName} value={eventName}>
                  {eventName}
                </option>
              ))}
            </select>
          </label>
        </div>

        {message && (
          <div className="rounded-lg border-2 border-orange-600 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
            {message}
          </div>
        )}

        <section className="card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Attendee List
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kick requests shown here are local placeholders until backend support is added.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
              {visibleAttendees.length} attendees
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {visibleAttendees.map((attendee) => (
              <article
                key={attendee.id}
                className="rounded-lg border-2 border-gray-900 p-5 dark:border-slate-600"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {attendee.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {attendee.email}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
                        {attendee.event}
                      </span>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                        {attendee.status}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleKickRequest(attendee.id)}
                    disabled={attendee.requested}
                    className="rounded-full border-2 border-red-600 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {attendee.requested ? 'Request Prepared' : 'Request Kick'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
