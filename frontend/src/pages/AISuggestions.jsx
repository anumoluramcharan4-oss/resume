// ==========================================
// src/pages/AISuggestions.jsx
// ==========================================
// AI-powered resume analysis, ATS score, skill gaps, projects

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Target, Brain, Zap,
  AlertTriangle, CheckCircle, TrendingUp, BookOpen, RefreshCw
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import SkillBadge from "../components/SkillBadge";
import api from "../services/api";
import toast from "react-hot-toast";

// Animated ATS score ring
const ATSRing = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" className="stroke-[var(--color-border-subtle)]" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-main">{score}</span>
          <span className="text-xs text-muted">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-muted text-sm">ATS Score</p>
        <p className="text-main font-bold text-xl">
          {score >= 80 ? "Excellent 🟢" : score >= 60 ? "Good 🟡" : "Needs Work 🔴"}
        </p>
      </div>
    </div>
  );
};

const AISuggestions = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(resumeId || "");
  const [targetRole, setTargetRole] = useState("");

  const [atsResult, setAtsResult] = useState(null);
  const [skillResult, setSkillResult] = useState(null);
  const [projectResult, setProjectResult] = useState(null);
  const [weaknessResult, setWeaknessResult] = useState(null);

  const [loading, setLoading] = useState({ ats: false, skills: false, projects: false, weakness: false });
  const [activeTab, setActiveTab] = useState("ats");

  // Derive selected resume and skills
  const selectedResume = resumes.find(r => r._id === selectedResumeId) || null;
  const skills = selectedResume?.skills?.map(s => s.name) || [];

  // Load resumes on mount
  useEffect(() => {
    api.get("/resumes").then((res) => {
      setResumes(res.data.resumes);
    });
  }, []);

  const runAnalysis = async (type) => {
    if (!selectedResume && !skills.length) return toast.error("Select a resume first!");
    setLoading(l => ({ ...l, [type]: true }));
    try {
      let res;
      switch (type) {
        case "ats":
          res = await api.post("/ai/ats-score", { resume: selectedResume });
          setAtsResult(res.data);
          // Save ATS score to resume
          if (selectedResumeId) {
            await api.put(`/resumes/${selectedResumeId}`, {
              atsScore: res.data.score,
              aiAnalysis: res.data.verdict,
            });
          }
          break;
        case "skills":
          res = await api.post("/ai/suggest-skills", { currentSkills: skills, targetRole });
          setSkillResult(res.data);
          break;
        case "projects":
          res = await api.post("/ai/suggest-projects", { skills, experienceLevel: selectedResume?.experience?.length > 0 ? "intermediate" : "beginner" });
          setProjectResult(res.data);
          break;
        case "weakness":
          res = await api.post("/ai/analyze-weakness", { resume: selectedResume });
          setWeaknessResult(res.data);
          break;
      }
      toast.success("AI analysis complete! ✨");
    } catch {
      toast.error("AI analysis failed. Check your Gemini API key.");
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  };

  const tabs = [
    { id: "ats", label: "ATS Score", icon: Target },
    { id: "skills", label: "Skill Gaps", icon: Brain },
    { id: "projects", label: "Projects", icon: Zap },
    { id: "weakness", label: "Weakness", icon: AlertTriangle },
  ];

  return (
    <DashboardLayout title="AI Career Suggestions">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Resume selector */}
        <GlassCard className="border-subtle shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted font-medium mb-2 block">Select Resume to Analyze</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full input-dark rounded-xl py-2.5 px-4 text-sm"
              >
                <option value="">-- Choose a resume --</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted font-medium mb-2 block">Target Role (optional)</label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Frontend Developer, Data Scientist"
                className="w-full input-dark rounded-xl py-2.5 px-4 text-sm"
              />
            </div>
          </div>
          {skills.length > 0 && (
            <div className="mt-4 pt-4 border-t border-subtle flex flex-wrap gap-2">
              {skills.slice(0, 8).map((s, i) => (
                <SkillBadge key={i} skill={s} />
              ))}
            </div>
          )}
        </GlassCard>

        {/* Tab selector */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                activeTab === tab.id
                  ? "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border border-[var(--color-brand-500)]/30"
                  : "btn-secondary border-transparent"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* ---- ATS Score Tab ---- */}
            {activeTab === "ats" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => runAnalysis("ats")}
                    disabled={loading.ats || !selectedResumeId}
                    id="run-ats-btn"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-medium disabled:opacity-50"
                  >
                    {loading.ats ? <><RefreshCw size={14} className="animate-spin" /> Analyzing...</> : <><Sparkles size={14} /> Analyze Resume</>}
                  </button>
                </div>

                {atsResult && (
                  <div className="space-y-4">
                    <GlassCard className="border-subtle shadow-sm">
                      <ATSRing score={atsResult.score} />
                      <div className="mt-6 p-4 rounded-xl bg-[var(--color-brand-500)]/5 border border-[var(--color-brand-500)]/10">
                        <p className="text-muted text-sm">{atsResult.verdict}</p>
                      </div>
                    </GlassCard>

                    {/* Section scores */}
                    {atsResult.sectionScores && (
                      <GlassCard className="border-subtle shadow-sm">
                        <h3 className="text-main font-semibold mb-4">Section Scores</h3>
                        <div className="space-y-4">
                          {Object.entries(atsResult.sectionScores).map(([section, score]) => (
                            <div key={section}>
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-muted capitalize">{section}</span>
                                <span className="text-main font-medium">{score}%</span>
                              </div>
                              <div className="w-full bg-[var(--color-border-subtle)] rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                  className={`h-1.5 rounded-full ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <GlassCard className="border-subtle shadow-sm">
                        <h3 className="text-green-500 font-semibold mb-3 flex items-center gap-2"><CheckCircle size={16} /> Strengths</h3>
                        <ul className="space-y-2">
                          {atsResult.strengths?.map((s, i) => (
                            <li key={i} className="text-sm text-muted flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span> {s}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                      <GlassCard className="border-subtle shadow-sm">
                        <h3 className="text-red-500 font-semibold mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Improvements</h3>
                        <ul className="space-y-2">
                          {atsResult.improvements?.map((s, i) => (
                            <li key={i} className="text-sm text-muted flex items-start gap-2">
                              <span className="text-orange-500 mt-0.5">→</span> {s}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---- Skill Gaps Tab ---- */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => runAnalysis("skills")}
                    disabled={loading.skills}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-medium disabled:opacity-50"
                  >
                    {loading.skills ? <><RefreshCw size={14} className="animate-spin" /> Finding gaps...</> : <><Brain size={14} /> Analyze Skills</>}
                  </button>
                </div>
                {skillResult && (
                  <div className="space-y-4">
                    <GlassCard className="border-subtle shadow-sm">
                      <h3 className="text-main font-semibold mb-4">Missing Skills to Learn</h3>
                      <div className="space-y-3">
                        {skillResult.missingSkills?.map((skill, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-surface-hover)] border border-subtle">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${skill.priority === "high" ? "bg-red-500/10 text-red-500" : skill.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>
                              {skill.priority}
                            </span>
                            <div>
                              <p className="text-main font-medium text-sm">{skill.name}</p>
                              <p className="text-muted text-xs mt-0.5">{skill.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                    <GlassCard className="border-subtle shadow-sm">
                      <h3 className="text-main font-semibold mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[var(--color-brand-500)]" /> Trending Technologies</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {skillResult.trendingSkills?.map((skill, i) => (
                          <div key={i} className="p-3 rounded-xl glass border border-subtle">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-main font-medium text-sm">{skill.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${skill.trend === "hot" ? "bg-red-500/10 text-red-500" : "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)]"}`}>
                                {skill.trend}
                              </span>
                            </div>
                            <p className="text-muted text-xs">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                    <GlassCard className="border-subtle shadow-sm">
                      <h3 className="text-main font-semibold mb-4 flex items-center gap-2"><BookOpen size={16} className="text-purple-500" /> Recommended Certifications</h3>
                      <div className="space-y-2">
                        {skillResult.recommendedCertifications?.map((cert, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl glass border border-subtle">
                            <div>
                              <p className="text-main text-sm font-medium">{cert.name}</p>
                              <p className="text-muted text-xs mt-0.5">{cert.provider}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${cert.difficulty === "beginner" ? "border-green-500/20 text-green-500 bg-green-500/5" : cert.difficulty === "intermediate" ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5" : "border-red-500/20 text-red-500 bg-red-500/5"}`}>
                              {cert.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                )}
              </div>
            )}

            {/* ---- Project Suggestions Tab ---- */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => runAnalysis("projects")}
                    disabled={loading.projects}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-medium disabled:opacity-50"
                  >
                    {loading.projects ? <><RefreshCw size={14} className="animate-spin" /> Generating...</> : <><Zap size={14} /> Get Project Ideas</>}
                  </button>
                </div>
                {projectResult && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {projectResult.projects?.map((proj, i) => (
                      <GlassCard key={i} className="border-subtle hover:border-focus transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-main font-semibold">{proj.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                            proj.difficulty === "beginner" ? "border-green-500/20 text-green-500 bg-green-500/5" :
                            proj.difficulty === "intermediate" ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5" :
                            "border-red-500/20 text-red-500 bg-red-500/5"
                          }`}>
                            {proj.difficulty}
                          </span>
                        </div>
                        <p className="text-muted text-sm mb-4">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {proj.technologies?.map((t, ti) => (
                            <SkillBadge key={ti} skill={t} color="cyan" />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted mt-auto pt-2 border-t border-subtle">
                          <span>⏱ {proj.estimatedTime}</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ---- Weakness Analyzer Tab ---- */}
            {activeTab === "weakness" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => runAnalysis("weakness")}
                    disabled={loading.weakness || !selectedResumeId}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-medium disabled:opacity-50"
                  >
                    {loading.weakness ? <><RefreshCw size={14} className="animate-spin" /> Analyzing...</> : <><AlertTriangle size={14} /> Analyze Weaknesses</>}
                  </button>
                </div>
                {weaknessResult && (
                  <div className="space-y-4">
                    {/* Overall verdict */}
                    <GlassCard className="border-subtle shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border border-[var(--color-brand-500)]/20 capitalize">
                          {weaknessResult.overallLevel} level
                        </span>
                      </div>
                      <p className="text-muted text-sm">{weaknessResult.overallVerdict}</p>
                    </GlassCard>

                    {/* Weaknesses */}
                    <GlassCard className="border-subtle shadow-sm">
                      <h3 className="text-main font-semibold mb-4">Detected Weaknesses</h3>
                      <div className="space-y-3">
                        {weaknessResult.weaknesses?.map((w, i) => (
                          <div key={i} className={`p-4 rounded-xl border ${w.severity === "high" ? "border-red-500/20 bg-red-500/5" : w.severity === "medium" ? "border-yellow-500/20 bg-yellow-500/5" : "border-green-500/20 bg-green-500/5"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-main font-medium text-sm">{w.area}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${w.severity === "high" ? "text-red-500" : w.severity === "medium" ? "text-yellow-500" : "text-green-500"}`}>
                                {w.severity} priority
                              </span>
                            </div>
                            <p className="text-muted text-xs mb-2">{w.issue}</p>
                            <p className="text-muted text-xs">💡 {w.fix}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* Learning path */}
                    {weaknessResult.learningPath && (
                      <GlassCard className="border-subtle shadow-sm">
                        <h3 className="text-main font-semibold mb-4">📅 Your Learning Roadmap</h3>
                        <div className="space-y-3">
                          {Object.entries(weaknessResult.learningPath).map(([period, task]) => (
                            <div key={period} className="flex gap-3">
                              <div className="w-24 flex-shrink-0 text-xs text-[var(--color-brand-500)] font-medium pt-0.5 capitalize">{period.replace("_", " ")}</div>
                              <div className="flex-1 p-3 rounded-xl glass border border-subtle text-muted text-sm">{task}</div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    )}

                    {/* Encouragement */}
                    {weaknessResult.encouragement && (
                      <GlassCard className="border-[var(--color-brand-500)]/20 gradient-bg-subtle">
                        <p className="text-[var(--color-brand-500)] text-sm italic font-medium">✨ {weaknessResult.encouragement}</p>
                      </GlassCard>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default AISuggestions;
