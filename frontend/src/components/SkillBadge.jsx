// ==========================================
// src/components/SkillBadge.jsx
// ==========================================

import { motion } from "framer-motion";
import { X } from "lucide-react";

const SkillBadge = ({ skill, onRemove, variant = "neutral", color }) => {
  // Map legacy color prop to variants
  const activeVariant = variant !== "neutral" ? variant : (
    color === "green" ? "success" :
    color === "red" ? "danger" :
    (color === "indigo" || color === "cyan") ? "accent" : "neutral"
  );

  const variantStyles = {
    neutral: "bg-white/[0.04] text-zinc-300 border-white/[0.08] hover:border-white/20",
    accent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${variantStyles[activeVariant] || variantStyles.neutral}`}
    >
      <span>{typeof skill === "string" ? skill : skill.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-0.5 text-zinc-400 hover:text-white transition-colors"
          aria-label="Remove skill"
        >
          <X size={12} />
        </button>
      )}
    </motion.span>
  );
};

export default SkillBadge;
