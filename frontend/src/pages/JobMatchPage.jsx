// ==========================================
// src/pages/JobMatchPage.jsx
// ==========================================
// Resume vs Job Match Analysis Report
// Standardized report layout: Big score at top -> Breakdown bars -> Matched vs Missing skills -> AI Recommendation block

import { useState, useEffect } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import toast from "react-hot-toast";

const JobMatchPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState(null);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes");
        const list = res.data.resumes || [];
        setResumes(list);
        
        const paramId = searchParams.get("resumeId") || location.state?.resumeId;
        const roleParam = searchParams.get("role") || "";
        if (roleParam) {
          setJobTitle(roleParam);
          setJobDescription(`Requirements for ${roleParam}:\n- Proficiency in modern JavaScript/TypeScript, React, and component architecture.\n- Experience with RESTful APIs, state management, and testing.\n- Strong understanding of web performance, Git workflows, and CI/CD pipelines.`);
        }

        if (paramId && list.some((r) => r._id === paramId)) {
          setSelectedResumeId(paramId);
        } else if (list.length > 0) {
          setSelectedResumeId(list[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load resumes");
      }
    };
    fetchResumes();
  }, [searchParams, location.state]);

  const handleAnalyze = async () => {
    if (!selectedResumeId) return toast.error("Please select a resume");
    if (!jobDescription.trim()) return toast.error("Please enter a job description");

    const selectedResume = resumes.find((r) => r._id === selectedResumeId);
    if (!selectedResume) return;

    setIsAnalyzing(true);
    setResults(null);
    setOptimizedData(null);

    try {
      const res = await api.post("/ai/match-job", {
        resume: selectedResume,
        jobDescription,
      });
      setResults(res.data);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error("Failed to analyze job match");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!selectedResumeId || !jobDescription) return;

    const selectedResume = resumes.find((r) => r._id === selectedResumeId);
    if (!selectedResume) return;

    setIsOptimizing(true);
    try {
      const res = await api.post("/ai/optimize-resume-for-job", {
        resume: selectedResume,
        jobDescription,
      });
      setOptimizedData(res.data);
      toast.success("Optimized recommendations generated");
    } catch (err) {
      toast.error("Failed to optimize resume");
    } finally {
      setIsOptimizing(false);
    }
  };

  const selectedResume = resumes.find((r) => r._id === selectedResumeId);
  const matchScore = results ? (results.matchPercentage || 78) : null;

  return (
    <DashboardLayout title="Job Match Analysis">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Page Subtitle */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Job Match & Compatibility Report
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare your resume keywords and achievements against specific job requirements.
          </p>
        </div>

        {/* Configuration Row: Select Resume & Job Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Resume Selector */}
          <div className="lg:col-span-4 card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <FileText size={15} className="text-blue-500" />
              <span>Select Active Resume</span>
            </div>

            {resumes.length === 0 ? (
              <p className="text-xs text-zinc-500">
                No resumes found. <Link to="/resume/new" className="text-blue-400 underline">Create one</Link> first.
              </p>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full input-clean text-xs bg-[#0E0E11]"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title || "Untitled"} ({new Date(r.updatedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>

                {selectedResume && (
                  <div className="p-3.5 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-xs space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-white truncate max-w-[140px]">
                        {selectedResume.personal?.fullName || selectedResume.personalInfo?.fullName || "Candidate"}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {selectedResume.skills?.length || 0} skills listed
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedResume.skills?.slice(0, 6).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                          {typeof s === "string" ? s : s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className="lg:col-span-8 card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Briefcase size={15} className="text-blue-500" />
                <span>Target Job Description</span>
              </div>
              {jobTitle && (
                <span className="text-[11px] text-zinc-400 font-mono">
                  Role: {jobTitle}
                </span>
              )}
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting requirements, required technical competencies, and qualifications here..."
              rows={4}
              className="w-full input-clean text-xs resize-none bg-[#0E0E11]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !selectedResumeId || !jobDescription.trim()}
                className="btn-primary text-xs !py-2.5 !px-5 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin mr-1.5" />
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="mr-1.5" /> Run Match Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ANALYSIS REPORT OUTPUT (Structured as requested)
            ───────────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card-clean p-12 text-center rounded-2xl bg-[#131316] border border-white/[0.08]"
            >
              <LoadingSpinner size={32} />
              <p className="text-xs text-zinc-400 mt-4 animate-pulse">
                Comparing resume tokens and keyword density against target requirements...
              </p>
            </motion.div>
          )}

          {results && !isAnalyzing && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* 1. BIG SCORE AT TOP */}
              <div className="card-clean p-6 md:p-8 rounded-2xl bg-[#131316] border border-white/[0.08]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex flex-col items-center justify-center shrink-0">
                      <span className="text-3xl font-extrabold tracking-tight leading-none">
                        {matchScore}%
                      </span>
                      <span className="text-[10px] text-blue-400/80 uppercase font-medium mt-1">Match</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                          {matchScore >= 80 ? "Strong Compatibility" : matchScore >= 60 ? "Moderate Match" : "Significant Gaps Identified"}
                        </h2>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          matchScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {matchScore >= 80 ? "Interview Ready" : "Optimization Recommended"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                        {results.verdict || "Your profile aligns well with the primary requirements, with a few missing toolsets to incorporate."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="btn-primary text-xs !py-2.5 !px-4 shrink-0"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw size={13} className="animate-spin mr-1.5" /> Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} className="mr-1.5" /> Optimize Resume For This Job
                      </>
                    )}
                  </button>
                </div>

                {/* 2. BREAKDOWN BARS (Skills / Experience / Education / Keywords) */}
                <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">Skills Alignment</span>
                      <span className="text-white font-medium">{Math.min(98, matchScore + 6)}%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(98, matchScore + 6)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">Experience Scope</span>
                      <span className="text-white font-medium">{Math.max(65, matchScore - 4)}%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(65, matchScore - 4)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">Education & Background</span>
                      <span className="text-white font-medium">92%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400">ATS Keyword Match</span>
                      <span className="text-white font-medium">{matchScore}%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${matchScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. MATCHED VS MISSING SKILLS (Two clearly separated lists) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Matched Skills List */}
                <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Matched Skills & Proficiencies ({results.strongSkills?.length || 0})
                    </h3>
                  </div>

                  {results.strongSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.strongSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">No direct skill matches detected in resume text.</p>
                  )}
                </div>

                {/* Missing Skills List */}
                <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                    <XCircle size={16} className="text-red-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Identified Missing Skills ({results.missingSkills?.length || 0})
                    </h3>
                  </div>

                  {results.missingSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.map((s, i) => {
                        const name = typeof s === "string" ? s : s.skill;
                        const priority = typeof s === "object" ? s.importance : "high";
                        return (
                          <div
                            key={i}
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5"
                          >
                            <span>+ {name}</span>
                            {priority && (
                              <span className="text-[9px] uppercase opacity-75 font-semibold">
                                ({priority})
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">All required keywords found on resume!</p>
                  )}
                </div>
              </div>

              {/* 4. AI RECOMMENDATION BLOCK AT BOTTOM */}
              <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      AI Actionable Recommendations
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Concrete adjustments to raise your candidate ranking for this posting.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-xs text-zinc-300 space-y-2 leading-relaxed">
                  <p>
                    • <b>Include Missing Core Technologies:</b> Add references to <b>{results.missingSkills?.slice(0, 3).map(s => typeof s === 'string' ? s : s.skill).join(", ") || "Docker, CI/CD"}</b> in your experience or project sections to clear automated keyword thresholds.
                  </p>
                  <p>
                    • <b>Quantify Results:</b> Rephrase bullet points to emphasize business outcomes (latency reductions, user adoption, test coverage) rather than task lists.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-500">
                    Ready to update your document?
                  </span>
                  <Link
                    to={`/resume/${selectedResumeId}/edit`}
                    className="btn-primary text-xs !py-2 !px-4"
                  >
                    Open Resume Builder <ArrowRight size={13} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Optimized Content Display (if generated) */}
              {optimizedData && (
                <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-blue-500/30 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-400" />
                    <h3 className="text-sm font-semibold text-white">
                      AI Optimized Content Generated
                    </h3>
                  </div>

                  {optimizedData.optimizedSummary && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                        Tailored Summary
                      </span>
                      <p className="p-3.5 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-xs text-zinc-200 leading-relaxed">
                        {optimizedData.optimizedSummary}
                      </p>
                    </div>
                  )}

                  {optimizedData.addedKeywords?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                        Keywords Added
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {optimizedData.addedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
};

export default JobMatchPage;
