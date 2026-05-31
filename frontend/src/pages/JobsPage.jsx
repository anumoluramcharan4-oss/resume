// ==========================================
// src/pages/JobsPage.jsx
// ==========================================
// AI-powered job and internship recommendations

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, DollarSign, Star, ExternalLink,
  Filter, RefreshCw, Sparkles, BookmarkPlus, BookmarkCheck
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import SkillBadge from "../components/SkillBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import toast from "react-hot-toast";

const JobCard = ({ job, onSave, saved }) => {
  const typeColors = {
    internship: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    job: "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border-[var(--color-brand-500)]/20",
  };

  const matchColor = job.matchScore >= 85 ? "text-green-500" : job.matchScore >= 70 ? "text-yellow-500" : "text-orange-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="glass rounded-[1.5rem] p-6 border border-subtle hover:border-focus transition-all duration-300 shadow-sm hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${typeColors[job.type] || typeColors.job} capitalize font-medium`}>
              {job.type}
            </span>
            {job.matchScore && (
              <span className={`text-xs font-bold ${matchColor}`}>
                {job.matchScore}% match
              </span>
            )}
          </div>
          <h3 className="text-main font-semibold">{job.role}</h3>
          <p className="text-muted text-sm">{job.company}</p>
        </div>
        <button
          onClick={() => onSave(job)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${saved ? "bg-[var(--color-brand-500)]/20 text-[var(--color-brand-500)]" : "text-muted hover:text-[var(--color-brand-500)] hover:bg-[var(--color-brand-500)]/10"}`}
        >
          {saved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
        </button>
      </div>

      {/* Details */}
      <div className="flex items-center gap-4 mb-3 text-xs text-muted">
        <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
        {job.salary && <span className="flex items-center gap-1"><DollarSign size={11} />{job.salary}</span>}
      </div>

      {/* Description */}
      <p className="text-muted text-xs mb-3 leading-relaxed line-clamp-2">{job.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
        {job.requiredSkills?.slice(0, 4).map((s, i) => (
          <SkillBadge key={i} skill={s} color="indigo" />
        ))}
      </div>

      {/* Apply button */}
      <a
        href={job.applyUrl || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl btn-primary font-medium mt-2"
      >
        Apply Now <ExternalLink size={14} />
      </a>
    </motion.div>
  );
};

const JobsPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [filter, setFilter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [resumesRes, savedRes] = await Promise.all([
        api.get("/resumes"),
        api.get("/jobs/saved"),
      ]);
      setResumes(resumesRes.data.resumes);
      setSavedJobIds(new Set(savedRes.data.jobs.map(j => `${j.company}-${j.role}`)));
      setInitialLoad(false);
    };
    init();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resume = resumes.find(r => r._id === selectedResumeId);
      const skills = resume?.skills?.map(s => s.name) || [];
      const experienceLevel = resume?.experience?.length > 0 ? "junior" : "fresher";

      const res = await api.post("/ai/suggest-jobs", { skills, experienceLevel, targetRole });
      setJobs(res.data.jobs || []);
      setCareerPaths(res.data.careerPaths || []);
      toast.success(`Found ${res.data.jobs?.length || 0} job matches! 🎯`);
    } catch {
      toast.error("Failed to fetch jobs. Check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job) => {
    const key = `${job.company}-${job.role}`;
    try {
      if (savedJobIds.has(key)) {
        toast("Already saved!", { icon: "📌" });
        return;
      }
      await api.post("/jobs/saved", job);
      setSavedJobIds(prev => new Set([...prev, key]));
      toast.success("Job saved! 📌");
    } catch {
      toast.error("Failed to save job");
    }
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter(j => j.type === filter);

  if (initialLoad) return <DashboardLayout title="Jobs & Internships"><div className="flex justify-center mt-20"><LoadingSpinner /></div></DashboardLayout>;

  return (
    <DashboardLayout title="Jobs & Internships">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search controls */}
        <GlassCard className="border-subtle shadow-sm">
          <h2 className="text-main font-semibold mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--color-brand-500)]" />
            AI Job Recommendation Engine
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted mb-2 block font-medium">Your Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full input-dark rounded-xl py-2.5 px-4 text-sm"
              >
                <option value="">-- Optional: select resume --</option>
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted mb-2 block font-medium">Target Role</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., React Developer"
                className="w-full input-dark rounded-xl py-2.5 px-4 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchJobs}
                disabled={loading}
                id="find-jobs-btn"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-primary font-medium disabled:opacity-50"
              >
                {loading ? <><RefreshCw size={16} className="animate-spin" /> Finding...</> : <><Briefcase size={16} /> Find Jobs</>}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Filter tabs */}
        {jobs.length > 0 && (
          <div className="flex gap-2">
            {["all", "job", "internship"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize shadow-sm ${
                  filter === f
                    ? "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border border-[var(--color-brand-500)]/30"
                    : "btn-secondary border-transparent"
                }`}
              >
                {f} ({f === "all" ? jobs.length : jobs.filter(j => j.type === f).length})
              </button>
            ))}
          </div>
        )}

        {/* Jobs grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-muted text-sm mt-4">AI is finding the best matches for you...</p>
            </div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredJobs.map((job, i) => (
                <JobCard
                  key={`${job.company}-${job.role}-${i}`}
                  job={job}
                  onSave={handleSave}
                  saved={savedJobIds.has(`${job.company}-${job.role}`)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass rounded-[1.5rem] p-16 border border-subtle text-center shadow-sm">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-main font-semibold mb-2">Find Your Dream Role</h3>
            <p className="text-muted text-sm">Select your resume and let AI recommend the best jobs for your skills.</p>
          </div>
        ) : null}

        {/* Career Paths */}
        {careerPaths.length > 0 && (
          <div>
            <h3 className="text-main font-semibold mb-4">🗺️ Recommended Career Paths</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {careerPaths.map((path, i) => (
                <GlassCard key={i} className="border-subtle hover:border-focus transition-all duration-300 shadow-sm hover:shadow-md">
                  <h4 className="text-main font-semibold mb-1">{path.path}</h4>
                  <p className="text-muted text-sm mb-4">{path.description}</p>
                  <div className="flex items-center justify-between text-xs mt-auto">
                    <span className="text-green-500 font-medium">💰 {path.avgSalary}</span>
                    <div className="flex flex-wrap gap-1">
                      {path.skills?.slice(0, 3).map((s, si) => (
                        <SkillBadge key={si} skill={s} color="purple" />
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
