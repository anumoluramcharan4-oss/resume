// ==========================================
// src/components/GlassCard.jsx
// ==========================================
// Reusable glassmorphism card component - Editorial Luxe

import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", hover = false, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      onClick={onClick}
      className={`glass rounded-2xl p-6 ${hover ? "glass-hover cursor-pointer transition-all duration-300" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;