// ==========================================
// src/pages/JobMatchPage.jsx
// ==========================================
// Resume vs Job Match Score Analyzer
// Analyzes how well a selected resume matches a job description

import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Briefcase, Sparkles, CheckCircle, XCircle, AlertCircle, RefreshCw, ChevronRight, Zap, Target } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import toast from "react-hot-toast";

// Animated Circular Progress Bar Component
const CircularProgress = ({ value, label }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = "#ef4444"; // Red for low
  if (value >= 50) color = "#eab308"; // Yellow for medium
  if (value >= 75) color = "#22c55e"; // Green for high

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle
            className="text-muted/15 dark:text-white/10"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="drop-shadow-md"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-main">
            {Math.round(value)}<span className="text-xl text-muted">%</span>
          </span>
        </div>
      </div>
      <p className="mt-4 font-semibold text-main">{label}</p>
    </div>
  );
};

const JobMatchPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState(null);

  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Fetch user resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resumes");
        setResumes(res.data.resumes);
        
        // Check if resumeId is passed in search query or router state
        const paramId = searchParams.get("resumeId") || location.state?.resumeId;
        if (paramId && res.data.resumes.some((r) => r._id === paramId)) {
          setSelectedResumeId(paramId);
        } else if (res.data.resumes.length > 0) {
          setSelectedResumeId(res.data.resumes[0]._id);
        }
      } catch (err) {
        toast.error("Failed to fetch resumes");
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
      toast.success("Analysis complete!");
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
      toast.success("Resume optimized for this job!");
    } catch (err) {
      toast.error("Failed to optimize resume");
    } finally {
      setIsOptimizing(false);
    }
  };

  const selectedResume = resumes.find((r) => r._id === selectedResumeId);

  return (
    <DashboardLayout title="Job Match Analyzer">
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto w-full">
        
        {/* Left Column: Input & Resume Preview */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[1.5rem] p-6 lg:p-8"
          >
            <h2 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
              <FileText className="text-[var(--color-brand-500)]" /> Select Resume
            </h2>
            
            {resumes.length === 0 ? (
              <p className="text-muted text-sm">You don't have any resumes yet. Create one first.</p>
            ) : (
              <div className="space-y-4">
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full p-3 rounded-xl input-dark text-sm appearance-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title || "Untitled"} ({new Date(r.updatedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>

                {selectedResume && (
                  <div className="p-4 rounded-xl bg-surface-hover border border-subtle space-y-3">
                    <h3 className="font-semibold text-main">
                      {selectedResume.personal?.fullName || selectedResume.personalInfo?.fullName || "No Name"}
                    </h3>
                    <p className="text-xs text-muted line-clamp-2">{selectedResume.summary || "No summary provided."}</p>
                    
                    <div>
                      <span className="text-xs font-semibold text-muted mb-1 block">Top Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedResume.skills?.slice(0, 5).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-accent/10 text-accent border border-accent/20 font-medium">
                            {typeof skill === "string" ? skill : skill.name}
                          </span>
                        ))}
                        {selectedResume.skills?.length > 5 && (
                          <span className="text-[10px] text-muted">+{selectedResume.skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-[1.5rem] p-6 lg:p-8 flex-1 flex flex-col"
          >
            <h2 className="text-xl font-bold text-main mb-4 flex items-center gap-2">
              <Briefcase className="text-[var(--color-brand-500)]" /> Job Description
            </h2>
            <p className="text-sm text-muted mb-4">Paste the description of the job you want to apply for.</p>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job requirements, responsibilities, etc..."
              className="w-full flex-1 min-h-[250px] p-4 rounded-xl input-dark text-sm resize-none mb-6"
            />
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedResumeId || !jobDescription.trim()}
              className="w-full py-4 rounded-xl btn-primary font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <><RefreshCw className="animate-spin" size={18} /> Analyzing Match...</>
              ) : (
                <><Sparkles size={18} /> Analyze Job Match</>
              )}
            </button>
          </motion.div>
        </div>

        {/* Right Column: Analysis Results */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <AnimatePresence mode="wait">
            {!results && !isAnalyzing && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 glass rounded-[1.5rem] flex flex-col items-center justify-center p-12 text-center min-h-[500px]"
              >
                <div className="w-20 h-20 bg-[var(--color-brand-500)]/10 rounded-full flex items-center justify-center mb-6">
                  <Zap size={32} className="text-[var(--color-brand-500)]" />
                </div>
                <h3 className="text-2xl font-bold text-main mb-2">Ready to Match?</h3>
                <p className="text-muted max-w-md">
                  Select a resume and paste a job description. Our AI will analyze your fit and suggest improvements to boost your chances.
                </p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 glass rounded-[1.5rem] flex flex-col items-center justify-center min-h-[500px]"
              >
                <LoadingSpinner size={48} />
                <p className="mt-6 text-main font-medium animate-pulse">Running ATS simulation...</p>
              </motion.div>
            )}

            {results && !isAnalyzing && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Header */}
                <div className="glass rounded-[1.5rem] p-8 flex flex-col md:flex-row items-center gap-8 border-t-4 border-t-[var(--color-brand-500)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-500)]/10 blur-3xl rounded-full" />
                  
                  <CircularProgress value={results.matchPercentage || 0} label="Match Score" />
                  
                  <div className="flex-1 text-center md:text-left z-10">
                    <h3 className="text-2xl font-bold text-main mb-2">Analysis Complete</h3>
                    <p className="text-muted mb-4">{results.verdict}</p>
                    
                    <button
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2 mx-auto md:mx-0 disabled:opacity-50"
                    >
                      {isOptimizing ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      {isOptimizing ? "Optimizing Resume..." : "Optimize Resume for This Job"}
                    </button>
                  </div>
                </div>

                {/* Optimized Data (if generated) */}
                {optimizedData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="glass rounded-[1.5rem] p-6 lg:p-8 border border-purple-500/30 bg-purple-500/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                    <h3 className="text-xl font-bold text-main mb-6 flex items-center gap-2">
                      <Sparkles className="text-purple-500 dark:text-purple-400" /> Optimized Content Generated!
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-muted mb-2 uppercase tracking-wider">New Summary</h4>
                        <div className="p-4 rounded-xl bg-surface-hover border border-subtle text-sm">
                          {optimizedData.optimizedSummary}
                        </div>
                      </div>

                      {optimizedData.optimizedProjects?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Optimized Projects</h4>
                          <div className="space-y-3">
                            {optimizedData.optimizedProjects.map((p, i) => (
                              <div key={i} className="p-4 rounded-xl bg-surface-hover border border-subtle text-sm">
                                <span className="font-semibold text-purple-600 dark:text-purple-400 block mb-1">{p.originalTitle}</span>
                                {p.optimizedDescription}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {optimizedData.addedKeywords?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-muted mb-2 uppercase tracking-wider">Keywords Added</h4>
                          <div className="flex flex-wrap gap-2">
                            {optimizedData.addedKeywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Missing Skills */}
                  <div className="glass rounded-[1.5rem] p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
                      <XCircle className="text-red-500" /> Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills?.length > 0 ? results.missingSkills.map((skillObj, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col">
                          <span className="text-red-400 text-sm font-medium">{skillObj.skill}</span>
                          <span className="text-[10px] text-red-500/70 uppercase">{skillObj.importance} priority</span>
                        </div>
                      )) : (
                        <p className="text-sm text-muted">You have all the required skills!</p>
                      )}
                    </div>
                  </div>

                  {/* Strong Skills */}
                  <div className="glass rounded-[1.5rem] p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
                      <CheckCircle className="text-green-500" /> Strong Matches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.strongSkills?.length > 0 ? results.strongSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium">
                          {skill}
                        </span>
                      )) : (
                        <p className="text-sm text-muted">No major overlapping skills found.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ATS Tips */}
                  <div className="glass rounded-[1.5rem] p-6 border-l-2 border-l-blue-500">
                    <h3 className="text-md font-bold text-main mb-3 flex items-center gap-2">
                      <AlertCircle className="text-blue-500" size={18} /> ATS Optimization
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      {results.atsTips?.map((tip, i) => (
                        <li key={i} className="flex gap-2">
                          <ChevronRight size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Tips */}
                  <div className="glass rounded-[1.5rem] p-6 border-l-2 border-l-purple-500">
                    <h3 className="text-md font-bold text-main mb-3 flex items-center gap-2">
                      <Target className="text-purple-500" size={18} /> Career Growth
                    </h3>
                    <ul className="space-y-2 text-sm text-muted">
                      {results.careerImprovementTips?.map((tip, i) => (
                        <li key={i} className="flex gap-2">
                          <ChevronRight size={14} className="text-purple-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Project Suggestions */}
                {results.suggestedProjects?.length > 0 && (
                  <div className="glass rounded-[1.5rem] p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-main mb-6">Suggested Projects to Build</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {results.suggestedProjects.map((proj, i) => (
                        <div key={i} className="p-4 rounded-xl bg-surface-hover border border-subtle hover:border-focus transition-colors">
                          <h4 className="font-semibold text-main mb-1">{proj.title}</h4>
                          <p className="text-sm text-muted">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobMatchPage;
