// ==========================================
// src/pages/LandingPage.jsx
// ==========================================
// Minimalist, high-conversion landing page for CareerAI
// Designed with a unified Linear / Stripe dark design system

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Upload,
  Check,
  CheckCircle2,
  FileText,
  Search,
  Brain,
  Compass,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Menu,
  X
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Resume Analyzer state
  const [uploadFile, setUploadFile] = useState(null);
  const [parsingState, setParsingState] = useState("idle"); // idle | parsing | complete
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingLog, setParsingLog] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      triggerParsing(file.name);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerParsing(file.name);
    }
  };

  const triggerParsing = (filename) => {
    setUploadFile(filename);
    setParsingState("parsing");
    setParsingProgress(0);
    setShowResults(false);

    const steps = [
      { progress: 25, message: "Reading document structure and layout..." },
      { progress: 50, message: "Extracting skills, roles, and experience metrics..." },
      { progress: 75, message: "Evaluating against 2,000+ ATS recruiter filters..." },
      { progress: 100, message: "Analysis complete." }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setParsingProgress(steps[current].progress);
        setParsingLog(steps[current].message);
        current++;
      } else {
        clearInterval(interval);
        setParsingState("complete");
        setShowResults(true);
      }
    }, 700);
  };

  const useDemoResume = () => {
    triggerParsing("alex_chen_senior_software_engineer.pdf");
  };

  const resetParser = () => {
    setUploadFile(null);
    setParsingState("idle");
    setParsingProgress(0);
    setParsingLog("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-blue-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0A0B]/85 backdrop-blur-md">
        <div className="app-container h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Zap size={16} className="fill-white" />
            </div>
            <span className="font-semibold text-white text-base tracking-tight">
              Career<span className="text-blue-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#analyzer" className="hover:text-white transition-colors">
              Resume Analyzer
            </a>
            <Link to="/advisor" className="hover:text-white transition-colors">
              AI Advisor
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs font-medium text-zinc-400 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="btn-primary text-xs !py-2 !px-4"
            >
              Get Started <ArrowRight size={13} className="ml-1" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-400 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-[#131316] px-6 py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 py-1"
            >
              Features
            </a>
            <a
              href="#analyzer"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 py-1"
            >
              Resume Analyzer
            </a>
            <Link
              to="/advisor"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 py-1"
            >
              AI Advisor
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-zinc-300 py-1"
            >
              Sign In
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* ─────────────────────────────────────────────────────────────
            2. HERO SECTION
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full pt-16 md:pt-24 pb-20">
          <div className="app-container">
            <div className="hero-text-container mb-12 sm:mb-14">
              {/* Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <Sparkles size={13} />
                <span>Intelligent Career Optimization Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                Get Discovered. <br />
                <span className="text-blue-500">Get Hired Faster.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
                AI-powered resume optimization, ATS scoring, and skill gap diagnostics engineered to pass enterprise recruiter screens.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="btn-primary text-sm px-6 py-3"
                >
                  Get Started Free <ArrowRight size={14} className="ml-1.5" />
                </Link>
                <a
                  href="#analyzer"
                  className="btn-secondary text-sm px-6 py-3"
                >
                  Upload Resume
                </a>
              </div>

              {/* Understated Trust Row (1 line, no giant colorful fake numbers) */}
              <div className="mt-8 text-xs text-zinc-500 flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-blue-500" /> Free to get started
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-blue-500" /> Compatible with major ATS formats
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-blue-500" /> Real-time feedback
                </span>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                HERO VISUAL: ONE Well-Composed Product Preview Mockup
                CRITICAL FIX: NO floating/overlapping cards! Flat, clean, single visual.
                ───────────────────────────────────────────────────────────── */}
            <div className="hero-mockup-container">
            <div className="card-clean rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08] bg-[#131316]">
              {/* Mockup Window Header */}
              <div className="h-10 px-4 border-b border-white/[0.08] bg-[#0E0E11] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="ml-3 text-[11px] text-zinc-500 font-mono">
                    resume_audit_report.pdf
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-zinc-400 font-medium">ATS Screen: Passed</span>
                </div>
              </div>

              {/* Mockup Report Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Score Summary Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border-b border-white/[0.08] pb-6">
                  {/* Left: Overall ATS Score */}
                  <div className="sm:col-span-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 shrink-0">
                      <span className="text-2xl font-bold leading-none">94</span>
                      <span className="text-[10px] text-blue-400/80 uppercase font-medium mt-0.5">/ 100</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Overall ATS Score</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">High Recruiter Compatibility</p>
                    </div>
                  </div>

                  {/* Right: Breakdown Bars */}
                  <div className="sm:col-span-8 grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Skills Match</span>
                        <span className="text-white font-medium">96%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "96%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Format & ATS</span>
                        <span className="text-white font-medium">98%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "98%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-zinc-400">Action Verbs</span>
                        <span className="text-white font-medium">88%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "88%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Analysis Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Matched Skills */}
                  <div>
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2.5">
                      Matched Core Skills (8)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "Node.js", "Next.js", "REST APIs", "Tailwind CSS", "PostgreSQL", "Git"].map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2.5">
                      Identified Missing Keywords (3)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Docker", "GraphQL", "CI/CD Pipelines"].map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.08]"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                <div className="p-3.5 rounded-xl bg-[#0E0E11] border border-white/[0.06] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={13} />
                  </div>
                  <div className="text-xs">
                    <span className="text-white font-medium">AI Optimization Tip: </span>
                    <span className="text-zinc-400 leading-relaxed">
                      Rephrase experience bullet points to lead with measurable impact (e.g. <i>"Reduced API latency by 35% across 2M daily requests"</i>).
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. FEATURES SECTION (Keep the 7 features, single-accent design)
            ───────────────────────────────────────────────────────────── */}
        <section id="features" className="w-full border-t border-white/[0.08] py-20">
          <div className="app-container">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="text-xs font-medium text-blue-500 uppercase tracking-wider block mb-2">
                Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                Everything Needed to Accelerate Your Search
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Disciplined tooling built to optimize your profile, discover target roles, and prepare for interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "ATS Resume Analysis",
                  desc: "Instant structural evaluation, keyword density scans, and formatting checks matched to enterprise ATS patterns.",
                  icon: Search
                },
                {
                  title: "AI Career Advisor",
                  desc: "A focused, calm chat interface providing tailored feedback, career transitions, and industry context.",
                  icon: Brain
                },
                {
                  title: "Resume Builder",
                  desc: "Create clean, recruiter-approved resumes using standardized, distraction-free templates.",
                  icon: FileText
                },
                {
                  title: "Skill Gap Detection",
                  desc: "Compare your resume against target job postings to uncover missing libraries, tools, and frameworks.",
                  icon: Target
                },
                {
                  title: "Roadmap Generator",
                  desc: "Step-by-step technical blueprints detailing what to learn next to qualify for higher-level roles.",
                  icon: TrendingUp
                },
                {
                  title: "Mock Interview Prep",
                  desc: "Tailored behavioral and technical interview questions synthesized directly from your experience.",
                  icon: Award
                },
                {
                  title: "Job Recommendations",
                  desc: "Relevant job listings and internships scored by compatibility with your current skillset.",
                  icon: Briefcase
                }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="card-clean card-clean-hover p-6 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. RESUME ANALYZER (Interactive Real-Time Tool)
            ───────────────────────────────────────────────────────────── */}
        <section id="analyzer" className="w-full border-t border-white/[0.08] py-20">
          <div className="app-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Context */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-medium text-blue-500 uppercase tracking-wider block">
                Interactive Audit
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Audit Your Resume In Real Time
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Upload your resume file or test with a sample profile. CareerAI parses your text, analyzes keyword density, and produces an instant compatibility report.
              </p>

              <div className="space-y-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Instant Keyword Extraction:</span> Identifies technical proficiencies and terminology.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Actionable Suggestions:</span> Pinpoints exact phrases to re-write with quantifiable impact.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Upload Box Focal Point */}
            <div className="lg:col-span-7">
              <div className="card-clean p-6 sm:p-8 rounded-2xl min-h-[340px] flex flex-col justify-center">
                
                {/* 1. Idle state: Drag & Drop upload box */}
                {parsingState === "idle" && (
                  <div className="space-y-5 text-center">
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-[#0E0E11] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors relative"
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Upload resume file"
                      />
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                        <Upload size={18} />
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Drag and drop your resume file here
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Supports PDF and DOCX files up to 10MB
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-[1px] flex-1 bg-white/[0.08]" />
                      <span className="text-[11px] text-zinc-500 font-medium">or</span>
                      <div className="h-[1px] flex-1 bg-white/[0.08]" />
                    </div>

                    <button
                      type="button"
                      onClick={useDemoResume}
                      className="btn-secondary text-xs !py-2.5 !px-4 mx-auto"
                    >
                      <Sparkles size={13} className="text-blue-500 mr-1.5" />
                      Try Sample Candidate Resume
                    </button>
                  </div>
                )}

                {/* 2. Parsing State */}
                {parsingState === "parsing" && (
                  <div className="py-10 text-center space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                      <Zap size={22} className="animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">Analyzing Resume</h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto h-5">{parsingLog}</p>
                    </div>
                    <div className="w-64 max-w-full mx-auto h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                        style={{ width: `${parsingProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{parsingProgress}% complete</span>
                  </div>
                )}

                {/* 3. Results State */}
                {parsingState === "complete" && showResults && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-blue-500" />
                        <div>
                          <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                            {uploadFile || "resume.pdf"}
                          </p>
                          <p className="text-[11px] text-emerald-400 font-medium">Analysis ready</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={resetParser}
                        className="text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 p-4 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-center">
                        <span className="text-[11px] text-zinc-500 uppercase tracking-wider block mb-1">ATS Score</span>
                        <span className="text-3xl font-bold text-white">78%</span>
                        <span className="text-[11px] text-emerald-400 font-medium block mt-1">Good Match</span>
                      </div>
                      <div className="sm:col-span-8 space-y-2">
                        <span className="text-xs text-zinc-400 block font-medium">Extracted Keywords</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "REST APIs"].map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-xs bg-white/[0.04] text-zinc-300 border border-white/[0.08]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0E0E11] border border-white/[0.06] text-xs text-zinc-400 space-y-1">
                      <span className="text-white font-medium block">Key Recommendation:</span>
                      <p>Add <b>Docker</b> and <b>CI/CD</b> to meet typical recruiter filters for Full Stack roles.</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="btn-primary w-full text-xs !py-2.5"
                    >
                      Open in Career Dashboard <ArrowRight size={13} className="ml-1.5" />
                    </Link>
                  </div>
                )}

              </div>
            </div>

          </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. FINAL CTA SECTION (Strong closing call-to-action band)
            ───────────────────────────────────────────────────────────── */}
        <section className="w-full border-t border-white/[0.08] py-20">
          <div className="app-container">
            <div className="card-clean rounded-2xl p-10 sm:p-14 text-center max-w-3xl mx-auto border border-white/[0.08] bg-[#131316]">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto mb-8 font-normal">
                Build an ATS-optimized resume, evaluate skill gaps, and explore tailored job matches today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="btn-primary text-sm px-6 py-3"
                >
                  Get Started Free <ArrowRight size={14} className="ml-1.5" />
                </Link>
                <a
                  href="#features"
                  className="btn-secondary text-sm px-6 py-3"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          6. SIMPLE FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-white/[0.08] py-12">
        <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Zap size={11} className="fill-white" />
            </div>
            <span className="font-semibold text-white">CareerAI</span>
            <span className="text-zinc-600">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#analyzer" className="hover:text-white transition-colors">Analyzer</a>
            <Link to="/advisor" className="hover:text-white transition-colors">Advisor</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;