// ==========================================
// src/pages/LandingPage.jsx
// ==========================================
// Rebuilt Premium Career AI Landing Page
// Inspired by world-class AI SaaS platforms (Stripe, Linear, Notion AI)

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Zap,
  Sparkles,
  FileText,
  Compass,
  Briefcase,
  Target,
  Brain,
  Award,
  ArrowRight,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Menu,
  Sun,
  Moon,
  TrendingUp,
  Globe,
  MapPin,
  Mail,
  Check,
  CheckCircle,
  HelpCircle,
  UserCheck,
  Flame,
  Search,
  Users
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Simple Animated Counter Component using requestAnimationFrame
const AnimatedCounter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(end)) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * end);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  const displayVal = value.includes("K") ? formatNumber(count) : count;

  return (
    <span ref={ref}>
      {displayVal}
      {suffix}
    </span>
  );
};

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Scroll detection for header blur
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Resume Upload section states
  const [uploadFile, setUploadFile] = useState(null);
  const [parsingState, setParsingState] = useState("idle"); // idle | parsing | complete
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingLog, setParsingLog] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Testimonial Carousel states
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Software Engineer at Google",
      story: "Career AI completely transformed how I present my skills. The ATS feedback highlighted crucial keywords I was missing. Within 3 weeks of updating my resume and completing the recommended projects, I locked down interviews at Google and Meta!",
      image: "/testimonial_female_engineer.png",
      rating: 5
    },
    {
      name: "Austin Vance",
      role: "Cloud Architect at AWS",
      story: "The Skill Gap Analysis is pure magic. It told me exactly what I needed to build to transition from SysAdmin to Cloud Architect. The interactive roadmap kept me focused and the resume compiler score went from 65% to a perfect 95%.",
      image: "/testimonial_male_architect.png",
      rating: 5
    },
    {
      name: "Elena Rostova",
      role: "Data Scientist at NVIDIA",
      story: "I had the theory down but lacked portfolio depth. Career AI suggested specific data pipelines to build and guided me through rephrasing my bullet points using active metrics. I went from getting zero responses to receiving three competitive offers.",
      image: "/testimonial_female_scientist.png",
      rating: 5
    }
  ];

  // Auto scroll testimonials
  useEffect(() => {
    if (parsingState === "idle") {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [parsingState]);

  // Resume upload drag handler
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

  // Simulate Parsing Pipeline
  const triggerParsing = (filename) => {
    setUploadFile(filename);
    setParsingState("parsing");
    setParsingProgress(0);
    setShowResults(false);

    const logs = [
      { progress: 20, message: "Parsing PDF text layers..." },
      { progress: 45, message: "Extracting skills graph & coordinates..." },
      { progress: 70, message: "Analyzing ATS keyword density against 5,000+ job descriptions..." },
      { progress: 90, message: "Generating personalized learning roadmap recommendations..." },
      { progress: 100, message: "AI Analysis Complete!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setParsingProgress(logs[currentStep].progress);
        setParsingLog(logs[currentStep].message);
        currentStep++;
      } else {
        clearInterval(interval);
        setParsingState("complete");
        setShowResults(true);
      }
    }, 1000);
  };

  const useDemoResume = () => {
    triggerParsing("alex_rivera_resume.pdf");
  };

  const resetParser = () => {
    setUploadFile(null);
    setParsingState("idle");
    setParsingProgress(0);
    setParsingLog("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative selection:bg-blue-500 selection:text-white">
      
      {/* Glow Effects */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent pointer-events-none z-0 dark:from-blue-900/10 dark:via-indigo-950/5" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none z-0 dark:bg-cyan-900/5" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none z-0 dark:bg-indigo-900/5" />

      {/* Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-slate-900 dark:text-white text-lg tracking-tight leading-none">
                Career<span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-wide">
                AI Powered Career Growth
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Features
            </a>
            <a href="#parser" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Resume Builder
            </a>
            <a href="#roadmap" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Career Advisor
            </a>
            <a href="#pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Navbar CTA, Theme Toggle, & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900 transition-all border border-transparent dark:border-slate-800/20"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/dashboard"
              className="hidden md:inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-sm active:scale-95 duration-200"
            >
              Get Started <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-6 py-6 space-y-4"
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
              >
                Features
              </a>
              <a
                href="#parser"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
              >
                Resume Builder
              </a>
              <a
                href="#roadmap"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
              >
                Career Advisor
              </a>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-bold py-3 rounded-full text-sm shadow-md"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="relative z-10">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                <Sparkles size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                  🚀 Introducing Career AI 360°
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                Get Discovered. <br />
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Get Hired. Faster.
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-xl">
                Transform your resume, discover skill gaps, and receive AI-powered career guidance in minutes.
              </p>

              <div className="flex gap-4 flex-wrap justify-center lg:justify-start pt-2">
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 text-white font-bold py-3 px-8 rounded-full text-xs shadow-sm hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Create My Career Profile
                </Link>

                <a
                  href="#parser"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 font-bold py-3 px-8 rounded-full text-xs hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-slate-200 dark:border-slate-800/40"
                >
                  Upload Resume
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex gap-6 mt-8 text-[11px] text-slate-400 justify-center lg:justify-start">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span>ATS-optimized templates</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column - Dashboard Mockup with Floating Cards */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[480px] lg:h-[500px]">
            
            {/* Dashboard Backdrop Grid */}
            <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/10 border border-slate-200/60 dark:border-slate-800/40 rounded-3xl backdrop-blur-sm -z-10 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-grid-metallic opacity-[0.05] dark:opacity-[0.15]" />
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Simulated main view */}
            <div className="absolute w-[80%] h-[75%] bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/40 rounded-2xl p-4 shadow-xl flex flex-col gap-4 overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/60 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Candidate Hub</span>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
              
              {/* Profile summary card */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  AR
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-[60%]" />
                  <div className="h-2 bg-slate-100 dark:bg-slate-800/60 rounded w-[40%]" />
                </div>
              </div>

              {/* Mock content blocks */}
              <div className="space-y-2 mt-2">
                <div className="h-2 bg-slate-200/80 dark:bg-slate-800 rounded w-[90%]" />
                <div className="h-2 bg-slate-200/80 dark:bg-slate-800 rounded w-[85%]" />
                <div className="h-2 bg-slate-200/80 dark:bg-slate-800 rounded w-[70%]" />
              </div>

              {/* Pulsing indicator */}
              <div className="mt-auto border-t border-slate-100 dark:border-slate-800/60 pt-3 flex items-center justify-between text-[9px] text-slate-400">
                <span>Active Profile Analytics</span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Optimizing
                </span>
              </div>
            </div>

            {/* Floating Glass Card 1: ATS Score Card (Top Left) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-2 left-[-16px] w-[160px] bg-white/80 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-xl p-3.5 rounded-2xl flex flex-col gap-2 backdrop-blur-md"
            >
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">ATS Match Rating</span>
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="22" cy="22" r="18" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="3" fill="transparent" />
                    <circle cx="22" cy="22" r="18" stroke="url(#blueGradient)" strokeWidth="3.5" fill="transparent"
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 * (1 - 0.94)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-[10px] font-black text-slate-900 dark:text-white">94%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-950 dark:text-white">Excellent Pass</span>
                  <span className="text-[8px] text-emerald-500 font-semibold flex items-center gap-0.5">
                    <Check size={8} /> Match Verified
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Floating Glass Card 2: Resume Match Score (Top Right) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 right-[-16px] w-[180px] bg-white/80 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-xl p-3.5 rounded-2xl flex flex-col gap-1.5 backdrop-blur-md"
            >
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Resume Match Score</span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-950 dark:text-white truncate">AI Software Eng.</span>
                <span className="text-xs font-black text-blue-500">88%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: "88%" }} />
              </div>
              <span className="text-[8px] text-slate-400 font-medium">Matched achievements: 8/10</span>
            </motion.div>

            {/* Floating Glass Card 3: Recommended Skills (Bottom Right) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-6 right-[-24px] w-[190px] bg-white/80 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-xl p-3.5 rounded-2xl flex flex-col gap-2 backdrop-blur-md"
            >
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Recommended Skills</span>
              <div className="flex flex-wrap gap-1">
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold flex items-center gap-0.5">
                  <Check size={8} /> React
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold flex items-center gap-0.5">
                  <Check size={8} /> Next.js
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 font-semibold flex items-center gap-0.5">
                  + Python
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 font-semibold flex items-center gap-0.5">
                  + Docker
                </span>
              </div>
            </motion.div>

            {/* Floating Glass Card 4: Career Roadmap (Bottom Left) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1.2 }}
              className="absolute bottom-4 left-[-20px] w-[170px] bg-white/80 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-xl p-3.5 rounded-2xl flex flex-col gap-2 backdrop-blur-md"
            >
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Career Roadmap</span>
              <div className="space-y-1.5">
                {[
                  { name: "Frontend Intern", active: true },
                  { name: "Associate Web Eng", active: true },
                  { name: "Lead AI Architect", active: false }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[9px]">
                    <span className={`w-2 h-2 rounded-full ${step.active ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-700 animate-pulse"}`} />
                    <span className={`font-semibold ${step.active ? "text-slate-900 dark:text-slate-200" : "text-slate-400"}`}>{step.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating Glass Card 5: Interview Readiness (Center Bottom) */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-[-16px] left-[25%] w-[180px] bg-white/85 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xl p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Flame size={14} className="animate-pulse" />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Interview Readiness</span>
                <span className="text-xs font-black text-slate-900 dark:text-white">85% Match Ready</span>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Stats Divider Section */}
        <section className="border-y border-slate-200/60 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 py-16 backdrop-blur-sm relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center relative z-10">
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black font-display bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                <AnimatedCounter value="50K" suffix="+" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Students Guided</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black font-display bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter value="95" suffix="%" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Success Rate</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black font-display bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                <AnimatedCounter value="10K" suffix="+" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumes Analyzed</p>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-black font-display bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter value="500" suffix="+" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiring Partners</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Brain size={12} className="text-indigo-500" />
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">Features Directory</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
              An Unfair Advantage for <br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Your Professional Growth
              </span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal leading-relaxed">
              Accelerate your engineering journey with custom ATS evaluations, personalized project designs, and contextual guidance powered by Gemini AI.
            </p>
          </div>

          {/* Premium Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Resume Builder",
                desc: "Create beautiful, ATS-compliant resumes instantly using custom modular layouts.",
                icon: FileText,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Resume Analyzer",
                desc: "Get instant structural critiques, identifying spelling issues, bullet improvements, and formatting issues.",
                icon: Search,
                color: "from-cyan-500 to-blue-500"
              },
              {
                title: "Career Advisor",
                desc: "An intelligent, context-aware chatbot workspace powered by Gemini AI providing direct growth advice.",
                icon: Compass,
                color: "from-blue-500 to-indigo-500"
              },
              {
                title: "Skill Gap Analysis",
                desc: "Instantly compare target job specifications to evaluate missing libraries or tools in your profile.",
                icon: Brain,
                color: "from-indigo-500 to-cyan-500"
              },
              {
                title: "Interview Preparation",
                desc: "Generate personalized technical and behavioral mock interview questionnaires mapped to your resume.",
                icon: Award,
                color: "from-cyan-500 to-indigo-500"
              },
              {
                title: "Job Recommendations",
                desc: "Locate matching internships and full-time vacancies synced to your parsed skill assets.",
                icon: Briefcase,
                color: "from-indigo-500 to-blue-500"
              }
            ].map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl dark:shadow-2xl/10 transition-all duration-300 overflow-hidden"
              >
                {/* Accent line on hover */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 mb-6`}>
                  <feat.icon size={20} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {feat.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Interactive Resume Upload Section */}
        <section id="parser" className="py-24 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-sm border-y border-slate-200/60 dark:border-slate-800/40 relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Heading Copy */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Upload size={12} className="text-cyan-500" />
                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase">Interactive Analyzer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
                Audit Your Resume <br />
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  In Real Time
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-normal">
                Upload your document in PDF or DOCX format, or test our processor using a demo candidate record. Career AI extracts your profile attributes instantly to generate an alignment report.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <Check size={14} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Instant Keyword Extraction</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Identifies critical software and engineering terminology.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <Check size={14} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Compatibility Score</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Tests formatting logic against enterprise parsing patterns.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Drag & Drop / Results Card */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-2xl/10 relative overflow-hidden min-h-[380px] flex flex-col justify-center">
                
                {/* 1. Idle state (Upload / Drop area) */}
                {parsingState === "idle" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 dark:hover:border-blue-400/50 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-blue-500/[0.01] dark:hover:bg-blue-500/[0.01] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group relative"
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Upload resume file"
                      />
                      
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300 mb-4 shadow-sm">
                        <Upload size={20} className="stroke-[2.5px]" />
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Drag & drop your resume file here
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">
                        Supports PDF and DOCX files.
                      </p>
                    </div >

                    <div className="flex items-center gap-4 w-full">
                      <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800/80" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">or</span>
                      <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800/80" />
                    </div>

                    <button
                      onClick={useDemoResume}
                      className="inline-flex items-center gap-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold py-2.5 px-6 rounded-full text-xs transition-all active:scale-95 duration-200"
                    >
                      <Sparkles size={14} className="text-blue-500" /> Use Demo Resume
                    </button>
                  </motion.div>
                )}

                {/* 2. Loading state (Processing animations) */}
                {parsingState === "parsing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center space-y-6"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                        className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-500 bg-blue-500/5"
                      />
                      <Sparkles size={24} className="text-blue-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Extraction Pipeline Running...</h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed h-8">{parsingLog}</p>
                    </div>

                    {/* Progress Slider */}
                    <div className="w-[80%] max-w-xs h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border dark:border-slate-800/60">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${parsingProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{parsingProgress}% Complete</span>
                  </motion.div>
                )}

                {/* 3. Output results state */}
                {parsingState === "complete" && showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-[280px]">
                            {uploadFile || "alex_rivera_resume.pdf"}
                          </p>
                          <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">AI Scanned Successfully</p>
                        </div>
                      </div>
                      <button
                        onClick={resetParser}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                        title="Analyze another file"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Dashboard results row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                      
                      {/* Score circle */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">ATS Score</span>
                        <div className="relative w-18 h-18 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="36" cy="36" r="30" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="4.5" fill="transparent" />
                            <circle cx="36" cy="36" r="30" stroke="url(#resultGradient)" strokeWidth="5" fill="transparent"
                              strokeDasharray={2 * Math.PI * 30}
                              strokeDashoffset={2 * Math.PI * 30 * (1 - 0.78)}
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06B6D4" />
                                <stop offset="100%" stopColor="#3B82F6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute text-sm font-black text-slate-900 dark:text-white">78%</span>
                        </div>
                        <span className="text-[9px] font-semibold text-amber-500 mt-2 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Good Match</span>
                      </div>

                      {/* Extracted Skills */}
                      <div className="sm:col-span-8 space-y-2 text-left">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Extracted Skill Attributes</span>
                        <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                          {["React", "Next.js", "Tailwind CSS", "Node.js", "REST APIs", "Git", "JavaScript", "TypeScript"].map((tag, i) => (
                            <span key={i} className="text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-500 px-2.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Improvements List */}
                    <div className="space-y-2 text-left bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Critical Improvement Suggestions</span>
                      <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1 shrink-0 font-bold leading-none">•</span>
                          <span><strong>Action-Oriented Verbs</strong>: Rephrase experience descriptions to focus on metrics (e.g. <i>'Improved load speed by 30% using Next.js caching'</i>).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1 shrink-0 font-bold leading-none">•</span>
                          <span><strong>Missing Keywords</strong>: Add <b>Python</b> and <b>Docker</b> to support ATS filters for Full Stack Developer roles.</span>
                        </li>
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-bold py-3 rounded-full text-xs shadow-md"
                    >
                      Import into My Career Advisor <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* Career Roadmap Timeline Section */}
        <section id="roadmap" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Compass size={12} className="text-blue-500" />
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Roadmap Timeline</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
              Interactive Growth Pipeline
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal leading-relaxed">
              Witness how our advisor takes you from step one to job placement through targeted skill acquisition.
            </p>
          </div>

          {/* Timeline UI */}
          <div className="relative max-w-5xl mx-auto pt-6 pb-12">
            
            {/* Animated Connector Line (Horizontal on Desktop, Vertical on Mobile) */}
            <div className="absolute top-[28px] left-[15px] bottom-12 w-0.5 bg-slate-100 dark:bg-slate-800 lg:top-[34px] lg:left-8 lg:right-8 lg:bottom-auto lg:h-0.5 lg:w-auto z-0" />
            
            {/* Animated Connector Fill */}
            <div className="absolute top-[28px] left-[15px] bottom-12 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-indigo-500 lg:top-[34px] lg:left-8 lg:right-8 lg:bottom-auto lg:h-0.5 lg:w-auto z-0 opacity-60 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 relative z-10">
              {[
                {
                  title: "Current Skills",
                  desc: "Map your foundational technologies.",
                  icon: UserCheck,
                  badge: "Step 1",
                  color: "bg-cyan-500"
                },
                {
                  title: "Skill Gap Analysis",
                  desc: "Identify essential lacking concepts.",
                  icon: Brain,
                  badge: "Step 2",
                  color: "bg-cyan-500"
                },
                {
                  title: "Learning Roadmap",
                  desc: "Study curated courses and roadmaps.",
                  icon: Compass,
                  badge: "Step 3",
                  color: "bg-blue-500"
                },
                {
                  title: "Projects",
                  desc: "Build resume-ready codebases.",
                  icon: Target,
                  badge: "Step 4",
                  color: "bg-blue-500"
                },
                {
                  title: "Internships",
                  desc: "Acquire validated work histories.",
                  icon: Briefcase,
                  badge: "Step 5",
                  color: "bg-indigo-500"
                },
                {
                  title: "Job Ready",
                  desc: "Pass custom simulated mock loops.",
                  icon: Award,
                  badge: "Step 6",
                  color: "bg-indigo-500"
                }
              ].map((step, idx) => (
                <div key={idx} className="flex lg:flex-col gap-5 lg:gap-6 text-left lg:text-center items-start lg:items-center group">
                  
                  {/* Timeline icon node */}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${step.color} text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 cursor-pointer transition-transform duration-300 shrink-0 z-10`}>
                    <step.icon size={16} className="sm:size-[18px]" />
                  </div>

                  {/* Text details */}
                  <div className="space-y-1.5 flex-1">
                    <span className="inline-block text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {step.badge}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-normal">
                      {step.desc}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Glassmorphism Carousel Section */}
        <section id="testimonials" className="py-24 bg-slate-50/50 dark:bg-slate-900/20 backdrop-blur-sm border-y border-slate-200/60 dark:border-slate-800/40 relative">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Users size={12} className="text-blue-500" />
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">User Success</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white">
                Loved by Successful Engineers
              </h2>
            </div>

            {/* Carousel Container */}
            <div className="relative min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {testimonials.map((test, idx) => (
                  idx === currentTestimonial && (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.96, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.96, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="w-full bg-white/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-lg dark:shadow-2xl/10 backdrop-blur-xl relative flex flex-col md:flex-row items-center gap-8 text-left"
                    >
                      {/* Student profile photo */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-blue-500/20 shadow-md overflow-hidden shrink-0 relative">
                        <img
                          src={test.image}
                          alt={test.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Text content */}
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-1">
                          {[...Array(test.rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed italic">
                          "{test.story}"
                        </p>

                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{test.name}</h4>
                          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{test.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>

              {/* Navigation Indicators */}
              <div className="absolute bottom-[-40px] left-0 right-0 flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 dark:border-slate-850 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-350 ${
                        i === currentTestimonial
                          ? "bg-blue-500 w-6"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-400 dark:border-slate-850 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles size={12} className="text-indigo-500" />
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">Simple Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
              Fair Pricing for Every Milestone
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal leading-relaxed">
              Unlock structural insights, resume compilations, and simulated interviews matching your timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
              <div className="space-y-4">
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Starter</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Essential utilities to compile template documents.</p>
                <div className="h-[1px] bg-slate-100 dark:bg-slate-850/60 w-full" />
                <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>Create 1 active resume profile</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>Basic ATS format check</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>Standard templates library</span></li>
                </ul>
              </div>
              <Link
                to="/dashboard"
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-full text-xs text-center transition-all active:scale-95 mt-8 block"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="relative bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-400 rounded-3xl p-8 shadow-xl flex flex-col justify-between transition-all duration-300 scale-100 lg:scale-[1.04]">
              {/* Badge */}
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-500 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Popular
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-bold bg-blue-500/10 text-blue-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Pro</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$19</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Deep analysis and interactive career optimizations.</p>
                <div className="h-[1px] bg-slate-100 dark:bg-slate-850/60 w-full" />
                <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> <span>Unlimited resume uploads & compiles</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> <span>Advanced ATS keyword diagnostics</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> <span>Interactive learning roadmaps</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-blue-500" /> <span>20 Gemini Career Advisor credits / mo</span></li>
                </ul>
              </div>
              <Link
                to="/dashboard"
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white hover:shadow-md hover:shadow-blue-500/20 font-bold py-3 rounded-full text-xs text-center transition-all active:scale-95 mt-8 block"
              >
                Unlock Pro Access
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
              <div className="space-y-4">
                <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$49</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">End-to-end recruitment preparation audits.</p>
                <div className="h-[1px] bg-slate-100 dark:bg-slate-850/60 w-full" />
                <ul className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>Everything in Pro included</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>Unlimited Career Advisor chats</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>AI technical mock interview sessions</span></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> <span>Job matching vacancies alerts</span></li>
                </ul>
              </div>
              <Link
                to="/dashboard"
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-full text-xs text-center transition-all active:scale-95 mt-8 block"
              >
                Go Premium
              </Link>
            </div>

          </div>
        </section>

        {/* Final CTA Banner Section */}
        <section className="py-24 max-w-5xl mx-auto px-6 md:px-12">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 text-white py-16 px-8 md:px-16 text-center">
            
            {/* Background elements */}
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-grid-metallic opacity-[0.08]" />

            <div className="relative z-10 space-y-6 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-tight">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-slate-100/90 text-sm md:text-base leading-relaxed font-light">
                Let AI guide your next career move. Upload your resume to unlock target profiles and missing skill reports.
              </p>
              
              <div className="flex gap-4 justify-center flex-wrap pt-2">
                <Link
                  to="/dashboard"
                  className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-xs shadow-md hover:bg-slate-55 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Start Free
                </Link>
                <a
                  href="#parser"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-8 rounded-full text-xs hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Upload Resume
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Multi-column Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/80 py-16 px-6 md:px-12 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Logo & description column */}
          <div className="md:col-span-5 space-y-4 max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center text-white">
                <Zap size={15} className="fill-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight font-display">
                Career<span className="text-blue-500">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Elevating career building and resume optimization with professional intelligence. Optimized templates designed to unlock enterprise recruiter filters.
            </p>
            {/* Social links */}
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all border dark:border-slate-800/60" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border dark:border-slate-800/60" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all border dark:border-slate-800/60" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-4">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-350 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#features" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Resume Builder</a></li>
                <li><a href="#features" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">ATS Checkers</a></li>
                <li><a href="#features" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Career Advisor</a></li>
                <li><a href="#features" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Mock Interviews</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-350 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#testimonials" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Success Stories</a></li>
                <li><a href="#pricing" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Pricing Options</a></li>
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Support Center</a></li>
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Contact Us</a></li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-350 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">About Us</a></li>
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">Terms of Service</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
          <p className="font-light">Design inspired by modern startup aesthetics.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;