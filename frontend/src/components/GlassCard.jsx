// ==========================================
// src/components/GlassCard.jsx
// ==========================================
// Reusable surface card component - Minimal Clean Design System

import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = false, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className={`card-clean ${hover ? "card-clean-hover cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;