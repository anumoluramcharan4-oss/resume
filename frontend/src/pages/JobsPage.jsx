// ==========================================
// src/pages/JobsPage.jsx
// ==========================================
// AI-powered job and internship recommendations
// Clean, minimal interface consistent with design system

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  RefreshCw,
  Sparkles,
  BookmarkPlus,
  BookmarkCheck,
  Search
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SkillBadge from "../components/SkillBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import toast from "react-hot-toast";

const JobCard = ({ job, onSave, saved }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card-clean card-clean-hover rounded-2xl p-5 border border-white/[0.08] bg-[#131316] flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.08] capitalize">
                {job.type || "Full-time"}
              </span>
              {job.matchScore && (
                <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {job.matchScore}% Match
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white tracking-tight">{job.role}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{job.company}</p>
          </div>
          <button
            type="button"
            onClick={() => onSave(job)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              saved
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-zinc-500 hover:text-white hover:bg-white/[0.06]"
            }`}
            title={saved ? "Saved" : "Save job"}
          >
            {saved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
          </button>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 mb-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || "Remote"}</span>
          {job.salary && <span className="flex items-center gap-1"><DollarSign size={12} /> {job.salary}</span>}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 mb-4 leading-relaxed line-clamp-2">{job.description}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {job.requiredSkills?.slice(0, 4).map((s, i) => (
            <SkillBadge key={i} skill={s} />
          ))}
        </div>
      </div>

      {/* Apply button */}
      <a
        href={job.applyUrl || "#"}
        target="_blank"
        rel="noreferrer"
        className="btn-secondary text-xs !py-2 w-full flex items-center justify-center gap-1.5"
      >
        Apply Now <ExternalLink size={12} />
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
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [resumesRes, savedRes] = await Promise.all([
          api.get("/resumes"),
          api.get("/jobs/saved"),
        ]);
        const rList = resumesRes.data.resumes || [];
        setResumes(rList);
        if (rList.length > 0) setSelectedResumeId(rList[0]._id);
        setSavedJobIds(new Set(savedRes.data.jobs?.map((j) => `${j.company}-${j.role}`) || []));
      } catch (err) {
        console.error("Init error", err);
      } finally {
        setInitialLoad(false);
      }
    };
    init();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resume = resumes.find((r) => r._id === selectedResumeId);
      const skills = resume?.skills?.map((s) => (typeof s === "string" ? s : s.name)) || [];
      const experienceLevel = resume?.experience?.length > 0 ? "junior" : "fresher";

      const res = await api.post("/ai/suggest-jobs", { skills, experienceLevel, targetRole });
      setJobs(res.data.jobs || []);
      toast.success(`Found ${res.data.jobs?.length || 0} job matches! 🎯`);
    } catch {
      toast.error("Failed to fetch jobs. Please verify API configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (job) => {
    const key = `${job.company}-${job.role}`;
    try {
      if (savedJobIds.has(key)) {
        toast("Already saved", { icon: "📌" });
        return;
      }
      await api.post("/jobs/saved", job);
      setSavedJobIds((prev) => new Set([...prev, key]));
      toast.success("Job saved! 📌");
    } catch {
      toast.error("Failed to save job");
    }
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter((j) => j.type?.toLowerCase() === filter);

  if (initialLoad) {
    return (
      <DashboardLayout title="Jobs & Internships">
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Jobs & Recommendations">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Job & Internship Recommendations
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Discover roles tailored to your confirmed skillset and target positions.
          </p>
        </div>

        {/* Search controls */}
        <div className="card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Active Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full input-clean text-xs bg-[#0E0E11]"
              >
                <option value="">-- Choose a resume --</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-5">
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">Target Role</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Engineer, Full Stack Developer"
                className="w-full input-clean text-xs bg-[#0E0E11]"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="button"
                onClick={fetchJobs}
                disabled={loading}
                id="find-jobs-btn"
                className="w-full btn-primary text-xs !py-2.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin mr-1.5" /> Finding...
                  </>
                ) : (
                  <>
                    <Search size={13} className="mr-1.5" /> Find Matching Jobs
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        {jobs.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#131316] border border-white/[0.08] w-fit">
            {["all", "job", "internship"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {f} ({f === "all" ? jobs.length : jobs.filter((j) => j.type?.toLowerCase() === f).length})
              </button>
            ))}
          </div>
        )}

        {/* Jobs grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LoadingSpinner size={32} />
            <p className="text-xs text-zinc-400 mt-4 animate-pulse">Evaluating matches against job descriptions...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="card-clean rounded-2xl p-12 border border-dashed border-white/10 text-center space-y-3">
            <Briefcase size={24} className="text-blue-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Find Target Opportunities</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Select your resume and click "Find Matching Jobs" to generate compatibility scores.
            </p>
          </div>
        ) : null}

      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
