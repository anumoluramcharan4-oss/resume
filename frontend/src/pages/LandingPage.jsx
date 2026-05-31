// ==========================================
// src/pages/LandingPage.jsx
// ==========================================
// Editorial Magazine Layout - Dark Editorial Luxe Aesthetic
// Asymmetric composition, warm gold accents, premium typography

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap, FileText, Sparkles, Briefcase, ArrowRight,
  Brain, Target, TrendingUp, BarChart3, CheckCircle2,
  Star, Command
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base text-main font-sans overflow-x-hidden relative">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-grid-metallic opacity-[0.25]"></div>
        <div className="glow-orb glow-orb--1"></div>
        <div className="glow-orb glow-orb--2"></div>
        <div className="glow-orb glow-orb--3"></div>
      </div>

      {/* Header & Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full glass border-b border-subtle backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Zap size={22} className="text-accent group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display font-bold text-main text-xl tracking-tight">
              Career<span className="text-accent">AI</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted hover:text-accent transition-colors font-medium tracking-wide">Features</a>
            <a href="#stats" className="text-sm text-muted hover:text-accent transition-colors font-medium tracking-wide">Analytics</a>
            <a href="#cta" className="text-sm text-muted hover:text-accent transition-colors font-medium tracking-wide">Get Started</a>
          </nav>

          <div className="flex items-center gap-5">
            <Link to="/login" className="text-sm text-muted hover:text-main transition-colors font-medium tracking-wide">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary py-2.5 px-5 text-sm font-semibold rounded-xl hoverLift">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content wrapper */}
      <div className="relative z-10 flex flex-col">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-12 md:pt-20 pb-20 md:pb-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-12 min-h-[calc(100vh-80px)]">
          
          {/* Left Text Column */}
          <div className="w-full lg:w-[58%] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(212,175,55,0.06)] border border-accent/15 mb-6">
                <Zap size={15} className="text-accent" />
                <span className="text-xs font-semibold text-accent tracking-widest uppercase">
                  Powered by Google Gemini AI
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.1] text-main tracking-tight mb-6">
                Build Your Dream <span className="gradient-text">Career With AI</span>
              </h1>

              {/* Subheadline description */}
              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-xl mb-8 font-light">
                Create ATS-optimized resumes, discover skill gaps, get personalized
                project ideas, and land opportunities faster using advanced AI.
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/register"
                  className="btn-primary hoverLift inline-flex items-center gap-2 text-base font-semibold py-3 px-7 rounded-xl shadow-lg shadow-accent/10"
                >
                  Start Building Free
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#features"
                  className="btn-secondary hoverLift text-base font-medium py-3 px-7 rounded-xl flex items-center justify-center"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex gap-6 mt-10 text-xs md:text-sm text-muted flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column - Hero Mockup */}
          <div className="w-full lg:w-[42%] flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[340px] md:max-w-[380px]"
            >
              {/* Abstract radial blur background */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-[280px] h-[280px] rounded-full bg-[rgba(212,175,55,0.07)] blur-[60px]" />
                <div className="w-[180px] h-[180px] rounded-full bg-purple-500/[0.04] blur-[40px] translate-x-12 -translate-y-8" />
              </div>

              {/* Glassmorphic Mockup Container */}
              <div className="relative z-10 rounded-2xl bg-[#121212]/80 border border-[rgba(212,175,55,0.18)] shadow-2xl p-5 overflow-hidden backdrop-blur-md">
                
                {/* Header section */}
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(212,175,55,0.1)] mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-accent" />
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">Resume Workspace</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
                  </div>
                </div>

                {/* Content Simulator */}
                <div className="space-y-4">
                  <div className="h-[22px] bg-white/[0.03] border border-white/[0.04] rounded-lg w-[85%] px-2.5 flex items-center text-[10px] text-muted font-mono">
                    john.doe@email.com • SF, California
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-main uppercase tracking-wider flex justify-between">
                      <span>Experience</span>
                      <span className="text-[10px] text-accent font-normal">AI Rewritten</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03] space-y-1.5">
                      <div className="h-2 bg-accent/20 rounded w-[45%]"></div>
                      <div className="h-1.5 bg-muted/20 rounded w-[90%]"></div>
                      <div className="h-1.5 bg-muted/20 rounded w-[80%]"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-main uppercase tracking-wider">Skills & Frameworks</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-medium">React</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-medium">Next.js</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-medium">Tailwind CSS</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-medium">Node.js</span>
                    </div>
                  </div>
                </div>

                {/* Simulated score badge */}
                <div className="mt-4 pt-3 border-t border-[rgba(212,175,55,0.08)] flex items-center justify-between text-xs">
                  <span className="text-muted">Analysis Status</span>
                  <span className="text-green-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> ATS Checked
                  </span>
                </div>
              </div>

              {/* Floating ATS Badge */}
              <motion.div
                initial={{ x: 20, y: 0, opacity: 0 }}
                animate={{ x: 0, y: [0, -8, 0], opacity: 1 }}
                transition={{
                  x: { delay: 0.6, duration: 0.6 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
                className="absolute -top-6 -right-8 glass border border-accent/30 p-2.5 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
                  98%
                </div>
                <div>
                  <div className="text-[9px] text-muted uppercase font-bold tracking-wider">ATS Score</div>
                  <div className="text-xs text-main font-semibold">Perfect Pass</div>
                </div>
              </motion.div>

              {/* Floating Feedback Badge */}
              <motion.div
                initial={{ x: -20, y: 0, opacity: 0 }}
                animate={{ x: 0, y: [0, 8, 0], opacity: 1 }}
                transition={{
                  x: { delay: 0.8, duration: 0.6 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }
                }}
                className="absolute -bottom-6 -left-8 glass border border-accent/20 p-2.5 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                <div>
                  <div className="text-[9px] text-muted uppercase font-bold tracking-wider">AI Optimizer</div>
                  <div className="text-xs text-main font-semibold">Ready to Apply</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid Divider */}
        <section id="stats" className="border-y border-subtle bg-white/[0.01] backdrop-blur-sm py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <div className="flex flex-col gap-2">
              <div className="text-4xl md:text-5xl font-extrabold font-display text-accent tracking-tight">50K+</div>
              <div className="text-xs font-semibold text-muted uppercase tracking-widest">Resumes Created</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl md:text-5xl font-extrabold font-display text-accent tracking-tight">98%</div>
              <div className="text-xs font-semibold text-muted uppercase tracking-widest">ATS Pass Rate</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl md:text-5xl font-extrabold font-display text-accent tracking-tight">12K+</div>
              <div className="text-xs font-semibold text-muted uppercase tracking-widest">Hired Users</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl md:text-5xl font-extrabold font-display text-accent tracking-tight">4.9/5</div>
              <div className="text-xs font-semibold text-muted uppercase tracking-widest">Average Rating</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-main mb-6 leading-tight">
              An Unfair Advantage for <span className="gradient-text">Your Career</span>
            </h2>
            <p className="text-muted text-base md:text-lg font-light leading-relaxed">
              Everything you need to build a standout profile, optimize for
              algorithms, and get hired faster in one unified platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-2xl p-8 border border-[rgba(212,175,55,0.1)] hoverLift"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[rgba(212,175,55,0.06)] border border-accent/20">
                <FileText size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main font-display mb-3">Smart Resume Builder</h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Build stunning, ATS-friendly resumes in minutes with our intelligent template engine.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-2xl p-8 border border-[rgba(212,175,55,0.1)] hoverLift"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[rgba(212,175,55,0.06)] border border-accent/20">
                <Brain size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main font-display mb-3">AI-Powered Analysis</h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Get instant ATS scores, identify crucial skill gaps, and receive professional rewrite suggestions via Gemini.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass rounded-2xl p-8 border border-[rgba(212,175,55,0.1)] hoverLift"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[rgba(212,175,55,0.06)] border border-accent/20">
                <Target size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main font-display mb-3">ATS Score Checker</h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Test your resume against industry-standard parsers to ensure you pass automated screening.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass rounded-2xl p-8 border border-[rgba(212,175,55,0.1)] hoverLift"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[rgba(212,175,55,0.06)] border border-accent/20">
                <TrendingUp size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main font-display mb-3">Project Suggestions</h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Receive personalized, portfolio-worthy project ideas tailored perfectly to your target roles.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass rounded-2xl p-8 border border-[rgba(212,175,55,0.1)] hoverLift"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[rgba(212,175,55,0.06)] border border-accent/20">
                <Briefcase size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main font-display mb-3">Job Recommendations</h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Discover the most relevant job postings and internships matched strictly to your validated skills.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass rounded-2xl p-8 border border-[rgba(212,175,55,0.1)] hoverLift"
            >
              <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-[rgba(212,175,55,0.06)] border border-accent/20">
                <BarChart3 size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-main font-display mb-3">Career Analytics</h3>
              <p className="text-muted text-sm leading-relaxed font-light">
                Track your application success rate and get data-driven insights to improve your interview chances.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Bottom Banner */}
        <section id="cta" className="relative z-10 py-16 md:py-24 px-6 md:px-12 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-border rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="bg-[#121212]/80 backdrop-blur-xl p-8 md:p-16 text-center relative">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />

              <h2 className="text-3xl md:text-4xl font-bold font-display text-main mb-6 leading-tight">
                Ready to land your next role?
              </h2>
              <p className="text-muted text-base md:text-lg max-w-[50ch] mx-auto mb-8 font-light leading-relaxed">
                Join thousands of professionals who have accelerated their career growth with CareerAI.
              </p>
              
              <Link
                to="/register"
                className="btn-primary hoverLift inline-flex items-center gap-2 text-base font-semibold py-3 px-8 rounded-xl shadow-lg"
              >
                Start For Free
                <ArrowRight size={18} />
              </Link>
              <p className="text-xs text-muted mt-4">
                No credit card required. Setup in 2 minutes.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Premium Multi-Column Footer */}
        <footer className="relative z-10 border-t border-subtle py-16 px-6 md:px-12 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
            
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2.5">
                <Zap size={22} className="text-accent" />
                <span className="font-bold text-main text-xl font-display tracking-tight">
                  Career<span className="text-accent">AI</span>
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed font-light">
                Elevating career building and resume optimization with professional intelligence. Powered by advanced AI models.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-main uppercase tracking-widest font-display">Product</h4>
                <ul className="space-y-2 text-xs text-muted">
                  <li><a href="#" className="hover:text-accent transition-colors">Resume Builder</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">ATS Scoring</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">AI Suggestions</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-main uppercase tracking-widest font-display">Company</h4>
                <ul className="space-y-2 text-xs text-muted">
                  <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-main uppercase tracking-widest font-display">Connect</h4>
                <ul className="space-y-2 text-xs text-muted">
                  <li><a href="#" className="hover:text-accent transition-colors">Support Center</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Email Us</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[rgba(212,175,55,0.05)] flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
            <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
            <p className="font-light">Crafted for outstanding career excellence.</p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;