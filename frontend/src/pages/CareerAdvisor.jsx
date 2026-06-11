// ==========================================
// src/pages/CareerAdvisor.jsx
// ==========================================
// A premium AI-powered dashboard offering career recommendations,
// skill gap analysis, learning roadmaps, projects, certifications,
// salary insights, and an interactive AI Coach chat interface.

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, Sparkles, Brain, Award, Briefcase, CheckCircle, TrendingUp, Send,
  AlertCircle, Calendar, ChevronRight, Clock, Target, DollarSign, MapPin,
  RotateCcw, MessageSquare, Loader2, X, Lock, BadgeCheck, Flame, BookOpen, Check
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const chatVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.5 } },
};

const CareerAdvisor = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [initStep, setInitStep] = useState(0);

  // Form states for setup wizard
  const [targetRole, setTargetRole] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [interestsList, setInterestsList] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [desiredSalary, setDesiredSalary] = useState("");
  const [workType, setWorkType] = useState("Remote");

  // Onboarding metadata from backend
  const [hasResume, setHasResume] = useState(false);
  const [resumeSkills, setResumeSkills] = useState([]);

  // Active recommendations & path detail
  const [selectedPath, setSelectedPath] = useState(null);
  const [activeTab, setActiveTab] = useState("roadmap"); // roadmap, skills, projects, certifications, trends

  // Chat window state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sendingChat, setSendingChat] = useState(false);
  const chatBottomRef = useRef(null);

  // Interactive toggles loading state
  const [togglingAction, setTogglingAction] = useState(null);

  // Status message rotation for Gemini generation
  const initSteps = [
    "Analyzing your current background & resume...",
    "Scanning industry-standard requirements...",
    "Identifying skill gaps and mapping solutions...",
    "Structuring custom phases for your learning roadmap...",
    "Curating certified projects and credentials...",
    "Synthesizing entry, mid, and senior salary ranges..."
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatOpen]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/advisor/profile");
      if (res.data.advisor) {
        setProfile(res.data.advisor);
        setChatHistory(res.data.advisor.chatHistory || []);
        if (res.data.advisor.recommendations?.length > 0) {
          setSelectedPath(res.data.advisor.recommendations[0]);
        }
      } else {
        // Prepare onboarding details
        setHasResume(res.data.hasResume);
        setResumeSkills(res.data.resumeSkills || []);
        setTargetRole(res.data.targetRole || "");
        setSkillsList(res.data.resumeSkills || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Career Advisor data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (newInterest.trim() && !interestsList.includes(newInterest.trim())) {
      setInterestsList([...interestsList, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterestsList(interestsList.filter((i) => i !== interest));
  };

  const handleInitialize = async () => {
    if (!targetRole.trim()) {
      toast.error("Please enter a Target Role to begin");
      return;
    }

    try {
      setInitializing(true);
      setInitStep(0);
      
      // Rotate status messages every 2.5 seconds
      const stepInterval = setInterval(() => {
        setInitStep((prev) => (prev < initSteps.length - 1 ? prev + 1 : prev));
      }, 2500);

      const res = await api.post("/advisor/initialize", {
        targetRole,
        preferences: {
          interests: interestsList,
          preferredLocation,
          desiredSalary,
          workType,
        },
        manualSkills: skillsList,
      });

      clearInterval(stepInterval);
      setProfile(res.data.advisor);
      setChatHistory(res.data.advisor.chatHistory || []);
      if (res.data.advisor.recommendations?.length > 0) {
        setSelectedPath(res.data.advisor.recommendations[0]);
      }
      toast.success("AI Career Advisor profile successfully generated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to initialize strategy. Please check your Gemini API key.");
    } finally {
      setInitializing(false);
    }
  };

  const handleToggleSkill = async (skillName) => {
    try {
      setTogglingAction(skillName);
      const res = await api.post("/advisor/toggle-skill", { skillName });
      setProfile(res.data.advisor);
      toast.success(`Updated status for ${skillName}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update skill status");
    } finally {
      setTogglingAction(null);
    }
  };

  const handleToggleProject = async (projectId, title) => {
    try {
      setTogglingAction(projectId);
      const res = await api.post("/advisor/toggle-project", { projectId });
      setProfile(res.data.advisor);
      toast.success(`Toggled project: ${title}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project status");
    } finally {
      setTogglingAction(null);
    }
  };

  const handleToggleCertification = async (certificationId, name) => {
    try {
      setTogglingAction(certificationId);
      const res = await api.post("/advisor/toggle-certification", { certificationId });
      setProfile(res.data.advisor);
      toast.success(`Toggled certification: ${name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update certification status");
    } finally {
      setTogglingAction(null);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || sendingChat) return;

    const userMsg = chatMessage.trim();
    setChatMessage("");
    setSendingChat(true);

    // Optimistically update chat window
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg, timestamp: new Date() }]);

    try {
      const res = await api.post("/advisor/chat", { message: userMsg });
      setChatHistory(res.data.chatHistory);
    } catch (err) {
      console.error(err);
      toast.error("AI Coach connection error");
    } finally {
      setSendingChat(false);
    }
  };

  const parseSalaryStr = (salaryStr) => {
    // Expected format: "$80,000 - $130,000" or similar
    // Clean and split to return entry, mid, senior numbers
    try {
      const nums = salaryStr.replace(/[\$,]/g, "").split("-").map(Number);
      if (nums.length >= 2) {
        const entry = Math.round(nums[0]);
        const senior = Math.round(nums[1]);
        const mid = Math.round((entry + senior) / 2);
        return { entry, mid, senior };
      }
    } catch {}
    return { entry: 60000, mid: 95000, senior: 135000 }; // Fallback defaults
  };

  if (loading) {
    return (
      <DashboardLayout title="Smart Career Advisor">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <LoadingSpinner />
          <p className="text-muted text-sm animate-pulse">Retrieving Advisor Details...</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- RENDERING ONBOARDING SETUP WIZARD ---
  if (!profile) {
    return (
      <DashboardLayout title="Setup Career Advisor">
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          {initializing ? (
            <div className="glass border border-subtle rounded-3xl p-12 text-center bg-card/40 min-h-[450px] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <Sparkles size={28} className="text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold text-main">Gemini AI is Designing Your Career Growth Strategy</h3>
                <p className="text-xs text-accent font-semibold">{initSteps[initStep]}</p>
                <p className="text-[11px] text-muted leading-relaxed">
                  We are formulating a comprehensive skills analysis, drafting phase-by-phase roadmaps, curating project models, and mapping certification values tailored specifically to you. This takes about 10-15 seconds.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Header Hero */}
              <div className="relative rounded-3xl border border-subtle overflow-hidden p-8 md:p-10 bg-gradient-to-tr from-surface via-card/50 to-surface">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={14} /> Premium Advisor Service
                    </span>
                    <h2 className="text-display-3 font-extrabold text-main tracking-tight leading-tight">
                      Empower Your Career With AI Mentorship
                    </h2>
                    <p className="text-muted text-sm max-w-xl">
                      Set up your goals to unlock personalized skill maps, targeted roadmaps, projects to build, and real-time guidance from Coach Gemini.
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-sm shrink-0">
                    <Compass size={36} />
                  </div>
                </div>
              </div>

              {/* Wizard Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <GlassCard className="p-6 space-y-6">
                    <h3 className="text-sm font-bold text-main uppercase tracking-widest flex items-center gap-2">
                      <Target size={16} className="text-accent" /> Define Your Target Goal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold text-muted uppercase">Target Job Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Full Stack Developer, AI Engineer"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="input-dark text-xs"
                        />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold text-muted uppercase">Preferred Work Type</label>
                        <select
                          value={workType}
                          onChange={(e) => setWorkType(e.target.value)}
                          className="input-dark text-xs bg-[#111111]"
                        >
                          <option value="Remote">Remote Only</option>
                          <option value="Hybrid">Hybrid Workspace</option>
                          <option value="On-site">On-site / Corporate</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold text-muted uppercase">Desired Location</label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="text"
                            placeholder="e.g. San Francisco, CA / Remote"
                            value={preferredLocation}
                            onChange={(e) => setPreferredLocation(e.target.value)}
                            className="input-dark pl-9 text-xs w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold text-muted uppercase">Target Salary Goal</label>
                        <div className="relative">
                          <DollarSign size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted" />
                          <input
                            type="text"
                            placeholder="e.g. $100,000 - $130,000"
                            value={desiredSalary}
                            onChange={(e) => setDesiredSalary(e.target.value)}
                            className="input-dark pl-9 text-xs w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skill inputs */}
                    <div className="space-y-4 pt-2 border-t border-subtle/50">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted uppercase">Add Your Current Skills</label>
                        <p className="text-[10px] text-muted">Input skills you already know to identify gaps correctly</p>
                      </div>
                      
                      <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a skill and press Enter (e.g. React, Python)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="input-dark text-xs flex-1"
                        />
                        <button type="submit" className="btn-secondary text-xs px-4 py-2">Add</button>
                      </form>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {skillsList.length === 0 ? (
                          <span className="text-[11px] text-muted italic">No skills listed yet. Add some above.</span>
                        ) : (
                          skillsList.map((skill, index) => (
                            <span
                              key={index}
                              className="text-[11px] font-semibold text-main bg-surface border border-subtle px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-red-500/30 hover:bg-red-500/5 group cursor-pointer transition-colors"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              {skill}
                              <X size={10} className="text-muted group-hover:text-red-500 transition-colors" />
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Interests inputs */}
                    <div className="space-y-4 pt-2 border-t border-subtle/50">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted uppercase">Your Tech Interests / Industries</label>
                        <p className="text-[10px] text-muted">For career recommendations matching your passions</p>
                      </div>
                      
                      <form onSubmit={handleAddInterest} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type interest and press Enter (e.g. AI, Fintech, Cloud, SaaS)"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          className="input-dark text-xs flex-1"
                        />
                        <button type="submit" className="btn-secondary text-xs px-4 py-2">Add</button>
                      </form>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {interestsList.length === 0 ? (
                          <span className="text-[11px] text-muted italic">No interests listed yet. Add some above.</span>
                        ) : (
                          interestsList.map((interest, index) => (
                            <span
                              key={index}
                              className="text-[11px] font-semibold text-accent bg-accent/5 border border-accent/15 px-2.5 py-1 rounded-full flex items-center gap-1.5 hover:border-red-500/30 hover:bg-red-500/5 group cursor-pointer transition-colors"
                              onClick={() => handleRemoveInterest(interest)}
                            >
                              {interest}
                              <X size={10} className="text-muted group-hover:text-red-500 transition-colors" />
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Right Hand Sidebar (Resume helper) */}
                <div className="space-y-6">
                  {hasResume ? (
                    <GlassCard className="p-6 border-accent/30 bg-accent/2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none" />
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                          <CheckCircle size={20} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-main uppercase tracking-wider">Resume Detected!</h4>
                          <p className="text-[11px] text-muted leading-relaxed">
                            We automatically retrieved <strong>{resumeSkills.length} skills</strong> and your background details from your latest resume to fill this wizard.
                          </p>
                        </div>
                        <div className="p-3 bg-surface/80 rounded-xl border border-subtle max-h-[160px] overflow-y-auto custom-scrollbar space-y-1">
                          <p className="text-[10px] font-bold text-muted uppercase">Detected Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {resumeSkills.map((s, i) => (
                              <span key={i} className="text-[9px] font-semibold text-main bg-card px-1.5 py-0.5 rounded border border-subtle">{s}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-muted italic">
                          Feel free to edit them on the left before initiating.
                        </p>
                      </div>
                    </GlassCard>
                  ) : (
                    <GlassCard className="p-6 border-dashed border-subtle">
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-subtle/10 border border-subtle flex items-center justify-center text-muted">
                          <AlertCircle size={20} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-main uppercase tracking-wider">No Resume Found</h4>
                          <p className="text-[11px] text-muted leading-relaxed">
                            We couldn't detect an active resume on your account. For the best AI recommendations, create a resume first, or input your skills manually.
                          </p>
                        </div>
                        <a href="/resume/new" className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-bold">
                          Create Resume Now <ChevronRight size={12} />
                        </a>
                      </div>
                    </GlassCard>
                  )}

                  <button
                    onClick={handleInitialize}
                    className="w-full btn-primary text-xs font-bold py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-accent/5 group"
                  >
                    Generate Career Strategy <Sparkles size={14} className="group-hover:animate-pulse" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // --- RENDERING MAIN DASHBOARD ---
  // Salary analytics data preparation
  const salaryData = profile.recommendations?.map((r) => {
    const prices = parseSalaryStr(r.salaryRange);
    return {
      name: r.careerPath.length > 18 ? r.careerPath.substring(0, 15) + "..." : r.careerPath,
      Entry: prices.entry,
      Mid: prices.mid,
      Senior: prices.senior,
    };
  }) || [];

  // Skill completion stats
  const totalRoadmapSkills = profile.learningRoadmap.reduce((acc, phase) => acc + (phase.skills?.length || 0), 0);
  const completedRoadmapSkills = profile.learningRoadmap.reduce((acc, phase) => acc + (phase.skills?.filter(s => s.completed)?.length || 0), 0);
  const totalProjects = profile.projects?.length || 0;
  const completedProjects = profile.projects?.filter(p => p.completed)?.length || 0;
  const totalCerts = profile.certifications?.length || 0;
  const completedCerts = profile.certifications?.filter(c => c.completed)?.length || 0;

  return (
    <DashboardLayout title="Smart Career Advisor">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-16 relative"
      >
        {/* 1. Header Progress Bar Hero */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-[1.75rem] border border-subtle overflow-hidden p-6 md:p-8 bg-gradient-to-tr from-surface via-card/50 to-surface"
        >
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            
            {/* User Strategy Summary */}
            <div className="lg:col-span-2 space-y-2">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full inline-block mb-1">
                Active Career Goal: {profile.targetRole}
              </span>
              <h2 className="text-2xl font-black text-main tracking-tight leading-tight">
                Your AI Career Coach Portal
              </h2>
              <p className="text-muted text-xs leading-relaxed max-w-md">
                Follow your phase-by-phase learning roadmap, build suggested resume-enhancing projects, complete certifications, and track score achievements.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    // Force onboarding state by resetting profile local state
                    if (window.confirm("Are you sure you want to regenerate your career strategy? This will overwrite your current progress.")) {
                      setProfile(null);
                    }
                  }}
                  className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 font-bold"
                >
                  <RotateCcw size={12} /> Reconfigure Goals
                </button>

                <button
                  onClick={() => setIsChatOpen(true)}
                  className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1.5 font-bold"
                >
                  <MessageSquare size={12} /> Chat with Coach
                </button>
              </div>
            </div>

            {/* Tracker Scores */}
            <div className="lg:col-span-2 grid grid-cols-3 gap-3">
              {[
                { label: "Resume Strength", value: profile.tracker.resumeStrength, color: "from-blue-500 to-indigo-500" },
                { label: "ATS Compatibility", value: profile.tracker.atsScore, color: "from-accent to-yellow-600" },
                { label: "Interview Ready", value: profile.tracker.interviewReadiness, color: "from-emerald-500 to-teal-500" }
              ].map((item, idx) => (
                <div key={idx} className="glass bg-surface/50 border border-subtle rounded-xl p-3.5 text-center flex flex-col justify-between h-[110px]">
                  <p className="text-[9px] font-bold text-muted uppercase tracking-wider leading-none">{item.label}</p>
                  
                  {/* Visual Progress Number */}
                  <div className="text-2xl font-black text-main py-1 leading-none">
                    {item.value || 0}%
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-subtle/30 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-full rounded-full`}
                      style={{ width: `${item.value || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 2. Path details and layout splits */}
        <div className="space-y-10">
          
          {/* TOP: Career Recommendation Match Cards */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-bold text-main uppercase tracking-widest flex items-center gap-2 px-1">
              <Compass size={14} className="text-accent" /> AI Career Path Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              
              {/* Quick Milestones stats card */}
              <GlassCard className="p-6 space-y-4 flex flex-col justify-between border-subtle">
                <div>
                  <h4 className="text-xs font-bold text-main uppercase tracking-wider border-b border-subtle/50 pb-2.5">
                    Strategy Tracker
                  </h4>
                  <div className="space-y-4 pt-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted flex items-center gap-1.5"><Brain size={12} /> Roadmap Progress</span>
                      <span className="font-extrabold text-main">{completedRoadmapSkills}/{totalRoadmapSkills} skills</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted flex items-center gap-1.5"><Briefcase size={12} /> Completed Projects</span>
                      <span className="font-extrabold text-main">{completedProjects}/{totalProjects} projects</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted flex items-center gap-1.5"><Award size={12} /> Credentials Earned</span>
                      <span className="font-extrabold text-main">{completedCerts}/{totalCerts} certs</span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-muted italic pt-3 border-t border-subtle/50">
                  Track your milestones to boost your career scores.
                </div>
              </GlassCard>

              {profile.recommendations?.map((path, idx) => {
                const isSelected = selectedPath?.careerPath === path.careerPath;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPath(path)}
                    className={`glass border p-6 rounded-[2rem] cursor-pointer transition-all duration-300 relative overflow-hidden group flex flex-col justify-between
                      ${isSelected ? "border-accent bg-accent/[0.03] shadow-lg shadow-accent/[0.02]" : "border-subtle hover:border-accent/40 hover:bg-surface-hover/20"}`}
                  >
                    {/* Glow tag for high matches */}
                    {path.matchPercentage >= 80 && (
                      <div className="absolute top-0 right-0 bg-accent/20 border-l border-b border-accent/20 text-accent font-extrabold text-[8px] tracking-widest px-2.5 py-1 rounded-bl-lg uppercase leading-none">
                        Best Fit
                      </div>
                    )}

                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-black text-main tracking-tight leading-snug group-hover:text-accent transition-colors max-w-[80%]">
                          {path.careerPath}
                        </h4>
                        <span className="text-xs font-black text-accent shrink-0">{path.matchPercentage}%</span>
                      </div>
                      
                      <p className="text-[10.5px] text-muted leading-relaxed line-clamp-2">
                        {path.whyItMatches}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] border-t border-subtle/50 pt-3.5 mt-4">
                      <div>
                        <p className="text-muted font-bold uppercase tracking-wider text-[8px]">Timeline</p>
                        <p className="text-main font-semibold mt-0.5 leading-snug">{path.learningTimeline}</p>
                      </div>
                      <div>
                        <p className="text-muted font-bold uppercase tracking-wider text-[8px]">Salary Goal</p>
                        <p className="text-main font-semibold mt-0.5 leading-snug">{path.salaryRange}</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-muted font-bold uppercase tracking-wider text-[8px]">Growth</p>
                        <p className="text-main font-semibold mt-0.5 leading-snug">{path.expectedGrowth}</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-muted font-bold uppercase tracking-wider text-[8px]">Difficulty</p>
                        <p className="text-main font-semibold mt-0.5 leading-snug">{path.difficultyLevel}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* BOTTOM: Selected Path's tabs (Roadmap, Gaps, Projects, Certifications, Salary insights) */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Tabs selector */}
            <div className="flex items-center gap-1 border-b border-subtle pb-px">
              {[
                { id: "roadmap", label: "Learning Roadmap", icon: Calendar },
                { id: "skills", label: "Skill Gap Analysis", icon: Brain },
                { id: "projects", label: "Suggested Projects", icon: Briefcase },
                { id: "certifications", label: "Certifications", icon: Award },
                { id: "salary", label: "Salary Insights", icon: DollarSign }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap
                      ${isActive
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-main hover:border-subtle"}`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[400px]">
              
              {/* 1. LEARNING ROADMAP TIMELINE */}
              {activeTab === "roadmap" && (
                <div className="space-y-6">
                  {profile.learningRoadmap?.map((phase, pIdx) => (
                    <GlassCard key={pIdx} className="p-5 space-y-4 border border-subtle relative">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-accent uppercase tracking-widest bg-accent/10 border border-accent/15 px-2 py-0.5 rounded-full">
                            Phase {pIdx + 1}
                          </span>
                          <h4 className="text-sm font-black text-main">{phase.phaseName}</h4>
                          <p className="text-[11px] text-muted">{phase.description}</p>
                        </div>
                        
                        {/* Completed count badge */}
                        <span className="text-[9px] font-bold text-muted bg-surface px-2 py-1 border border-subtle rounded-lg">
                          {phase.skills?.filter(s => s.completed).length} / {phase.skills?.length} Complete
                        </span>
                      </div>

                      {/* Skills inside this phase */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                        {phase.skills?.map((skill, sIdx) => {
                          const isToggling = togglingAction === skill.name;
                          return (
                            <div
                              key={sIdx}
                              onClick={() => !isToggling && handleToggleSkill(skill.name)}
                              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group
                                ${skill.completed
                                  ? "border-emerald-500/20 bg-emerald-500/3"
                                  : "border-subtle bg-surface/40 hover:border-focus/50 hover:bg-surface-hover/30"}`}
                            >
                              {/* Checkbox circle */}
                              <div
                                className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-0.5
                                  ${skill.completed
                                    ? "bg-emerald-500 border-emerald-500 text-black"
                                    : "border-subtle group-hover:border-accent text-transparent"}`}
                              >
                                {isToggling ? (
                                  <Loader2 size={10} className="animate-spin text-accent" />
                                ) : (
                                  <Check size={10} strokeWidth={4} />
                                )}
                              </div>

                              <div className="space-y-1 flex-1 min-w-0">
                                <p className={`text-xs font-bold leading-tight truncate ${skill.completed ? "text-muted line-through" : "text-main"}`}>
                                  {skill.name}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-muted">
                                  <span className="flex items-center gap-1"><Clock size={8} /> {skill.estimatedTime}</span>
                                  <span>•</span>
                                  <span className="capitalize">{skill.difficulty}</span>
                                </div>
                                
                                {/* Resource Links rendering */}
                                {skill.resources?.length > 0 && (
                                  <div className="pt-1.5 flex flex-wrap gap-1">
                                    {skill.resources.map((r, rIdx) => (
                                      <a
                                        key={rIdx}
                                        href={r.startsWith("http") ? r : `https://google.com/search?q=${encodeURIComponent(r)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()} // Stop toggle trigger
                                        className="text-[8px] font-bold text-accent hover:underline bg-accent/5 px-1.5 py-0.5 rounded border border-accent/15 flex items-center gap-0.5"
                                      >
                                        <BookOpen size={8} /> Resource
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}

              {/* 2. SKILL GAP ANALYSIS */}
              {activeTab === "skills" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column (Stats circle and list of current skills) */}
                  <div className="md:col-span-1 space-y-6">
                    <GlassCard className="p-5 text-center space-y-4">
                      <h4 className="text-xs font-bold text-main uppercase tracking-wider">Skill Gap Coverage</h4>
                      
                      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                        {/* Circular ring path */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="56" cy="56" r="46" stroke="var(--color-subtle)" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="56"
                            cy="56"
                            r="46"
                            stroke="var(--color-accent)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 46}
                            strokeDashoffset={2 * Math.PI * 46 * (1 - profile.skillAnalysis.completionPercentage / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-main leading-none">{profile.skillAnalysis.completionPercentage}%</span>
                          <span className="text-[8px] text-muted font-bold uppercase tracking-wider mt-0.5">Matching</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-muted leading-relaxed">
                        Your skills cover {profile.skillAnalysis.completionPercentage}% of the requirements for your target path.
                      </p>
                    </GlassCard>

                    {/* Current Skills list */}
                    <GlassCard className="p-5 space-y-3">
                      <h4 className="text-xs font-bold text-main uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-emerald-500" /> Current Skills ({profile.skillAnalysis.currentSkills?.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar">
                        {profile.skillAnalysis.currentSkills?.map((skill, index) => (
                          <span key={index} className="text-[9.5px] font-semibold text-main bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Right Column (Missing skills priority analysis) */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-xs font-bold text-main uppercase tracking-widest px-1">
                      Priority Missing Skills ({profile.skillAnalysis.missingSkills?.length})
                    </h4>
                    
                    <div className="space-y-3 max-h-[430px] overflow-y-auto custom-scrollbar pr-1">
                      {profile.skillAnalysis.missingSkills?.map((skill, index) => {
                        const isHigh = skill.priority === "high";
                        const isMed = skill.priority === "medium";
                        return (
                          <div key={index} className="glass border border-subtle rounded-xl p-4 flex gap-3.5 items-start">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border
                              ${isHigh ? "bg-red-500/10 border-red-500/20 text-red-500" : isMed ? "bg-accent/10 border-accent/20 text-accent" : "bg-blue-500/10 border-blue-500/20 text-blue-500"}`}
                            >
                              <AlertCircle size={16} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-main leading-none">{skill.name}</h5>
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded leading-none border
                                  ${isHigh ? "bg-red-500/10 border-red-500/20 text-red-500" : isMed ? "bg-accent/10 border-accent/20 text-accent" : "bg-blue-500/10 border-blue-500/20 text-blue-500"}`}
                                >
                                  {skill.priority} Priority
                                </span>
                              </div>
                              <p className="text-[10px] text-muted leading-relaxed">
                                {skill.reason}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SUGGESTED PROJECTS */}
              {activeTab === "projects" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.projects?.map((proj) => {
                    const isToggling = togglingAction === proj._id;
                    return (
                      <GlassCard
                        key={proj._id}
                        onClick={() => !isToggling && handleToggleProject(proj._id, proj.title)}
                        className={`p-5 flex flex-col justify-between cursor-pointer border hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group
                          ${proj.completed
                            ? "border-emerald-500/25 bg-emerald-500/3"
                            : "border-subtle bg-card/30 hover:border-focus/60"}`}
                      >
                        {/* Completion corner banner */}
                        {proj.completed && (
                          <div className="absolute top-0 right-0 bg-emerald-500 border-l border-b border-emerald-500 text-black font-extrabold text-[8px] tracking-widest px-2.5 py-0.5 rounded-bl-lg uppercase leading-none">
                            Completed
                          </div>
                        )}

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded">
                              {proj.difficulty}
                            </span>
                            <h4 className="text-xs font-black text-main leading-tight group-hover:text-accent transition-colors mt-1">
                              {proj.title}
                            </h4>
                          </div>

                          <p className="text-[10.5px] text-muted leading-relaxed">
                            {proj.description}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {proj.technologies?.map((tech, i) => (
                              <span key={i} className="text-[8.5px] font-semibold text-main bg-surface px-2 py-0.5 rounded border border-subtle">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Outcomes */}
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Learning Outcomes:</p>
                            <ul className="text-[9.5px] text-muted space-y-0.5 list-disc pl-3">
                              {proj.learningOutcome?.map((out, i) => (
                                <li key={i}>{out}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Resume Impact & Checkbox at bottom */}
                        <div className="border-t border-subtle/50 mt-5 pt-3.5 flex items-center justify-between">
                          <p className="text-[9px] text-accent italic font-semibold line-clamp-1 max-w-[80%]">
                            🚀 {proj.resumeImpact}
                          </p>
                          
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors
                              ${proj.completed
                                ? "bg-emerald-500 border-emerald-500 text-black"
                                : "border-subtle group-hover:border-accent text-transparent"}`}
                          >
                            {isToggling ? (
                              <Loader2 size={10} className="animate-spin text-accent" />
                            ) : (
                              <Check size={12} strokeWidth={4} />
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}

              {/* 4. RECOMMENDED CERTIFICATIONS */}
              {activeTab === "certifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications?.map((cert) => {
                    const isToggling = togglingAction === cert._id;
                    return (
                      <GlassCard
                        key={cert._id}
                        onClick={() => !isToggling && handleToggleCertification(cert._id, cert.name)}
                        className={`p-5 flex flex-col justify-between cursor-pointer border hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group
                          ${cert.completed
                            ? "border-emerald-500/25 bg-emerald-500/3"
                            : "border-subtle bg-card/30 hover:border-focus/60"}`}
                      >
                        {/* Completed corner banner */}
                        {cert.completed && (
                          <div className="absolute top-0 right-0 bg-emerald-500 border-l border-b border-emerald-500 text-black font-extrabold text-[8px] tracking-widest px-2.5 py-0.5 rounded-bl-lg uppercase leading-none">
                            Completed
                          </div>
                        )}

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded">
                              {cert.provider}
                            </span>
                            <h4 className="text-xs font-black text-main leading-tight group-hover:text-accent transition-colors mt-1">
                              {cert.name}
                            </h4>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[9.5px] bg-surface/50 border border-subtle/50 p-2.5 rounded-xl">
                            <div>
                              <p className="text-muted font-bold uppercase tracking-wider">Duration</p>
                              <p className="text-main font-semibold mt-0.5">{cert.duration}</p>
                            </div>
                            <div>
                              <p className="text-muted font-bold uppercase tracking-wider">Difficulty</p>
                              <p className="text-main font-semibold mt-0.5 capitalize">{cert.difficulty}</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Career Benefits:</p>
                            <p className="text-[10px] text-muted leading-relaxed">{cert.benefits}</p>
                          </div>
                        </div>

                        {/* Toggling box at bottom */}
                        <div className="border-t border-subtle/50 mt-5 pt-3.5 flex items-center justify-between">
                          <span className="text-[9.5px] text-muted italic flex items-center gap-1">
                            <Award size={10} className="text-accent" /> Validate industry skills
                          </span>
                          
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors
                              ${cert.completed
                                ? "bg-emerald-500 border-emerald-500 text-black"
                                : "border-subtle group-hover:border-accent text-transparent"}`}
                          >
                            {isToggling ? (
                              <Loader2 size={10} className="animate-spin text-accent" />
                            ) : (
                              <Check size={12} strokeWidth={4} />
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}

              {/* 5. SALARY INSIGHTS & CHARTS */}
              {activeTab === "salary" && (
                <div className="space-y-6">
                  <GlassCard className="p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-main uppercase tracking-wider">Salary Range Comparison</h4>
                      <p className="text-[10px] text-muted mt-0.5">Estimated Entry, Mid, and Senior salary bounds across recommended paths</p>
                    </div>

                    <div className="h-[250px] border border-subtle/50 rounded-xl p-3 bg-surface/30">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salaryData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={9} />
                          <YAxis stroke="var(--color-text-muted)" fontSize={9} tickFormatter={(val) => `$${val/1000}k`} />
                          <Tooltip
                            contentStyle={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "10px", fontSize: "10px" }}
                            formatter={(value) => [`$${value.toLocaleString()}`, "Salary"]}
                          />
                          <Bar dataKey="Entry" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={15} />
                          <Bar dataKey="Mid" fill="var(--color-accent)" radius={[3, 3, 0, 0]} maxBarSize={15} />
                          <Bar dataKey="Senior" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={15} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-[10px] font-semibold">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Entry Level</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-accent" /> Mid Level</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Senior Level</span>
                    </div>
                  </GlassCard>

                  {/* Industry trends list */}
                  <GlassCard className="p-5 space-y-4">
                    <h4 className="text-xs font-bold text-main uppercase tracking-wider flex items-center gap-2 border-b border-subtle/50 pb-2.5">
                      <Flame size={14} className="text-accent" /> Trending Industry Skills & Paths
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Fastest Growing Skills</p>
                        {[
                          { name: "Generative AI Engineering", growth: "+45% YoY" },
                          { name: "TypeScript & Next.js", growth: "+38% YoY" },
                          { name: "Docker & Kubernetes Orchestration", growth: "+32% YoY" },
                          { name: "AWS Serverless & Cloud Security", growth: "+29% YoY" }
                        ].map((s, i) => (
                          <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-surface/50 border border-subtle rounded-xl">
                            <span className="text-main font-semibold">{s.name}</span>
                            <span className="text-accent font-extrabold">{s.growth}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2.5">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Highest Demand Roles</p>
                        {[
                          { name: "AI/ML Engineer", avg: "$145k - $210k" },
                          { name: "Full Stack Engineer", avg: "$110k - $160k" },
                          { name: "Cloud Architect", avg: "$135k - $190k" },
                          { name: "DevOps/SRE", avg: "$120k - $175k" }
                        ].map((r, i) => (
                          <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-surface/50 border border-subtle rounded-xl">
                            <span className="text-main font-semibold">{r.name}</span>
                            <span className="text-emerald-500 font-extrabold">{r.avg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 3. FLOATING CHAT WIDGET PANEL */}
        {/* Toggle Button for chat */}
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-yellow-600 text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform z-40 cursor-pointer border border-accent/20"
          >
            <MessageSquare size={24} strokeWidth={2.5} />
            
            {/* Pulsing notify dot */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-base animate-pulse" />
          </motion.button>
        )}

        {/* Chat Sliding Sidebar Drawer */}
        <AnimatePresence>
          {isChatOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsChatOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45"
              />

              {/* Chat Panel Box */}
              <motion.div
                variants={chatVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed right-0 bottom-0 top-0 lg:right-6 lg:bottom-6 lg:top-auto w-full lg:w-[420px] lg:h-[600px] bg-card border border-subtle z-50 lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-subtle bg-surface/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-main leading-tight">Coach Gemini</h4>
                      <p className="text-[9px] text-muted flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Personal AI Career Mentor</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-1.5 text-muted hover:text-main rounded-lg hover:bg-surface-hover/80 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Message logs */}
                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 custom-scrollbar">
                  {chatHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4 px-6 text-muted">
                      <div className="w-12 h-12 rounded-full bg-accent/5 border border-accent/15 flex items-center justify-center text-accent">
                        <MessageSquare size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-main">Start Chatting with Coach Gemini</p>
                        <p className="text-[10px] leading-relaxed">
                          Ask suggestions like "What should I learn next?", "Explain how to build the e-commerce project", or "Is AWS or GCP better for Full Stack?"
                        </p>
                      </div>
                    </div>
                  ) : (
                    chatHistory.map((msg, index) => {
                      const isAi = msg.sender === "ai";
                      return (
                        <div key={index} className={`flex gap-2.5 max-w-[85%] ${isAi ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}>
                          
                          {/* Avatar icon */}
                          <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border text-[10px] font-black
                            ${isAi ? "bg-accent/15 border-accent/25 text-accent" : "bg-blue-500/10 border-blue-500/20 text-blue-500"}`}
                          >
                            {isAi ? "AI" : user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div className="space-y-1">
                            <div
                              className={`p-3 rounded-2xl text-[11px] leading-relaxed border
                                ${isAi
                                  ? "bg-surface/50 border-subtle rounded-tl-none text-main prose prose-invert max-w-none prose-xs"
                                  : "bg-gradient-to-tr from-accent to-yellow-600 border-accent/20 rounded-tr-none text-black font-semibold"}`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            <span className="text-[8px] text-muted px-1.5 block">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {sendingChat && (
                    <div className="flex gap-2.5 max-w-[85%] mr-auto text-left">
                      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border bg-accent/15 border-accent/25 text-accent text-[10px] font-black">
                        AI
                      </div>
                      <div className="p-3 bg-surface/50 border border-subtle rounded-2xl rounded-tl-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Inputs */}
                <form onSubmit={handleSendChatMessage} className="p-3 border-t border-subtle bg-surface/30 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask Coach Gemini..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={sendingChat}
                    className="input-dark text-xs flex-1 pl-4 pr-2 py-2.5 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sendingChat || !chatMessage.trim()}
                    className="w-10 h-10 rounded-xl bg-accent hover:bg-accent-muted text-black flex items-center justify-center shadow shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <Send size={14} strokeWidth={2.5} />
                  </button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default CareerAdvisor;
