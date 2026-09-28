// ==========================================
// src/components/Sidebar.jsx
// ==========================================
// Minimal, clean sidebar navigation inspired by Linear and Stripe

import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Brain,
  Settings,
  UserCircle2,
  Zap,
  X,
  Plus
} from "lucide-react";

const navItems = [
  { 
    label: "Overview", 
    icon: LayoutDashboard, 
    path: "/dashboard",
    match: (path) => path === "/dashboard"
  },
  { 
    label: "Resume", 
    icon: FileText, 
    path: "/resume-hub",
    match: (path) => path.startsWith("/resume") || path === "/ai"
  },
  { 
    label: "Jobs", 
    icon: Briefcase, 
    path: "/jobs",
    match: (path) => path.startsWith("/jobs")
  },
  { 
    label: "AI Advisor", 
    icon: Brain, 
    path: "/advisor",
    match: (path) => path.startsWith("/advisor") || path === "/career-advisor"
  },
  { 
    label: "Settings", 
    icon: Settings, 
    path: "/settings",
    match: (path) => path === "/settings" || path === "/profile"
  },
];

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen layout-sidebar flex-col border-r border-white/[0.08] bg-[#131316] transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/[0.08]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shrink-0">
              <Zap size={16} className="fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white text-base tracking-tight leading-none">
                Career<span className="text-blue-500">AI</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide mt-1">
                Career Intelligence
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors md:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-4 pb-2">
          <NavLink
            to="/resume/new"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
          >
            <Plus size={14} /> New Resume
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto sidebar-scroll">
          {navItems.map((item) => {
            const isActive = item.match(location.pathname);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-500" />
                )}
                <Icon size={16} className={isActive ? "text-blue-500" : "text-zinc-400"} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-white/[0.08]">
          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle2 size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{user?.name || "Candidate"}</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.email || "Free Tier"}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;