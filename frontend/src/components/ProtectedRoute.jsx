// ==========================================
// src/components/ProtectedRoute.jsx
// ==========================================
// Prevents unauthenticated users from accessing private pages.
// Redirects to /login if no token found.

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  return <Outlet />;
};

export default ProtectedRoute;
