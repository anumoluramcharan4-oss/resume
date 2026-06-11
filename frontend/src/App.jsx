// ==========================================
// src/App.jsx — Main Application Router
// ==========================================
// Defines all routes and wraps the app with providers.
// React Router handles navigation between pages.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import ResumeGallery from "./pages/ResumeGallery";
import AISuggestions from "./pages/AISuggestions";
import JobsPage from "./pages/JobsPage";
import JobMatchPage from "./pages/JobMatchPage";
import ProfilePage from "./pages/ProfilePage";
import CareerAdvisor from "./pages/CareerAdvisor";

function App() {
  return (
    // ThemeProvider gives all components access to light/dark mode
    <ThemeProvider>
      {/* AuthProvider gives all components access to user/token */}
      <AuthProvider>
        <BrowserRouter>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'toast-themed',
              style: {
                background: "var(--color-bg-surface)",
                color: "var(--color-text-main)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "var(--color-bg-surface)" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "var(--color-bg-surface)" } },
            }}
          />

          <Routes>
            {/* ---- Public Routes ---- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/gallery" element={<ResumeGallery />} />

            {/* ---- Protected Routes (require login) ---- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume/new" element={<ResumeBuilder />} />
              <Route path="/resume/:id" element={<ResumePreview />} />
              <Route path="/resume/:id/edit" element={<ResumeBuilder />} />
              <Route path="/ai" element={<AISuggestions />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/match" element={<JobMatchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/advisor" element={<CareerAdvisor />} />
            </Route>

            {/* ---- Catch-all: redirect to home ---- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
