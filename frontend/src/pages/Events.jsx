export default function Events() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((event) => (
          <div key={event} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2">Music Event {event}</h3>
            <p className="text-gray-600 mb-4">Discover local music events in Nairobi</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
