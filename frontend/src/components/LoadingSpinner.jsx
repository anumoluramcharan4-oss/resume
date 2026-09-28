// ==========================================
// src/components/LoadingSpinner.jsx
// ==========================================

import { motion } from "framer-motion";

const LoadingSpinner = ({ fullScreen = false, size = "md" }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizes[size]} rounded-full border-2 border-primary/25 border-t-primary`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      {size !== "sm" && (
        <p className="text-body-sm text-on-surface-variant">Loading...</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-3xl font-bold text-primary"
          >
            CareerAI
          </motion.div>
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;