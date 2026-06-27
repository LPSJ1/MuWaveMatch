// API Service Layer for centralized backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper to make authenticated requests
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth endpoints
export const auth = {
  login: (loginId, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: loginId, password }),
    }),

  signup: (email, password, username, name) =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, name }),
    }),
};

// Interests endpoints
export const interests = {
  save: (genre_id) =>
    request('/api/interests', {
      method: 'POST',
      body: JSON.stringify({ genre_id }),
    }),

  getMyInterests: () =>
    request('/api/interests/me', {
      method: 'GET',
    }),
};

// Events endpoints
export const events = {
  getAll: () =>
    request('/api/events', {
      method: 'GET',
    }),
};

// Match endpoints
export const matches = {
  getMatches: () =>
    request('/api/match', {
      method: 'GET',
    }),
};

export default {
  auth,
  interests,
  events,
  matches,
};
