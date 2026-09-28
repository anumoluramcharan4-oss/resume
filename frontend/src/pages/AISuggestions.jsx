// ==========================================
// src/pages/AISuggestions.jsx
// ==========================================
// AI-powered resume analysis & ATS diagnostic report

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  FileText
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import SkillBadge from "../components/SkillBadge";
import api from "../services/api";
import toast from "react-hot-toast";

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

  const selectedResume = resumes.find((r) => r._id === selectedResumeId) || null;
  const skills = selectedResume?.skills?.map((s) => (typeof s === "string" ? s : s.name)) || [];

  useEffect(() => {
    api.get("/resumes").then((res) => {
      const list = res.data.resumes || [];
      setResumes(list);
      if (!selectedResumeId && list.length > 0) {
        setSelectedResumeId(list[0]._id);
      }
    });
  }, []);

  const runAnalysis = async (type) => {
    if (!selectedResume && !skills.length) return toast.error("Select a resume first");
    setLoading((l) => ({ ...l, [type]: true }));
    try {
      let res;
      switch (type) {
        case "ats":
          res = await api.post("/ai/ats-score", { resume: selectedResume });
          setAtsResult(res.data);
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
          res = await api.post("/ai/suggest-projects", {
            skills,
            experienceLevel: selectedResume?.experience?.length > 0 ? "intermediate" : "beginner",
          });
          setProjectResult(res.data);
          break;
        case "weakness":
          res = await api.post("/ai/analyze-weakness", { resume: selectedResume });
          setWeaknessResult(res.data);
          break;
      }
      toast.success("Analysis updated");
    } catch {
      toast.error("Analysis failed. Please check network/key.");
    } finally {
      setLoading((l) => ({ ...l, [type]: false }));
    }
  };

  const tabs = [
    { id: "ats", label: "ATS Report", icon: Target },
    { id: "skills", label: "Skill Gaps", icon: Brain },
    { id: "projects", label: "Projects", icon: Zap },
    { id: "weakness", label: "Bullet Point Audit", icon: AlertTriangle },
  ];

  return (
    <DashboardLayout title="ATS Diagnostic">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Resume Audit & ATS Diagnostics
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Identify formatting compliance, keyword density, and phrasing improvements.
          </p>
        </div>

        {/* Configuration Row */}
        <div className="card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">
                Select Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full input-clean text-xs bg-[#0E0E11]"
              >
                <option value="">-- Choose a resume --</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title} ({new Date(r.updatedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1.5 block">
                Target Role (Optional benchmark)
              </label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
                className="w-full input-clean text-xs bg-[#0E0E11]"
              />
            </div>
          </div>

          {skills.length > 0 && (
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-zinc-500 mr-2">Extracted:</span>
              {skills.slice(0, 8).map((s, i) => (
                <SkillBadge key={i} skill={s} />
              ))}
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "text-blue-500" : "text-zinc-500"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {/* ─────────────────────────────────────────────────────────────
                ATS SCORE REPORT TAB
                ───────────────────────────────────────────────────────────── */}
            {activeTab === "ats" && (
              <div className="space-y-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => runAnalysis("ats")}
                    disabled={loading.ats || !selectedResumeId}
                    className="btn-primary text-xs !py-2.5 !px-4 disabled:opacity-50"
                  >
                    {loading.ats ? (
                      <>
                        <RefreshCw size={13} className="animate-spin mr-1.5" /> Evaluating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} className="mr-1.5" /> Run ATS Diagnostic
                      </>
                    )}
                  </button>
                </div>

                {atsResult ? (
                  <div className="space-y-5">
                    {/* Big Score Header */}
                    <div className="card-clean p-6 md:p-8 rounded-2xl bg-[#131316] border border-white/[0.08]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex flex-col items-center justify-center shrink-0">
                            <span className="text-3xl font-extrabold tracking-tight leading-none">
                              {atsResult.score}
                            </span>
                            <span className="text-[10px] text-blue-400/80 uppercase font-medium mt-1">/ 100</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white tracking-tight">
                                {atsResult.score >= 80 ? "High Compatibility Pass" : atsResult.score >= 60 ? "Moderate Recruiter Pass" : "Formatting & Keyword Gaps"}
                              </h3>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                                atsResult.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}>
                                {atsResult.score >= 80 ? "ATS Ready" : "Revisions Recommended"}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                              {atsResult.verdict || "Document formatting aligns with standard scanning algorithms."}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/resume/${selectedResumeId}/edit`}
                          className="btn-secondary text-xs !py-2.5 !px-4 shrink-0"
                        >
                          Edit in Builder
                        </Link>
                      </div>

                      {/* Breakdown Bars */}
                      {atsResult.sectionScores && (
                        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
                          {Object.entries(atsResult.sectionScores).map(([section, score]) => (
                            <div key={section}>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-zinc-400 capitalize">{section}</span>
                                <span className="text-white font-medium">{score}%</span>
                              </div>
                              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Matched Strengths vs Missing Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <h4 className="text-sm font-semibold text-white">Confirmed Strengths</h4>
                        </div>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          {atsResult.strengths?.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                          <AlertTriangle size={16} className="text-amber-400" />
                          <h4 className="text-sm font-semibold text-white">Actionable Improvements</h4>
                        </div>
                        <ul className="space-y-2 text-xs text-zinc-300">
                          {atsResult.improvements?.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-400 mt-0.5">→</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-clean p-10 rounded-2xl bg-[#131316] border border-dashed border-white/10 text-center space-y-3">
                    <Target size={24} className="text-blue-500 mx-auto" />
                    <h3 className="text-sm font-semibold text-white">Ready for ATS Evaluation</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Click the button above to run an end-to-end evaluation against ATS guidelines.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                SKILL GAPS TAB
                ───────────────────────────────────────────────────────────── */}
            {activeTab === "skills" && (
              <div className="space-y-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => runAnalysis("skills")}
                    disabled={loading.skills}
                    className="btn-primary text-xs !py-2.5 !px-4 disabled:opacity-50"
                  >
                    {loading.skills ? (
                      <>
                        <RefreshCw size={13} className="animate-spin mr-1.5" /> Scanning Gaps...
                      </>
                    ) : (
                      <>
                        <Brain size={13} className="mr-1.5" /> Analyze Skill Gaps
                      </>
                    )}
                  </button>
                </div>

                {skillResult && (
                  <div className="space-y-5">
                    <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                      <h3 className="text-sm font-semibold text-white">Identified Missing Skills</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {skillResult.missingSkills?.map((skill, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{skill.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                                {skill.priority} priority
                              </span>
                            </div>
                            <p className="text-zinc-400 leading-normal">{skill.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                PROJECTS TAB
                ───────────────────────────────────────────────────────────── */}
            {activeTab === "projects" && (
              <div className="space-y-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => runAnalysis("projects")}
                    disabled={loading.projects}
                    className="btn-primary text-xs !py-2.5 !px-4 disabled:opacity-50"
                  >
                    {loading.projects ? (
                      <>
                        <RefreshCw size={13} className="animate-spin mr-1.5" /> Curating...
                      </>
                    ) : (
                      <>
                        <Zap size={13} className="mr-1.5" /> Generate Project Concepts
                      </>
                    )}
                  </button>
                </div>

                {projectResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectResult.projects?.map((p, idx) => (
                      <div
                        key={idx}
                        className="card-clean p-5 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-2.5"
                      >
                        <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.techStack?.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────
                WEAKNESS / BULLET POINT AUDIT TAB
                ───────────────────────────────────────────────────────────── */}
            {activeTab === "weakness" && (
              <div className="space-y-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => runAnalysis("weakness")}
                    disabled={loading.weakness}
                    className="btn-primary text-xs !py-2.5 !px-4 disabled:opacity-50"
                  >
                    {loading.weakness ? (
                      <>
                        <RefreshCw size={13} className="animate-spin mr-1.5" /> Auditing...
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={13} className="mr-1.5" /> Audit Phrasing
                      </>
                    )}
                  </button>
                </div>

                {weaknessResult && (
                  <div className="card-clean p-6 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-4">
                    <h3 className="text-sm font-semibold text-white">Phrasing Diagnostic</h3>
                    <div className="space-y-3">
                      {weaknessResult.weaknesses?.map((w, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-xs space-y-1.5">
                          <p className="font-semibold text-amber-400">Issue: {w.issue}</p>
                          <p className="text-zinc-400"><b className="text-zinc-300">Original:</b> "{w.original}"</p>
                          <p className="text-emerald-400"><b className="text-zinc-300">Suggested:</b> "{w.suggested}"</p>
                        </div>
                      ))}
                    </div>
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
