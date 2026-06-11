// ==========================================
// src/components/Sidebar.jsx
// ==========================================
// Rebuilt premium floating sidebar navigation with Linear & Notion styling

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
  Settings,
  Compass,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Career Advisor", icon: Compass, path: "/advisor" },
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
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 flex flex-col glass border border-subtle overflow-hidden shrink-0 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[80px]' : 'w-[280px]'}
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          md:my-4 md:ml-4 md:h-[calc(100vh-2rem)] md:rounded-2xl`}
      >
        {/* Header (Logo + Brand Name) */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-subtle h-16 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-[#e0b02b] flex items-center justify-center flex-shrink-0 shadow-md shadow-accent/10">
              <Zap size={18} className="text-black font-black" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-display font-extrabold text-main text-lg tracking-tight whitespace-nowrap"
                >
                  Career<span className="text-accent">AI</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 text-muted hover:text-main rounded-xl hover:bg-surface-hover transition-colors"
          >
            <X size={18} />
          </button>

          {/* Desktop Collapse Toggle (Top Right) */}
          {!mobileMenuOpen && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 text-muted hover:text-main rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {!collapsed && (
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 px-3">
              Platform Menu
            </p>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? "text-main font-semibold"
                  : "text-muted hover:text-main hover:bg-surface-hover"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Sliding active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabSidebar"
                      className="absolute inset-0 rounded-xl bg-accent/10 border border-accent/20"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-accent" : "text-muted group-hover:text-main"}`}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[13.5px] whitespace-nowrap relative z-10 tracking-wide"
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

        {/* User Card & Logout (Bottom) */}
        <div className="p-3 border-t border-subtle space-y-2 bg-surface/30">
          {/* User profile card */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover/50 transition-colors duration-200 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-[#e0b02b] flex items-center justify-center flex-shrink-0 text-black text-xs font-black shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden flex-1"
                >
                  <p className="text-xs font-semibold text-main truncate leading-normal">
                    {user?.name || "Charan"}
                  </p>
                  <p className="text-[10px] text-muted truncate leading-normal">
                    {user?.email || "charan@career.ai"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group cursor-pointer"
          >
            <LogOut size={16} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;