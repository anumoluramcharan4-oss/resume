// ==========================================
// src/components/ProtectedRoute.jsx
// ==========================================
// Prevents unauthenticated users from accessing private pages.
// Redirects to /login if no token found.

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show spinner while checking auth status
  if (loading) return <LoadingSpinner fullScreen />;

  // If not authenticated, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise, render the protected page
  return <Outlet />;
};

export default ProtectedRoute;
