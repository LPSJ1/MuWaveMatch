import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/api";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          localStorage.setItem("token", session.access_token);
          localStorage.setItem("user", JSON.stringify(session.user));
          setUser(session.user);

          try {
            const { profile } = await auth.getMe();
            if (!profile) {
              window.location.href = "/set-username";
            }
          } catch (err) {
            console.error("Error checking profile:", err);
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (loginId, password) => {
    try {
      const data = await auth.login(loginId, password);

      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(data.session.user));
      localStorage.setItem("profile", JSON.stringify(data.profile));

      setUser(data.session.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, username, name) => {
    try {
      await auth.signup(email, password, username, name);
      return await login(username, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
