export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-700">Name</h3>
            <p className="text-gray-600">Your name here</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700">Email</h3>
            <p className="text-gray-600">your.email@example.com</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700">Music Interests</h3>
            <p className="text-gray-600">Your favorite genres will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
