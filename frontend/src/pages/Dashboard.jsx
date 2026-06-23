// ==========================================
// src/pages/Dashboard.jsx
// ==========================================
// Rebuilt premium AI SaaS dashboard with charts, stats, and timelines

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Plus, Sparkles, Briefcase, TrendingUp,
  ChevronRight, Clock, Star, Target, Brain, ArrowUpRight,
  TrendingDown, ArrowDownRight, Compass, ShieldAlert, Award, Calendar, CheckCircle, HelpCircle,
  Upload
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar
} from "recharts";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Mock analytics data
const scoreGrowthData = [
  { name: "May 1", score: 62 },
  { name: "May 10", score: 68 },
  { name: "May 20", score: 72 },
  { name: "Jun 1", score: 80 },
  { name: "Jun 5", score: 88 },
  { name: "Jun 8", score: 92 },
];

const applicationSuccessData = [
  { name: "Applied", count: 18 },
  { name: "Reviewing", count: 12 },
  { name: "Interviews", count: 4 },
  { name: "Offers", count: 2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const getAtsAvg = () => {
    const scoredResumes = resumes.filter(r => r.atsScore);
    if (scoredResumes.length === 0) return 0;
    return Math.round(scoredResumes.reduce((a, r) => a + r.atsScore, 0) / scoredResumes.length);
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-subtle p-3 rounded-xl shadow-lg text-xs font-semibold">
          <p className="text-muted">{payload[0].name}</p>
          <p className="text-accent mt-1">Value: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title="Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* 1. Hero Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-[1.75rem] border border-subtle overflow-hidden p-8 md:p-10 lg:p-12 bg-gradient-to-tr from-surface via-card/50 to-surface"
        >
          {/* Subtle accent glows */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-12 bg-accent/2 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">
                {greeting()}, {user?.name || "Charan"} 👋
              </span>
              <h2 className="text-display-3 font-extrabold text-main tracking-tight leading-tight">
                Ready to accelerate your career?
              </h2>
              <p className="text-muted text-sm max-w-xl">
                Build ATS-friendly professional resumes, test job description matching scores, and fetch real-time recommendations driven by Gemini AI.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/resume/new"
                className="btn-primary flex items-center gap-2 text-xs font-bold shadow-sm"
              >
                <Plus size={14} className="stroke-[3px]" /> Create Resume
              </Link>
              <Link
                to="/gallery"
                className="btn-secondary flex items-center gap-2 text-xs font-bold"
              >
                <Compass size={14} /> Browse Gallery
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Import Existing Resume Card */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-[1.75rem] border border-dashed border-accent/30 bg-accent/[0.02] p-8 hover:bg-accent/[0.04] hover:border-accent/50 transition-all duration-300 group cursor-pointer"
          onClick={() => navigate("/resume/import")}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = e.dataTransfer.files;
            if (files && files.length > 0 && files[0].type === "application/pdf") {
              navigate("/resume/import", { state: { droppedFile: files[0] } });
            } else if (files && files.length > 0) {
              alert("Only PDF files are supported");
            }
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Upload size={22} className="stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-main uppercase tracking-widest flex items-center gap-2 font-display">
                  Import Existing Resume <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 lowercase tracking-normal font-bold">New</span>
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed max-w-xl">
                  Drag & drop your existing resume PDF here, or click to upload. Career AI will extract personal information, skills, projects, and work experience to automatically create your profile and career roadmap.
                </p>
              </div>
            </div>
            
            {/* Visual drag indicator */}
            <div className="border border-subtle bg-surface/50 rounded-xl px-5 py-3 text-xs font-semibold text-muted group-hover:text-accent group-hover:border-accent/40 transition-all flex items-center gap-2.5 shrink-0">
              <Upload size={14} className="text-accent animate-bounce" />
              <span>Drop PDF here to import</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Total Resumes",
              value: resumes.length,
              icon: FileText,
              trend: resumes.length > 0 ? "+24% this month" : "No documents yet",
              trendUp: true,
            },
            {
              label: "ATS Average",
              value: getAtsAvg() > 0 ? `${getAtsAvg()}%` : "N/A",
              icon: Target,
              trend: getAtsAvg() > 0 ? "+8 points gain" : "No ATS score yet",
              trendUp: getAtsAvg() > 60,
            },
            {
              label: "Job Matches",
              value: resumes.length > 0 ? "45" : "0",
              icon: Briefcase,
              trend: resumes.length > 0 ? "+15% matched today" : "Create resume first",
              trendUp: true,
            },
            {
              label: "Skills Listed",
              value: resumes.reduce((acc, curr) => acc + (curr.skills?.length || 0), 0),
              icon: Brain,
              trend: resumes.length > 0 ? "Gemini Optimized" : "No skills saved",
              trendUp: true,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass border border-subtle rounded-2xl p-5 md:p-6 hover:border-focus hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-300">
                  <stat.icon size={18} />
                </div>
                <ArrowUpRight size={14} className="text-muted group-hover:text-main transition-colors" />
              </div>
              
              <div className="space-y-1">
                <p className="text-muted text-xs font-semibold tracking-wide uppercase">{stat.label}</p>
                <div className="text-2xl font-black text-main leading-none py-1">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-muted">
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 3. Quick Actions Cards Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-sm font-bold text-main uppercase tracking-widest px-1">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Create Resume", icon: Plus, path: "/resume/new", desc: "Build from scratch" },
              { label: "AI Suggestions", icon: Sparkles, path: "/ai", desc: "Gaps & project ideas" },
              { label: "Job Match Analyzer", icon: Target, path: "/jobs/match", desc: "Scan match rating" },
              { label: "Find Jobs", icon: Briefcase, path: "/jobs", desc: "Explore AI fits" },
              { label: "Interview Prep", icon: Brain, path: "/ai?tab=weakness", desc: "Simulate questions" },
              { label: "Examples Gallery", icon: Star, path: "/gallery", desc: "Browse templates" },
            ].map((act, idx) => (
              <button
                key={idx}
                onClick={() => navigate(act.path)}
                className="glass border border-subtle rounded-2xl p-5 text-left hover:border-focus hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[140px] cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <act.icon size={16} />
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-main tracking-tight leading-tight group-hover:text-accent transition-colors">
                    {act.label}
                  </h4>
                  <p className="text-[10px] text-muted leading-tight mt-1 truncate">
                    {act.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 4. Analytics & Recent Activity splits */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts pane (2/3 width) */}
          <div className="lg:col-span-2 glass border border-subtle rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-main uppercase tracking-widest">
                  Analytics & Score Growth
                </h3>
                <p className="text-[11px] text-muted mt-0.5">Track your resume improvements over time</p>
              </div>
              <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
                Active ATS Target: 90%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chart 1: ATS Progress */}
              <div className="h-[200px] border border-subtle/50 rounded-xl p-3 bg-surface/30">
                <p className="text-[10.5px] font-bold text-muted uppercase tracking-wider mb-2">Resume Score Growth</p>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={scoreGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={9} />
                    <YAxis domain={[0, 100]} stroke="var(--color-text-muted)" fontSize={9} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="score" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 2: Success pipeline */}
              <div className="h-[200px] border border-subtle/50 rounded-xl p-3 bg-surface/30">
                <p className="text-[10.5px] font-bold text-muted uppercase tracking-wider mb-2">Application Success Funnel</p>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={applicationSuccessData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={9} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={9} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity pane (1/3 width) */}
          <div className="glass border border-subtle rounded-2xl p-6 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold text-main uppercase tracking-widest">
                Recent Activity
              </h3>
              <p className="text-[11px] text-muted mt-0.5">Logs of your platform updates</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[220px] custom-scrollbar">
              {[
                { title: "ATS scan completed", time: "10 mins ago", type: "scan", desc: "Finished ATS match rating scan for Google role." },
                { title: "Resume updated", time: "2 hours ago", type: "resume", desc: "Updated achievements list in Professional resume." },
                { title: "Applied to Amazon", time: "Yesterday", type: "apply", desc: "Submitted software dev application via Find Jobs." },
                { title: "Skills gap analyzed", time: "3 days ago", type: "ai", desc: "Gemini identified 3 missing libraries in Profile." },
              ].map((act, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-normal">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-surface-hover border border-subtle flex items-center justify-center text-[10px] text-accent font-bold">
                      {idx + 1}
                    </div>
                    {idx < 3 && <div className="w-[1px] flex-1 bg-subtle my-1" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-main">{act.title}</span>
                      <span className="text-[9px] text-muted">{act.time}</span>
                    </div>
                    <p className="text-muted text-[11px]">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 5. Resumes Section & Premium Empty state */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-main uppercase tracking-widest">
              Your Resumes
            </h3>
            {resumes.length > 0 && (
              <Link
                to="/resume/new"
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 font-bold"
              >
                <Plus size={14} className="stroke-[3px]" /> Add New
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : resumes.length === 0 ? (
            /* Premium Illustration Empty State */
            <div className="relative border border-dashed border-subtle rounded-2xl p-12 text-center bg-surface/10 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/3 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-md mx-auto space-y-5">
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent shadow-sm animate-pulse-slow">
                  <Award size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-main tracking-tight">
                    Start Building Your Dream Career
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Create your first resume structure in minutes. Use Gemini AI to optimize achievements, fill skill gaps, and run compatibility audits on target job postings.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    to="/resume/new"
                    className="btn-primary flex items-center gap-2 text-xs font-bold"
                  >
                    <Plus size={14} className="stroke-[3px]" /> Create Resume
                  </Link>
                  <Link
                    to="/ai"
                    className="btn-secondary flex items-center gap-2 text-xs font-bold"
                  >
                    <Sparkles size={14} /> AI Suggestions
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Premium Resume Cards List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((res) => (
                <div
                  key={res._id}
                  onClick={() => navigate(`/resume/${res._id}`)}
                  className="glass border border-subtle rounded-2xl p-6 hover:border-focus hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <FileText size={18} />
                      </div>
                      
                      {res.atsScore ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                            ATS: {res.atsScore}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted font-bold tracking-wider uppercase bg-surface border border-subtle px-2 py-0.5 rounded-full">
                          Not scanned
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-main group-hover:text-accent transition-colors leading-snug">
                      {res.title || "Untitled Resume"}
                    </h4>
                    <p className="text-[11px] text-muted mt-1 capitalize">{res.template} template</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-subtle/50 mt-5 pt-4">
                    <div className="flex items-center gap-1.5 text-[10.5px] text-muted">
                      <Clock size={12} />
                      <span>{new Date(res.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs font-semibold text-accent flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;