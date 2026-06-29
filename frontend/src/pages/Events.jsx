import { GENRE_NAMES } from "../data/genres";
import { useState, useEffect } from "react";
import { genres as genresApi, events as eventsApi } from "../services/api";

export default function Events() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const genres = ["All", ...GENRE_NAMES];

  // Create event form state
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [eventPoster, setEventPoster] = useState(null);
  const [eventPosterPreview, setEventPosterPreview] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [genresList, setGenresList] = useState([]);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await genresApi.getAll();
        setGenresList(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres", err);
      }
    };
    fetchGenres();
  }, []);

  // Mock data for UI demonstration
  const mockEvents = [
    {
      id: 1,
      title: "Jazz Event",
      genre: "Jazz",
      description: "Smooth jazz night with live performances",
    },
    {
      id: 2,
      title: "Pop Meetup",
      genre: "Pop",
      description: "Pop music showcase and networking",
    },
    {
      id: 3,
      title: "Rap Event",
      genre: "Rap",
      description: "Underground rap battle event",
    },
    {
      id: 4,
      title: "EDM Party",
      genre: "EDM",
      description: "Electronic dance music festival",
    },
    {
      id: 5,
      title: "Funk Night",
      genre: "Funk",
      description: "Funky vibes and groovy beats",
    },
    {
      id: 6,
      title: "Rock Concert",
      genre: "Rock",
      description: "Live rock performance",
    },
    {
      id: 7,
      title: "Afrobeats Festival",
      genre: "Afrobeats",
      description: "Celebrate Afrobeats culture",
    },
    {
      id: 8,
      title: "Pop Showcase",
      genre: "Pop",
      description: "Pop artists showcase event",
    },
  ];

  const eventsList = mockEvents;

  // Filter events based on genre and search
  const filteredEvents = eventsList.filter((event) => {
    const matchesGenre =
      selectedGenre === "All" ||
      event.genre?.toLowerCase() === selectedGenre.toLowerCase();

    const matchesSearch = event.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventPoster(file);
      setEventPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitEvent = async () => {
    if (
      !eventName ||
      !eventDescription ||
      !eventLocation ||
      !eventDate ||
      !eventTime ||
      selectedGenres.length === 0
    ) {
      return;
    }

    setCreateError("");

    try {
      const date = new Date(`${eventDate}T${eventTime}`).toISOString();

      await eventsApi.create({
        name: eventName,
        description: eventDescription,
        location: eventLocation,
        date,
        genre_ids: selectedGenres,
      });

      setShowCreateModal(false);
      setShowSuccess(true);

      setEventName("");
      setEventDescription("");
      setEventLocation("");
      setEventDate("");
      setEventTime("");
      setSelectedGenres([]);
      setEventPoster(null);
      setEventPosterPreview(null);
      setIsPrivate(false);
    } catch (err) {
      setCreateError(
        err.message || "Failed to create event. Please try again.",
      );
      console.error("Error creating event:", err);
    }
  };

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

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
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:border-orange-600"
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
                onClick={() => setActiveTab("all")}
                className={`px-4 py-3 font-semibold text-lg transition-colors relative ${
                  activeTab === "all"
                    ? "text-orange-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                All events
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-orange-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("created")}
                className={`px-4 py-3 font-semibold text-lg transition-colors relative ${
                  activeTab === "created"
                    ? "text-orange-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Created by you
                {activeTab === "created" && (
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
              {searchQuery
                ? "Try adjusting your search or filter criteria"
                : "Check back later for upcoming music events!"}
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
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full shadow-lg transition-colors"
      >
        Create New
      </button>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Event
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {createError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {createError}
              </div>
            )}

            <div className="space-y-6">
              {/* Poster Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Poster
                </label>
                <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-pointer group border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="w-full h-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    {eventPosterPreview ? (
                      <img
                        src={eventPosterPreview}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <svg
                          className="w-10 h-10 text-gray-400 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click to upload poster
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm text-white font-medium">
                      {eventPosterPreview ? "Change Poster" : "Upload Poster"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe your event"
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Event location (e.g. Nairobi, Kenya)"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Genre Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Genre
                </label>
                <div className="flex flex-wrap gap-3">
                  {GENRE_NAMES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        selectedGenres.includes(genre)
                          ? "bg-orange-600 text-white"
                          : "bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-orange-600"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Private/Public Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Event Visibility
                </label>
                <div className="inline-flex items-center bg-gray-100 dark:bg-slate-700 rounded-full p-1">
                  <button
                    onClick={() => setIsPrivate(false)}
                    className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                      !isPrivate
                        ? "bg-orange-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Public
                  </button>
                  <button
                    onClick={() => setIsPrivate(true)}
                    className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                      isPrivate
                        ? "bg-orange-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border-2 border-gray-900 dark:border-white rounded-full font-medium hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEvent}
                className="px-8 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
              >
                Submit Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Event Submitted!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your event has been submitted for approval. We will review it and
              notify you once it's live.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
