// ==========================================
// src/components/Navbar.jsx
// ==========================================
// Top navigation bar for dashboard pages with Theme Toggle & Search - Editorial Luxe

import { motion } from "framer-motion";
import { Bell, Search, Menu, Moon, Sun, Command } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ title, setMobileMenuOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 flex items-center justify-between px-6 border-b border-[rgba(212,175,55,0.1)] glass-nav sticky top-0 z-30"
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 text-muted hover:text-main rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <h1 className="text-lg font-semibold text-main hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">
        {/* Search Bar (Visual) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl input-dark text-muted text-sm w-64 mr-2 cursor-text hover:border-[var(--color-border-focus)] transition-colors">
          <Search size={14} />
          <span className="flex-1">Search...</span>
          <div className="flex items-center gap-1 text-[10px] font-medium bg-surface px-1.5 py-0.5 rounded border border-[rgba(212,175,55,0.1)]">
            <Command size={10} /> K
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl glass border border-[rgba(212,175,55,0.1)] flex items-center justify-center text-muted hover:text-main transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notification bell */}
        <button className="w-9 h-9 rounded-xl glass border border-[rgba(212,175,55,0.1)] flex items-center justify-center text-muted hover:text-main transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--color-text-accent)]/30 rounded-full animate-pulse-slow"></span>
        </button>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;