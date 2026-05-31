// ==========================================
// src/components/SkillBadge.jsx
// ==========================================

import { motion } from "framer-motion";
import { X } from "lucide-react";

const SkillBadge = ({ skill, onRemove, color = "indigo" }) => {
  const colors = {
    indigo: "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border-[var(--color-brand-500)]/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors[color]}`}
    >
      {typeof skill === "string" ? skill : skill.name}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <X size={10} />
        </button>
      )}
    </motion.span>
  );
};

export default SkillBadge;
