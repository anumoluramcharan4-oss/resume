// ==========================================
// src/components/DashboardLayout.jsx
// ==========================================
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children, title }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen bg-[#0A0A0B] text-white">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="relative z-10 flex min-h-screen w-full md:w-auto md:flex-1 min-w-0 flex-col layout-content">
        <Navbar title={title} setMobileMenuOpen={setMobileMenuOpen} />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="custom-scrollbar flex-1 overflow-y-auto px-6 lg:px-10 py-6 pb-12"
          >
            <div className="app-container-dashboard">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;