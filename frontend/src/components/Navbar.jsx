// ==========================================
// src/components/Navbar.jsx
// ==========================================
// Minimalist, clean dashboard top bar

import { Link } from "react-router-dom";
import { Menu, Search, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title, setMobileMenuOpen }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0A0A0B]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {title && (
          <h1 className="text-sm font-semibold text-white tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#131316] px-3 py-1.5 focus-within:border-blue-500 transition-colors w-64">
          <Search size={14} className="text-zinc-500 shrink-0" />
          <input
            className="w-full bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            placeholder="Search resumes, jobs..."
            type="text"
          />
        </div>

        {/* Profile Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 text-zinc-400 hover:text-white transition-colors"
          title="Account profile"
        >
          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs font-medium text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserCircle2 size={16} />}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;