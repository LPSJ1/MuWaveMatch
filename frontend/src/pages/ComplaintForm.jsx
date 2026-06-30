import { useState } from 'react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    eventName: '',
    organizerName: '',
    reason: '',
    contact: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
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

        {submitted && (
          <div className="rounded-lg border-2 border-green-600 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 dark:bg-green-950/30 dark:text-green-200">
            Complaint saved locally. It will be wired to backend submission when the API exists.
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6 p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Event name
              </span>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="input-field mt-2 w-full"
                placeholder="Event you were removed from"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Organizer
              </span>
              <input
                type="text"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                className="input-field mt-2 w-full"
                placeholder="Organizer or group name"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              What happened?
            </span>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="input-field mt-2 min-h-40 w-full"
              placeholder="Describe why you believe the removal should be reviewed"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Contact or extra context
            </span>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="input-field mt-2 w-full"
              placeholder="Optional phone, email, ticket reference, or note"
            />
          </label>

          <div className="rounded-lg border-2 border-dashed border-gray-300 p-5 text-center dark:border-slate-600">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Attachments
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Screenshot upload will be added when complaint storage is available.
            </p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary px-8 py-3">
              Save Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
