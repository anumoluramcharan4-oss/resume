// ==========================================
// src/components/LandingNavbar.jsx
// ==========================================
// Editorial Magazine Navbar - Dark Editorial Luxe

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <Zap size={18} className="text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">
            Career<span className="text-[var(--color-text-accent)]">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted hover:text-main transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-main transition-colors">How it works</a>
          <a href="#testimonials" className="text-sm font-medium text-muted hover:text-main transition-colors">Testimonials</a>
        </div>

        {/* Auth Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted hover:text-main hover:bg-surface-hover transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full btn-primary text-sm font-semibold tracking-wide"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle & Theme */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-main"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="text-muted hover:text-main"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 glass-nav border-t border-[rgba(212,175,55,0.1)] py-4 px-6 flex flex-col gap-4"
        >
          <a href="#features" className="text-muted py-2 border-b border-[rgba(212,175,55,0.1)]">Features</a>
          <a href="#how-it-works" className="text-muted py-2 border-b border-[rgba(212,175,55,0.1)]">How it works</a>
          <Link to="/" className="btn-primary text-center py-3 rounded-lg mt-2 font-semibold">
            Go to Dashboard
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default LandingNavbar;