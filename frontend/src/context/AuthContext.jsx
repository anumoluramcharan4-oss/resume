// ==========================================
// src/context/AuthContext.jsx
// ==========================================
// Global authentication state using React Context.
// Any component can access user info and auth functions
// without prop drilling.

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// Create the context
const AuthContext = createContext();

// AuthProvider wraps the entire app and provides auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in (token exists)
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          const res = await api.get("/auth/me");
          setUser(res.data.user);
          setToken(savedToken);
        } catch (err) {
          // Token is invalid or expired — clear it
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Login function — stores token, sets user
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  };

  // Logout function — clears everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  // Update user after profile edit
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access auth context in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
