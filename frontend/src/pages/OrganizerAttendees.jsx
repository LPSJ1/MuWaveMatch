import { useState, useEffect } from "react";
import { events as eventsApi } from "../services/api";

export default function OrganizerAttendees() {
  const [myEvents, setMyEvents] = useState([]);
  const [activeEventId, setActiveEventId] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    eventsApi
      .getMine()
      .then((data) => {
        const events = (data.events || []).filter(
          (e) => e.status !== "rejected",
        );
        setMyEvents(events);
        if (events.length > 0) setActiveEventId(events[0].id);
      })
      .catch((err) => setError(err.message || "Failed to load your events."))
      .finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    if (!activeEventId) return;
    setLoadingAttendees(true);
    setAttendees([]);
    eventsApi
      .getAttendees(activeEventId)
      .then((data) => setAttendees(data.attendees || []))
      .catch((err) => setError(err.message || "Failed to load attendees."))
      .finally(() => setLoadingAttendees(false));
  }, [activeEventId]);

  const handleKick = async (userId, username) => {
    setMessage("");
    setError("");
    try {
      await eventsApi.kickAttendee(activeEventId, userId);
      setAttendees((current) => current.filter((a) => a.user_id !== userId));
      setMessage(`${username || "Attendee"} has been removed from the event.`);
    } catch (err) {
      setError(err.message || "Failed to remove attendee.");
    }
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
              View and manage attendees for your events.
            </p>
          </div>

          {myEvents.length > 0 && (
            <label className="block w-full max-w-xs">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Event
              </span>
              <select
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                className="mt-2 w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
              >
                {myEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.status})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {message && (
          <div className="rounded-lg border-2 border-green-600 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 dark:bg-green-950/30 dark:text-green-200">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        <section className="rounded-lg border-2 border-gray-900 bg-white p-6 dark:border-slate-600 dark:bg-slate-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Attendee List
            </h2>
            <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
              {attendees.length} attendees
            </span>
          </div>

          <div className="mt-6">
            {loadingEvents || loadingAttendees ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600" />
              </div>
            ) : myEvents.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                You have no events yet.
              </p>
            ) : attendees.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No attendees for this event yet.
              </p>
            ) : (
              <div className="space-y-4">
                {attendees.map((attendee) => (
                  <article
                    key={attendee.user_id}
                    className="rounded-lg border-2 border-gray-900 p-5 dark:border-slate-600"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {attendee.profiles?.username || "Unknown user"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {attendee.profiles?.email || ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleKick(
                            attendee.user_id,
                            attendee.profiles?.username,
                          )
                        }
                        className="rounded-full border-2 border-red-600 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                      >
                        Remove Attendee
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
