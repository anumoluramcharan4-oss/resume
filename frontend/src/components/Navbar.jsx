// ==========================================
// src/components/Navbar.jsx
// ==========================================
// Rebuilt sticky glassmorphic navigation header - Linear/Vercel Style

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Menu, Moon, Sun, Monitor, Command, Sparkles, User, LogOut, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ title, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const themeRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun size={15} />;
      case "dark": return <Moon size={15} />;
      default: return <Monitor size={15} />;
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-subtle glass sticky top-0 z-30 shadow-sm transition-all duration-300">
      
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-muted hover:text-main rounded-xl hover:bg-surface-hover transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={18} />
        </button>

        {/* Premium Breadcrumb / Page Title */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted hidden sm:flex">
          <span>CareerAI</span>
          <span className="text-muted/40">/</span>
          <span className="text-main font-bold text-sm tracking-tight">{title}</span>
        </div>
      </div>

      {/* Right side: Global Actions & User Profile */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">
        
        {/* Premium Search Bar */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface/50 border border-subtle text-muted text-xs w-72 hover:border-focus hover:bg-surface-hover transition-all duration-200 cursor-text group">
          <Search size={14} className="group-hover:text-main transition-colors" />
          <span className="flex-1 tracking-wide">Search dashboard...</span>
          <div className="flex items-center gap-1 text-[10px] font-bold bg-surface border border-subtle px-1.5 py-0.5 rounded-md text-muted">
            <Command size={9} /> K
          </div>
        </div>

        {/* Multi-state Theme Toggle Dropdown */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="w-9 h-9 rounded-xl border border-subtle bg-surface/30 hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main transition-all duration-200 cursor-pointer"
            aria-label="Change theme"
          >
            {getThemeIcon()}
          </button>
          
          <AnimatePresence>
            {themeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-36 rounded-xl border border-subtle bg-card shadow-lg p-1.5 space-y-0.5 z-40"
              >
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer
                      ${theme === t.id 
                        ? "bg-accent/10 text-accent" 
                        : "text-muted hover:bg-surface-hover hover:text-main"}`}
                  >
                    <div className="flex items-center gap-2">
                      <t.icon size={14} />
                      <span>{t.label}</span>
                    </div>
                    {theme === t.id && <Check size={12} className="stroke-[3px]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell */}
        <button 
          className="w-9 h-9 rounded-xl border border-subtle bg-surface/30 hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main transition-all duration-200 relative cursor-pointer"
          aria-label="View notifications"
        >
          <Bell size={15} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full ring-2 ring-base animate-pulse"></span>
        </button>

        {/* Profile Link */}
        <Link
          to="/profile"
          className="w-9 h-9 rounded-xl border border-subtle bg-surface/30 hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main transition-all duration-200 cursor-pointer"
          aria-label="View Profile"
        >
          <User size={15} />
        </Link>

      </div>
    </header>
  );
};

export default Navbar;