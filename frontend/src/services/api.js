// API Service Layer for centralized backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; //detefualt from env, determines where backend server is located

// Helper to get auth token from localStorage.Gets JWT token stored after login/signup to include in authenticated requests. Returns null if no token found.
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper to make authenticated requests. every api call goes through this function
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };    //creates defulat http headers for json conctent 

  // Add authorization header if token exists, tells backeend who the user is for protected routes.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type'); //checks what server sent back.
    if (!contentType || !contentType.includes('application/json')) { //if content type is not json, we can't parse it as json, so we just check if response is ok and return it or throw error.
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
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email, password) =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
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

// Events endpoints (to be implemented on backend)
export const events = {
  getAll: () =>
    request('/api/events', {
      method: 'GET',
    }),
};

// Match endpoints (to be implemented on backend)
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