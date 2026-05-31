// ==========================================
// src/components/Sidebar.jsx
// ==========================================
// Animated sidebar navigation for dashboard pages - Editorial Luxe

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Briefcase,
  User,
  Images,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  Target,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Resume Builder", icon: FileText, path: "/resume/new" },
  { label: "Gallery", icon: Images, path: "/gallery" },
  { label: "AI Suggestions", icon: Sparkles, path: "/ai" },
  { label: "Job Match Analyzer", icon: Target, path: "/jobs/match" },
  { label: "Jobs & Internships", icon: Briefcase, path: "/jobs" },
  { label: "Profile", icon: User, path: "/profile" },
];

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col glass border-r border-[rgba(212,175,55,0.1)] overflow-hidden shrink-0 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[rgba(212,175,55,0.1)] h-16 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 glow-sm">
              <Zap size={18} className="text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-main text-lg whitespace-nowrap"
                >
                  Career<span className="text-[var(--color-text-accent)]">AI</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-muted hover:text-main"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <p className={`text-[10px] font-bold text-muted uppercase tracking-wider mb-3 px-3 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? '—' : 'Menu'}
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative
                ${isActive
                  ? "bg-[var(--color-text-accent)]/10 text-[var(--color-text-accent)] font-medium"
                  : "text-muted hover:text-main hover:bg-surface-hover"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabSidebar"
                      className="absolute inset-0 rounded-xl bg-[var(--color-text-accent)]/10 border border-[var(--color-text-accent)]/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 relative z-10 ${isActive ? "text-[var(--color-text-accent)]" : "group-hover:scale-110 transition-transform duration-300"}`}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm whitespace-nowrap relative z-10 tracking-wide"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-[rgba(212,175,55,0.1)] space-y-2 bg-surface">
          {/* User preview */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium text-main truncate max-w-[130px]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted truncate max-w-[130px]">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full glass border border-[rgba(212,175,55,0.1)] items-center justify-center text-muted hover:text-main transition-colors z-50 hover:scale-110"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;