// ==========================================
// src/pages/Dashboard.jsx
// ==========================================
// Main dashboard with stats, recent resumes, quick actions - Editorial Luxe

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Plus, Sparkles, Briefcase, TrendingUp,
  ChevronRight, Clock, Star, Target, Brain
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const quickActions = [
  { label: "New Resume", icon: Plus, path: "/resume/new", color: "accent", desc: "Build from scratch" },
  { label: "Job Match Analyzer", icon: Target, path: "/jobs/match", color: "accent", desc: "Test resume fit" },
  { label: "Find Jobs", icon: Briefcase, path: "/jobs", color: "accent", desc: "AI job matching" },
  { label: "View Gallery", icon: Star, path: "/gallery", color: "accent", desc: "Example resumes" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes");
        setResumes(res.data.resumes);
      } catch (err) {
        console.error("Failed to fetch resumes");
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-12 py-4">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative glass rounded-[2rem] p-10 lg:p-12 border border-[rgba(212,175,55,0.1)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-text-accent)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-sm text-muted mb-1">{greeting()},</p>
            <h2 className="text-headline font-bold text-main mb-2">
              {user?.name} 👋
            </h2>
            <p className="text-muted">
              Ready to advance your career today? You have{" "}
              <span className="text-accent font-semibold">{resumes.length} resume{resumes.length !== 1 ? "s" : ""}</span> in your workspace.
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Resumes", value: resumes.length, icon: FileText },
            { label: "AI Score Avg", value: resumes.filter(r => r.atsScore).length > 0 ? Math.round(resumes.reduce((a, r) => a + (r.atsScore || 0), 0) / resumes.filter(r => r.atsScore).length) + "%" : "N/A", icon: Target },
            { label: "Skills Listed", value: resumes.reduce((a, r) => a + (r.skills?.length || 0), 0), icon: Brain },
            { label: "Projects", value: resumes.reduce((a, r) => a + (r.projects?.length || 0), 0), icon: TrendingUp },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="glass rounded-[1.5rem] p-6 lg:p-8 border border-[rgba(212,175,55,0.1)] hover:border-[var(--color-border-focus)] transition-colors duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-[var(--color-text-accent)]/10 border border-[var(--color-text-accent)]/20 flex items-center justify-center mb-4 shadow-sm`}>
                <stat.icon size={18} className="text-accent" />
              </div>
              <div className="text-2xl font-bold text-main">{stat.value}</div>
              <div className="text-muted text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-main mb-4">Quick Actions</h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {quickActions.map((action) => (
              <motion.div key={action.label} variants={itemVariants}>
                <Link
                  to={action.path}
                  className="flex flex-col gap-4 p-6 glass rounded-[1.5rem] border border-[rgba(212,175,55,0.1)] hover:border-[var(--color-border-focus)] transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-[var(--color-text-accent)]/10 border border-[var(--color-text-accent)]/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-main font-medium text-sm">{action.label}</p>
                    <p className="text-muted text-xs">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-main">Your Resumes</h3>
            <Link
              to="/resume/new"
              className="flex items-center gap-1 text-sm text-[var(--color-text-accent)] hover:text-[var(--color-text-accent-muted)] transition-colors font-medium"
            >
              <Plus size={14} /> New Resume
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-[1.5rem] p-12 border border-[rgba(212,175,55,0.1)] text-center"
            >
              <div className="text-5xl mb-4">📄</div>
              <h4 className="text-main font-semibold mb-2">No resumes yet</h4>
              <p className="text-muted text-sm mb-6">Create your first resume and let AI help you shine.</p>
              <Link
                to="/resume/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary font-medium"
              >
                <Plus size={16} /> Create Resume
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {resumes.map((resume) => (
                <motion.div key={resume._id} variants={itemVariants}>
                  <Link
                    to={`/resume/${resume._id}`}
                    className="block glass rounded-[1.5rem] p-6 lg:p-8 border border-[rgba(212,175,55,0.1)] hover:border-[var(--color-border-focus)] transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-text-accent)]/10 border border-[var(--color-text-accent)]/20 flex items-center justify-center">
                        <FileText size={18} className="text-accent" />
                      </div>
                      {resume.atsScore && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-text-accent)]/10 text-[var(--color-text-accent)] border border-[var(--color-text-accent)]/20">
                          ATS: {resume.atsScore}%
                        </span>
                      )}
                    </div>
                    <h4 className="text-main font-semibold mb-1 group-hover:text-[var(--color-text-accent)] transition-colors">
                      {resume.title || "Untitled Resume"}
                    </h4>
                    <p className="text-muted text-xs mb-3 capitalize">{resume.template} template</p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Clock size={11} />
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-xs text-[var(--color-text-accent)] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Open <ChevronRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;