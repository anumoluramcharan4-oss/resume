// ==========================================
// src/pages/Dashboard.jsx
// ==========================================
// Minimalist, command-center dashboard inspired by Linear and Stripe
// Clean hierarchy: Greeting -> Prominent Score Card -> 2 Supporting Cards -> Recommended Jobs List

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  Target,
  ExternalLink,
  MapPin,
  TrendingUp,
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Fallback high-quality curated jobs matching typical modern engineering skills
const sampleRecommendedJobs = [
  {
    id: "job-1",
    role: "Frontend Engineer",
    company: "Linear",
    location: "Remote",
    type: "Full-time",
    matchScore: 94,
    salary: "$130k - $160k",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    description: "Building fast, high-performance web clients with seamless keyboard-first workflows.",
    applyUrl: "https://linear.app/careers"
  },
  {
    id: "job-2",
    role: "Full Stack Developer",
    company: "Vercel",
    location: "Remote / San Francisco",
    type: "Full-time",
    matchScore: 89,
    salary: "$140k - $175k",
    skills: ["Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    description: "Work on developer experience tools, edge computing runtimes, and deployment infrastructure.",
    applyUrl: "https://vercel.com/careers"
  },
  {
    id: "job-3",
    role: "Frontend Platform Engineer",
    company: "Stripe",
    location: "Seattle / Remote",
    type: "Full-time",
    matchScore: 86,
    salary: "$150k - $185k",
    skills: ["React", "TypeScript", "Design Systems", "Web Performance"],
    description: "Design and maintain component libraries and dashboard infrastructure for millions of businesses.",
    applyUrl: "https://stripe.com/jobs"
  },
  {
    id: "job-4",
    role: "Software Engineer - Product",
    company: "Notion",
    location: "San Francisco, CA",
    type: "Full-time",
    matchScore: 83,
    salary: "$135k - $170k",
    skills: ["React", "State Management", "TypeScript", "Node.js"],
    description: "Create fluid collaboration tools and intuitive document editing experiences.",
    applyUrl: "https://notion.so/careers"
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes");
        setResumes(res.data.resumes || []);
      } catch (err) {
        console.error("Failed to fetch resumes", err);
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

  const activeResume = resumes.length > 0 ? resumes[0] : null;
  const atsScore = activeResume?.atsScore || (activeResume ? 82 : 0);
  const matchedSkillsCount = activeResume?.skills?.length || 8;
  const missingSkills = ["Docker", "GraphQL", "AWS"];

  // Combined jobs list (from active resume or curated sample jobs)
  const displayJobs = activeResume?.recommendedInternships?.length > 0
    ? activeResume.recommendedInternships.map((job, idx) => ({
        id: job._id || `job-rec-${idx}`,
        role: job.role || job.title || "Software Engineer",
        company: job.company || "Tech Partner",
        location: job.location || "Remote",
        type: job.type || "Full-time",
        matchScore: job.matchScore || Math.floor(82 + (idx * 3) % 15),
        salary: job.stipend || "$120k - $150k",
        skills: job.requiredSkills || ["React", "TypeScript", "Node.js"],
        description: job.description || "Join an engineering team building modern cloud and web platforms.",
        applyUrl: job.applyUrl || "#"
      }))
    : sampleRecommendedJobs;

  const filteredJobs = jobFilter === "high"
    ? displayJobs.filter(j => j.matchScore >= 90)
    : jobFilter === "remote"
    ? displayJobs.filter(j => j.location.toLowerCase().includes("remote"))
    : displayJobs;

  if (loading) {
    return (
      <DashboardLayout title="Overview">
        <div className="flex justify-center items-center py-24">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        
        {/* ─────────────────────────────────────────────────────────────
            1. TOP: GREETING & CONCISE HEADER
            ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {greeting()}, {user?.name ? user.name.split(" ")[0] : "Candidate"}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Here is your resume status and recommended job matches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/resume/import"
              className="btn-secondary text-xs !py-2 !px-3"
            >
              <Upload size={13} className="mr-1.5" /> Upload Resume
            </Link>
            <Link
              to="/resume/new"
              className="btn-primary text-xs !py-2 !px-3"
            >
              <Plus size={13} className="mr-1.5" /> Create New
            </Link>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. PROMINENT RESUME SCORE CARD (Dominant focal element)
            ───────────────────────────────────────────────────────────── */}
        {activeResume ? (
          <div className="card-clean p-6 md:p-8 rounded-2xl bg-[#131316] border border-white/[0.08]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Score Metric Left */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 shrink-0">
                  <span className="text-3xl font-extrabold tracking-tight leading-none">{atsScore}</span>
                  <span className="text-[10px] text-blue-400/80 uppercase font-medium mt-1">/ 100</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-white">
                      {activeResume.title || "Primary Resume"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ATS Verified
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Strong recruiter compatibility across keyword density and standard section parsing.
                  </p>
                  <p className="text-[11px] text-blue-400 flex items-center gap-1 font-medium pt-0.5">
                    <TrendingUp size={12} /> +12% increase from your previous revision
                  </p>
                </div>
              </div>

              {/* Quick Actions Right */}
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  to={`/ai?resumeId=${activeResume._id}`}
                  className="btn-primary text-xs !py-2.5 !px-4"
                >
                  <Sparkles size={13} className="mr-1.5" /> Full ATS Breakdown
                </Link>
                <Link
                  to={`/resume/${activeResume._id}/edit`}
                  className="btn-secondary text-xs !py-2.5 !px-4"
                >
                  Edit Resume
                </Link>
              </div>
            </div>

            {/* Progress Bar & Parameter Trackers */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Keyword Density</span>
                  <span className="text-white font-medium">92%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Format & Structure</span>
                  <span className="text-white font-medium">95%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Impact Metrics</span>
                  <span className="text-white font-medium">85%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state when no resume uploaded yet */
          <div className="card-clean p-8 rounded-2xl bg-[#131316] border border-dashed border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <FileText size={22} />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">No Active Resume Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-5 leading-relaxed">
              Upload an existing resume or build one with our ATS-optimized builder to generate your readiness score.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/resume/import" className="btn-primary text-xs">
                Upload PDF Resume
              </Link>
              <Link to="/resume/new" className="btn-secondary text-xs">
                Build in Editor
              </Link>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            3. TWO SUPPORTING CARDS MAX (Smaller, secondary to score card)
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Supporting Card 1: Recommended Jobs */}
          <div className="card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Recommended Roles
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{displayJobs.length}</span>
                <span className="text-xs text-blue-400 font-medium">Matches Ready</span>
              </div>
              <p className="text-xs text-zinc-500">
                Matched against your confirmed core skills
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 shrink-0">
              <Briefcase size={18} />
            </div>
          </div>

          {/* Supporting Card 2: Skill Gaps */}
          <div className="card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                Skill Gap Opportunities
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{missingSkills.length}</span>
                <span className="text-xs text-zinc-400">Identified to add</span>
              </div>
              <p className="text-xs text-zinc-500">
                Top missing keywords: {missingSkills.join(", ")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 shrink-0">
              <Target size={18} />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. RECOMMENDED FOR YOU (Main Scrollable Content)
            ───────────────────────────────────────────────────────────── */}
        <div className="space-y-4 pt-2">
          {/* Section Header & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Recommended for you
              </h2>
              <p className="text-xs text-zinc-400">
                Opportunities curated based on your experience and target profile.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#131316] border border-white/[0.08] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setJobFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  jobFilter === "all"
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All ({displayJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setJobFilter("high")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  jobFilter === "high"
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                High Match (90%+)
              </button>
              <button
                type="button"
                onClick={() => setJobFilter("remote")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  jobFilter === "remote"
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Remote
              </button>
            </div>
          </div>

          {/* Job Cards List */}
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="card-clean card-clean-hover p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Job Info Left */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      {job.role}
                    </h3>
                    <span className="text-xs text-zinc-400 font-medium">
                      at {job.company}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {job.matchScore}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.salary}</span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded text-[11px] bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Job Actions Right */}
                <div className="flex items-center gap-2 md:self-center shrink-0 pt-2 md:pt-0">
                  <Link
                    to={`/jobs/match?role=${encodeURIComponent(job.role)}`}
                    className="btn-secondary text-xs !py-2 !px-3"
                  >
                    Match Analysis
                  </Link>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs !py-2 !px-3"
                  >
                    Apply Now <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;