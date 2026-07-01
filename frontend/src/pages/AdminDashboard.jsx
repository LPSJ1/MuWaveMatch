import { useEffect, useMemo, useState } from 'react';
import { admin } from '../services/api';

const formatEventDate = (value) => {
  if (!value) return 'Date not set';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getEventTitle = (event) => event.name || event.title || 'Untitled event';


const reportTypes = [
  {
    id: 'events',
    name: 'Event Moderation Report',
    description: 'Summarizes submitted events, pending approvals, and moderation activity.',
    metrics: ['Pending approvals', 'Approved events', 'Rejected events'],
    fields: ['Reporting period', 'Reviewed by', 'Approval notes', 'Follow-up actions'],
  },
  {
    id: 'users',
    name: 'User Activity Report',
    description: 'Reviews signups, active users, genre selections, and profile completion.',
    metrics: ['Total users', 'New users', 'Completed profiles'],
    fields: ['Reporting period', 'Prepared by', 'User growth notes', 'Retention concerns'],
  },
  {
    id: 'matches',
    name: 'Matching Performance Report',
    description: 'Tracks music-interest matching quality and shared-genre trends.',
    metrics: ['Generated matches', 'Average shared genres', 'Top matching genres'],
    fields: ['Reporting period', 'Prepared by', 'Matching observations', 'Recommended tuning'],
  },
  {
    id: 'rsvps',
    name: 'Event Attendance Report',
    description: 'Highlights registrations, RSVP trends, and popular event categories.',
    metrics: ['Total RSVPs', 'Attendance by genre', 'Most registered events'],
    fields: ['Reporting period', 'Prepared by', 'Attendance notes', 'Organizer follow-up'],
  },
];

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const buildReportFormHtml = (report) => `
  <!doctype html>
  <html>
    <head>
      <title>${escapeHtml(report.name)}</title>
      <style>
        @page { size: A4; margin: 18mm; }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          color: #111827;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }
        .header {
          border-bottom: 3px solid #f97316;
          padding-bottom: 14px;
          margin-bottom: 18px;
        }
        .brand {
          color: #f97316;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        h1 {
          margin: 8px 0 4px;
          font-size: 24px;
        }
        .muted { color: #6b7280; }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 18px 0;
        }
        .box {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 10px;
          min-height: 42px;
        }
        .label {
          display: block;
          margin-bottom: 6px;
          color: #374151;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .line {
          border-bottom: 1px solid #9ca3af;
          min-height: 22px;
        }
        .section {
          margin-top: 18px;
        }
        .section h2 {
          margin: 0 0 8px;
          font-size: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #d1d5db;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background: #f3f4f6;
          font-size: 10px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .textarea {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          min-height: 92px;
          padding: 8px;
        }
        .signature {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 28px;
        }
        .print-note {
          margin-top: 20px;
          color: #6b7280;
          font-size: 10px;
        }
        @media print {
          .print-note { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">MuWave Admin</div>
        <h1>${escapeHtml(report.name)}</h1>
        <div class="muted">Generated ${escapeHtml(report.generatedAt)}</div>
      </div>

      <div class="grid">
        ${report.fields.map((field) => `
          <div class="box">
            <span class="label">${escapeHtml(field)}</span>
            <div class="line"></div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>System Summary</h2>
        <div class="box">${escapeHtml(report.summary)}</div>
      </div>

      <div class="section">
        <h2>Report Metrics</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value / Notes</th>
            </tr>
          </thead>
          <tbody>
            ${report.metrics.map((metric) => `
              <tr>
                <td>${escapeHtml(metric)}</td>
                <td></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>Findings</h2>
        <div class="textarea"></div>
      </div>

      <div class="section">
        <h2>Recommended Actions</h2>
        <div class="textarea"></div>
      </div>

      <div class="signature">
        <div>
          <span class="label">Admin signature</span>
          <div class="line"></div>
        </div>
        <div>
          <span class="label">Date</span>
          <div class="line"></div>
        </div>
      </div>

      <p class="print-note">Use your browser print dialog and choose "Save as PDF" to export this form.</p>
    </body>
  </html>
`;

export default function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionEventId, setActionEventId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedReportId, setSelectedReportId] = useState(reportTypes[0].id);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [promotingId, setPromotingId] = useState(null);

  const pendingCount = pendingEvents.length;
  const complaintCount = complaints.length;
  const hasPendingEvents = pendingCount > 0;
  const hasComplaints = complaintCount > 0;
  const selectedReport = reportTypes.find((report) => report.id === selectedReportId);

  const stats = useMemo(() => [
    { label: 'Pending events', value: pendingCount },
    { label: 'Open complaints', value: complaintCount },
    { label: 'Report types', value: reportTypes.length },
  ], [pendingCount, complaintCount]);

  useEffect(() => {
    const loadPendingEvents = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await admin.getPendingEvents();
        setPendingEvents(data.events || []);
      } catch (err) {
        setError(err.message || 'Failed to load pending events.');
        setPendingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadPendingEvents();
  }, []);

  useEffect(() => {
    admin.getComplaints()
      .then((data) => setComplaints(data.complaints || []))
      .catch((err) => console.error('Error loading complaints:', err));
  }, []);

  useEffect(() => {
    admin.getUsers()
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error('Error loading users:', err));
  }, []);

  const handlePromoteUser = async (userId, username) => {
    setPromotingId(userId);
    try {
      await admin.promoteUser(userId);
      setUsers((current) =>
        current.map((u) => u.id === userId ? { ...u, is_admin: true } : u)
      );
      setSuccessMessage(`${username} has been promoted to admin.`);
    } catch (err) {
      setError(err.message || 'Failed to promote user.');
    } finally {
      setPromotingId(null);
    }
  };

  const handleEventDecision = async (event, decision) => {
    const eventId = event.id;
    const eventTitle = getEventTitle(event);

    setActionEventId(eventId);
    setError('');
    setSuccessMessage('');

    try {
      if (decision === 'approve') {
        await admin.approveEvent(eventId);
      } else {
        await admin.rejectEvent(eventId);
      }

      setPendingEvents((currentEvents) =>
        currentEvents.filter((pendingEvent) => pendingEvent.id !== eventId)
      );
      setSuccessMessage(
        `${eventTitle} ${decision === 'approve' ? 'approved' : 'rejected'} successfully.`
      );
    } catch (err) {
      setError(err.message || `Failed to ${decision} event.`);
    } finally {
      setActionEventId(null);
    }
  };

  const handleGenerateReport = () => {
    const report = {
      name: selectedReport.name,
      generatedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      summary:
        selectedReport.id === 'events'
          ? `There are currently ${pendingCount} event submissions waiting for admin review.`
          : `${selectedReport.name} is ready to connect to production analytics data.`,
      metrics: selectedReport.metrics,
      fields: selectedReport.fields,
    };

    setGeneratedReport(report);

    const reportWindow = window.open('', '_blank', 'noopener,noreferrer');

    if (!reportWindow) {
      setError('Could not open the PDF form window. Please allow popups and try again.');
      return;
    }

    reportWindow.document.write(buildReportFormHtml(report));
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  const handleComplaintDecision = async (complaintId, decision) => {
    try {
      await admin.reviewComplaint(complaintId);
      setComplaints((current) => current.filter((item) => item.id !== complaintId));
      setSuccessMessage(`Complaint ${decision === 'resolved' ? 'resolved' : 'dismissed'} successfully.`);
    } catch (err) {
      setError(err.message || 'Failed to update complaint.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              System admin
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
              Your Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
              Review submitted events and generate operational reports for MuWave.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border-2 border-gray-900 bg-white p-5 dark:border-white dark:bg-slate-800"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {successMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-8">
          <section className="rounded-lg border-2 border-gray-900 bg-white p-6 dark:border-white dark:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pending Events
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Approve public events that are ready for discovery, or reject submissions that need organizer changes.
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
                {pendingCount} waiting
              </span>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-b-orange-600" />
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Loading pending events...
                    </p>
                  </div>
                </div>
              ) : hasPendingEvents ? (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <article
                      key={event.id}
                      className="rounded-lg border-2 border-gray-900 p-5 dark:border-slate-600"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {getEventTitle(event)}
                            </h3>
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-800">
                              {event.status || 'pending'}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {event.description || 'No description provided.'}
                          </p>

                          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <dt className="font-semibold text-gray-900 dark:text-white">Location</dt>
                              <dd className="mt-1 text-gray-600 dark:text-gray-400">
                                {event.location || 'Not set'}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-gray-900 dark:text-white">Date</dt>
                              <dd className="mt-1 text-gray-600 dark:text-gray-400">
                                {formatEventDate(event.date)}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-gray-900 dark:text-white">Creator</dt>
                              <dd className="mt-1 truncate text-gray-600 dark:text-gray-400">
                                {event.created_by || event.organizer || 'Unknown'}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex shrink-0 gap-3">
                          <button
                            type="button"
                            onClick={() => handleEventDecision(event, 'reject')}
                            disabled={actionEventId === event.id}
                            className="rounded-full border-2 border-red-600 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionEventId === event.id ? 'Working...' : 'Reject'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEventDecision(event, 'approve')}
                            disabled={actionEventId === event.id}
                            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionEventId === event.id ? 'Working...' : 'Approve'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[240px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700">
                  <div className="max-w-md text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      No pending events
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      New event submissions will appear here when organizers create them.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border-2 border-gray-900 bg-white p-6 dark:border-white dark:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Complaint Review Queue
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Review complaints from users who say they were unfairly removed from an event.
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                {complaintCount} open
              </span>
            </div>

            <div className="mt-6">
              {hasComplaints ? (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <article
                      key={complaint.id}
                      className="rounded-lg border-2 border-gray-900 p-5 dark:border-slate-600"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {complaint.events?.name || 'Unknown event'}
                            </h3>
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800 dark:bg-orange-950/40 dark:text-orange-200">
                              {complaint.status}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {complaint.reason}
                          </p>

                          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                            <div>
                              <dt className="font-semibold text-gray-900 dark:text-white">User</dt>
                              <dd className="mt-1 text-gray-600 dark:text-gray-400">
                                {complaint.profiles?.username || 'Unknown user'}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-gray-900 dark:text-white">Status</dt>
                              <dd className="mt-1 text-gray-600 dark:text-gray-400">
                                {complaint.status}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-gray-900 dark:text-white">Submitted</dt>
                              <dd className="mt-1 text-gray-600 dark:text-gray-400">
                                {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : '—'}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleComplaintDecision(complaint.id, 'dismissed')}
                            className="rounded-full border-2 border-red-600 px-5 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                          >
                            Dismiss
                          </button>
                          <button
                            type="button"
                            onClick={() => handleComplaintDecision(complaint.id, 'resolved')}
                            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700">
                  <div className="max-w-md text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      No open complaints
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Complaint submissions will appear here once the backend workflow is added.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
          </div>

          <aside className="rounded-lg border-2 border-gray-900 bg-white p-6 dark:border-white dark:bg-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reports
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Generate printable PDF forms for key system workflows and admin oversight.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Report type
                </span>
                <select
                  value={selectedReportId}
                  onChange={(event) => {
                    setSelectedReportId(event.target.value);
                    setGeneratedReport(null);
                  }}
                  className="mt-2 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                >
                  {reportTypes.map((report) => (
                    <option key={report.id} value={report.id}>
                      {report.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-lg border-2 border-gray-900 p-4 dark:border-slate-600">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {selectedReport.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {selectedReport.description}
                </p>

                <div className="mt-4 space-y-2">
                  {selectedReport.metrics.map((metric) => (
                    <div
                      key={metric}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="h-2 w-2 rounded-full bg-orange-600" />
                      {metric}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateReport}
                className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Generate PDF Form
              </button>

              {generatedReport && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                  <p className="text-sm font-semibold">
                    {generatedReport.name}
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    PDF-ready form opened {generatedReport.generatedAt}
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    Use the print dialog to save the form as a PDF.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {generatedReport.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-green-800"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* User Management */}
        <section className="rounded-lg border-2 border-gray-900 bg-white p-6 dark:border-white dark:bg-slate-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage registered users and promote trusted members to admin.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-slate-700 dark:text-gray-200">
              {users.length} users
            </span>
          </div>

          {users.length === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-900 dark:border-white">
                    <th className="pb-3 text-left font-semibold text-gray-900 dark:text-white">Username</th>
                    <th className="pb-3 text-left font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="pb-3 text-left font-semibold text-gray-900 dark:text-white">Role</th>
                    <th className="pb-3 text-right font-semibold text-gray-900 dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{u.username}</td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.is_admin ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-200' : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'}`}>
                          {u.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {!u.is_admin && (
                          <button
                            type="button"
                            onClick={() => handlePromoteUser(u.id, u.username)}
                            disabled={promotingId === u.id}
                            className="rounded-full bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {promotingId === u.id ? 'Promoting...' : 'Promote to Admin'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
