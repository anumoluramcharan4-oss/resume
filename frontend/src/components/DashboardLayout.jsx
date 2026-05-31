// ==========================================
// src/components/DashboardLayout.jsx
// ==========================================
// Shared layout for all dashboard pages - Editorial Luxe

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const DashboardLayout = ({ children, title }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-base overflow-hidden w-full relative transition-colors duration-300 lg:gap-8">

      {/* Background Animated Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb glow-orb--1" />
        <div className="glow-orb glow-orb--2" style={{ animationDelay: '2s' }} />
        <div className="glow-orb glow-orb--3" style={{ animationDelay: '4s' }} />
      </div>

      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="flex-1 flex flex-col transition-all duration-300 min-w-0 w-full h-full relative z-10">
        <Navbar title={title} setMobileMenuOpen={setMobileMenuOpen} />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;