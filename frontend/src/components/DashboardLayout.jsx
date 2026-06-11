// ==========================================
// src/components/DashboardLayout.jsx
// ==========================================
// Rebuilt premium dual-pane floating dashboard layout

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children, title }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-base overflow-hidden w-full relative transition-colors duration-300 md:p-4 md:gap-4">

      {/* Decorative premium background blur orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb--1 opacity-[0.04] dark:opacity-[0.12]" />
        <div className="glow-orb glow-orb--2 opacity-[0.04] dark:opacity-[0.12]" style={{ animationDelay: '2s' }} />
        <div className="glow-orb glow-orb--3 opacity-[0.03] dark:opacity-[0.08]" style={{ animationDelay: '4s' }} />
      </div>

      {/* Sidebar - Floating on Desktop, Drawer on Mobile */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content Pane - Floating Card on Desktop */}
      <div className="flex-1 flex flex-col transition-all duration-300 min-w-0 w-full h-full relative z-10 glass md:rounded-2xl md:border md:border-subtle overflow-hidden">
        
        {/* Navbar inside the main container */}
        <Navbar title={title} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Scrollable Main area with page transition animations */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar"
          >
            <div className="max-w-7xl xl:max-w-[1440px] mx-auto w-full flex flex-col gap-8 pb-8">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;