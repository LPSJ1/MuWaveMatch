// API Service Layer for centralized backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Helper to make authenticated requests
const request = async (endpoint, options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth endpoints
export const auth = {
  login: (loginId, password) =>
    request("/api/login", {
      method: "POST",
      body: JSON.stringify({ username: loginId, password }),
    }),

  signup: (email, password, username, name) =>
    request("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, username, name }),
    }),

  getMe: () =>
    request("/api/me", {
      method: "GET",
    }),

  completeProfile: (username) =>
    request("/api/complete-profile", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),

  sendMagicLink: (email) =>
    request("/api/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  updateProfile: (updates) =>
    request("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
};

// Interests endpoints
export const interests = {
  save: (genre_id) =>
    request("/api/interests", {
      method: "POST",
      body: JSON.stringify({ genre_id }),
    }),

  getMyInterests: () =>
    request("/api/interests/me", {
      method: "GET",
    }),

  remove: (genre_id) =>
    request(`/api/interests/${genre_id}`, {
      method: "DELETE",
    }),
};

// Events endpoints
export const events = {
  getAll: () =>
    request("/api/events", {
      method: "GET",
    }),

  getRecommended: () =>
    request("/api/events/recommended", {
      method: "GET",
    }),

  create: (eventData) =>
    request("/api/events", {
      method: "POST",
      body:
        eventData instanceof FormData ? eventData : JSON.stringify(eventData),
    }),

  rsvp: (eventId) =>
    request(`/api/events/${eventId}/rsvp`, {
      method: "POST",
    }),

  cancelRsvp: (eventId) =>
    request(`/api/events/${eventId}/rsvp`, {
      method: "DELETE",
    }),

  getMine: () =>
    request("/api/events/mine", {
      method: "GET",
    }),

  getMyRsvps: () =>
    request("/api/events/rsvps", {
      method: "GET",
    }),

  kickAttendee: (eventId, userId) =>
    request(`/api/events/${eventId}/attendees/${userId}`, {
      method: "DELETE",
    }),

  getAttendees: (eventId) =>
    request(`/api/events/${eventId}/attendees`, {
      method: "GET",
    }),
};

// Match endpoints
export const matches = {
  getMatches: () =>
    request("/api/match", {
      method: "GET",
    }),
};

//Notification Endpoint
export const notifications = {
  getAll: () =>
    request("/api/notifications", {
      method: "GET",
    }),

  markAsRead: (notification_id) =>
    request("/api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ notification_id }),
    }),
};

//Genre Endpoint
export const genres = {
  getAll: () =>
    request("/api/genres", {
      method: "GET",
    }),
};

//Admin Endpoint
export const admin = {
  getPendingEvents: () =>
    request("/api/admin/events/pending", {
      method: "GET",
    }),

  approveEvent: (eventId) =>
    request(`/api/admin/events/${eventId}/approve`, {
      method: "PATCH",
    }),

  rejectEvent: (eventId) =>
    request(`/api/admin/events/${eventId}/reject`, {
      method: "PATCH",
    }),

  getUsers: () =>
    request("/api/admin/users", {
      method: "GET",
    }),

  promoteUser: (userId) =>
    request(`/api/admin/users/${userId}/promote`, {
      method: "PATCH",
    }),

  getComplaints: () =>
    request("/api/admin/complaints", {
      method: "GET",
    }),

  reviewComplaint: (id) =>
    request(`/api/admin/complaints/${id}/review`, {
      method: "PATCH",
    }),
};

//Complaints Endpoint
export const complaints = {
  submit: (event_id, reason) =>
    request("/api/complaints", {
      method: "POST",
      body:
        eventData instanceof FormData
          ? eventData
          : JSON.stringify({ event_id, reason }),
    }),
};

export default {
  auth,
  interests,
  events,
  matches,
  notifications,
  genres,
  admin,
  complaints,
};
