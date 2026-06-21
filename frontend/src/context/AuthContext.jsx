import { createContext, useContext, useState, useEffect } from 'react'; //imports  react hooks for state management and context creation
import { auth } from '../services/api'; // imports authentication services from API service layer

// Create the context
const AuthContext = createContext(null);

// Custom helper hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider'); //prevents using the hook outsiede of the provider
  }
  return context; //returns all authentication data
};

// Auth Provider component - wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //stores the current user data.
  const [loading, setLoading] = useState(true); // used while checking if a user was aleady logged in or not

  // Check if user is logged in on app starting, checks for existing tokens and user data.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) { //if user was preciviously logged in
      setUser(JSON.parse(userData));
    }
    setLoading(false); //authentication check is complete, app can be rendered now.
  }, []);

  // Login function, called after form submission in login page, sends credentials to backend and handles response, stores token and user data on success
  const login = async (email, password) => {
    try {
      const data = await auth.login(email, password);
      
      // Store token and user data
      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.session.user));
      
      setUser(data.session.user); //updates react state with the data so react components can access, without reloading.
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };//if login fails, error message is returned.
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      const data = await auth.signup(email, password);
      
      // Store token and user data
      localStorage.setItem('token', data.user.access_token || '');
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message }; //if Sign up fails, erroe message is returned.
    }
  };

  // Logout function
  const logout = () => { //deletes tokens and user data, returns react state to null, effectively logging the user out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);  
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('token'); //checks if token exists in local storage, if it does, user is considered authenticated
  };

  const value = { //evertything that is provided to the context, accessed by any component.
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; //makes the authentication dadata available to all children wrapped by it.
};