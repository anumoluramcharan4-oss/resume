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
  const defaultUser = {
    _id: "650000000000000000000001",
    name: "Demo User",
    email: "demo@careerai.com",
    headline: "Software Engineer & Career Optimizer",
    location: "San Francisco, CA",
    targetRole: "Frontend Developer",
    experienceLevel: "mid"
  };

  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState("mock-token");
  const [loading, setLoading] = useState(false);

  // Sync profile data from backend db
  useEffect(() => {
    const initAuth = async () => {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer mock-token`;
        const res = await api.get("/auth/me");
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn("Could not sync with backend user, using default profile:", err.message);
      }
    };
    initAuth();
  }, []);

  // Login function — no-op or local state update
  const login = (userData, authToken) => {
    if (userData) setUser(userData);
  };

  // Logout function — no-op
  const logout = () => {
    console.log("Logout clicked: Auth is disabled, remaining logged in as Demo User.");
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
