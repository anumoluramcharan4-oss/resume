// ==========================================
// src/pages/ResumeGallery.jsx
// ==========================================
// Premium SaaS-level Resume Gallery & Document Center

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Eye, 
  Copy, 
  ArrowRight, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Sparkles, 
  Target, 
  Clock, 
  Share2, 
  Plus, 
  BookOpen, 
  FolderGit 
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import api from "../services/api";
import toast from "react-hot-toast";

// ---- Example resume data for each persona ----
const exampleResumes = [
  {
    id: "fresher",
    label: "Academic Graduate (Fresher)",
    emoji: "🎓",
    template: "modern",
    color: "brand",
    desc: "Final year student with academic projects, technical certifications, and a summer internship.",
    resume: {
      template: "modern",
      personal: { fullName: "Priya Sharma", email: "priya@gmail.com", phone: "+91 9876543210", location: "Pune, India", github: "github.com/priyasharma", linkedin: "linkedin.com/in/priyasharma" },
      about: "Enthusiastic Computer Science graduate with strong fundamentals in data structures and algorithms. Passionate about building scalable web applications. Actively seeking opportunities to apply my skills in a dynamic work environment.",
      skills: [{ name: "Python", level: "advanced" }, { name: "Java", level: "intermediate" }, { name: "HTML/CSS", level: "expert" }, { name: "JavaScript", level: "advanced" }, { name: "MySQL", level: "intermediate" }, { name: "Git", level: "advanced" }],
      education: [{ institution: "MIT College of Engineering", degree: "B.Tech", field: "Computer Science", startDate: "2020", endDate: "2024", grade: "8.6 CGPA" }],
      experience: [],
      projects: [
        { name: "Student Management System", description: "• Built a Java-based CRUD application for managing student records\n• Implemented MySQL database with optimized queries", technologies: ["Java", "MySQL", "Swing"], liveUrl: "", githubUrl: "github.com/priya/sms" },
        { name: "Weather App", description: "• Developed a responsive weather app using OpenWeather API\n• Displays real-time weather data with dynamic UI updates", technologies: ["JavaScript", "HTML", "CSS", "API"], liveUrl: "priya-weather.netlify.app", githubUrl: "" },
      ],
      certifications: [{ name: "Python for Everybody", issuer: "Coursera", date: "2023" }],
      achievements: [{ title: "Hackathon Winner", description: "1st place at college tech fest 2023" }],
      languages: [{ name: "English", proficiency: "fluent" }, { name: "Hindi", proficiency: "native" }],
    },
  },
  {
    id: "frontend",
    label: "Frontend Specialist",
    emoji: "🎨",
    template: "minimal",
    color: "purple",
    desc: "2+ years experience in React, TypeScript, Next.js, and interactive UI animations.",
    resume: {
      template: "minimal",
      personal: { fullName: "Arjun Mehta", email: "arjun@dev.com", phone: "+91 9988776655", location: "Bengaluru, India", github: "github.com/arjundev", portfolio: "arjunmehta.dev" },
      about: "Creative Frontend Developer with 2+ years of experience building performant, accessible web applications using React and modern CSS. Passionate about UI/UX and pixel-perfect implementations.",
      skills: [{ name: "React", level: "expert" }, { name: "TypeScript", level: "advanced" }, { name: "Tailwind CSS", level: "expert" }, { name: "Next.js", level: "advanced" }, { name: "Framer Motion", level: "advanced" }, { name: "Figma", level: "intermediate" }, { name: "Git", level: "advanced" }],
      education: [{ institution: "VIT University", degree: "B.Tech", field: "Information Technology", startDate: "2019", endDate: "2023", grade: "8.9 CGPA" }],
      experience: [{ company: "TechSpark Solutions", role: "Frontend Developer", location: "Remote", startDate: "Jan 2023", endDate: "", current: true, description: "• Built 5+ React apps serving 10K+ users\n• Reduced page load time by 40% via code splitting\n• Mentored 2 junior developers" }],
      projects: [{ name: "Design System Library", description: "Open-source React component library with 30+ components, 500+ GitHub stars", technologies: ["React", "TypeScript", "Storybook"] }],
      certifications: [{ name: "Meta Frontend Developer", issuer: "Coursera", date: "2022" }],
      achievements: [],
      languages: [{ name: "English", proficiency: "fluent" }],
    },
  },
  {
    id: "fullstack",
    label: "Full Stack Engineer",
    emoji: "🚀",
    template: "professional",
    color: "cyan",
    desc: "MERN Stack expert with transactional API architectures and AWS deployment experience.",
    resume: {
      template: "professional",
      personal: { fullName: "Rahul Verma", email: "rahul@fullstack.dev", phone: "+91 9876512345", location: "Hyderabad, India", github: "github.com/rahulverma", linkedin: "linkedin.com/in/rahulverma" },
      about: "Full Stack Developer with 3 years of experience in MERN stack. Built and deployed production applications serving 50K+ users. Strong in both frontend performance and backend architecture.",
      skills: [{ name: "React", level: "expert" }, { name: "Node.js", level: "expert" }, { name: "MongoDB", level: "advanced" }, { name: "Express.js", level: "expert" }, { name: "AWS", level: "intermediate" }, { name: "Docker", level: "intermediate" }, { name: "Redis", level: "intermediate" }, { name: "GraphQL", level: "advanced" }],
      education: [{ institution: "BITS Pilani", degree: "B.E.", field: "Computer Science", startDate: "2018", endDate: "2022", grade: "9.1 CGPA" }],
      experience: [{ company: "Razorpay", role: "Full Stack Developer", location: "Bengaluru", startDate: "Jun 2022", endDate: "", current: true, description: "• Architected microservices handling 1M+ daily transactions\n• Built real-time notification system using WebSockets\n• Optimized DB queries reducing response time by 60%" }],
      projects: [{ name: "E-Commerce Platform", description: "Full-stack e-commerce with payment integration, admin panel, and real-time inventory", technologies: ["React", "Node.js", "MongoDB", "Stripe"] }],
      certifications: [{ name: "AWS Solutions Architect", issuer: "Amazon", date: "2023" }],
      achievements: [{ title: "Best Engineer Q3 2023", description: "Awarded for shipping payment gateway feature ahead of schedule" }],
      languages: [{ name: "English", proficiency: "fluent" }],
    },
  },
  {
    id: "data-analyst",
    label: "Data Analyst / Scientist",
    emoji: "📊",
    template: "modern",
    color: "green",
    desc: "Python, SQL, and Power BI expert specialized in translating datasets into business insights.",
    resume: {
      template: "modern",
      personal: { fullName: "Sneha Patel", email: "sneha@data.com", phone: "+91 9988001122", location: "Mumbai, India", linkedin: "linkedin.com/in/snehapatel" },
      about: "Data Analyst with expertise in Python, SQL, and Power BI. Experienced in translating complex datasets into actionable business insights. Proficient in statistical analysis and predictive modeling.",
      skills: [{ name: "Python", level: "expert" }, { name: "SQL", level: "expert" }, { name: "Power BI", level: "advanced" }, { name: "Pandas", level: "expert" }, { name: "NumPy", level: "advanced" }, { name: "Tableau", level: "intermediate" }, { name: "Excel", level: "expert" }, { name: "Machine Learning", level: "intermediate" }],
      education: [{ institution: "IIT Delhi", degree: "M.Tech", field: "Data Science", startDate: "2021", endDate: "2023", grade: "9.2 CGPA" }],
      experience: [{ company: "Flipkart", role: "Data Analyst", location: "Bengaluru", startDate: "Aug 2023", endDate: "", current: true, description: "• Analyzed 5M+ customer records to identify churn patterns\n• Built dashboards that saved ₹2Cr monthly through insights\n• Automated reporting pipeline saving 20 hours/week" }],
      projects: [{ name: "Customer Churn Predictor", description: "ML model predicting customer churn with 89% accuracy using Random Forest", technologies: ["Python", "Scikit-learn", "Pandas"] }],
      certifications: [{ name: "Google Data Analytics", issuer: "Coursera", date: "2022" }],
      achievements: [],
      languages: [{ name: "English", proficiency: "fluent" }],
    },
  },
  {
    id: "software-engineer",
    label: "Backend systems engineer",
    emoji: "⚙️",
    template: "professional",
    color: "orange",
    desc: "Backend developer specialized in Go, Java, system design, and high-throughput systems.",
    resume: {
      template: "professional",
      personal: { fullName: "Karan Singh", email: "karan@engineer.io", phone: "+91 9765432100", location: "Delhi, India", github: "github.com/karansingh" },
      about: "Software Engineer specializing in scalable backend systems and distributed computing. 4 years of experience at product-based companies. Strong in Java, Go, and system design.",
      skills: [{ name: "Java", level: "expert" }, { name: "Go", level: "advanced" }, { name: "Kubernetes", level: "advanced" }, { name: "PostgreSQL", level: "advanced" }, { name: "Kafka", level: "intermediate" }, { name: "System Design", level: "advanced" }],
      education: [{ institution: "NIT Trichy", degree: "B.Tech", field: "Computer Science", startDate: "2017", endDate: "2021", grade: "8.7 CGPA" }],
      experience: [{ company: "Google", role: "Software Engineer II", location: "Hyderabad", startDate: "Mar 2021", endDate: "", current: true, description: "• Designed APIs serving 500M+ requests per day\n• Led migration of monolith to microservices\n• Reduced infrastructure costs by 30%" }],
      projects: [],
      certifications: [{ name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2022" }],
      achievements: [{ title: "Google Spot Bonus 2022", description: "For exceptional performance in infrastructure optimization project" }],
      languages: [{ name: "English", proficiency: "native" }],
    },
  },
  {
    id: "uiux",
    label: "UI/UX Product Designer",
    emoji: "🎭",
    template: "minimal",
    color: "pink",
    desc: "Experienced Figma workflow designer skilled in design systems and usability testing.",
    resume: {
      template: "minimal",
      personal: { fullName: "Ananya Rao", email: "ananya@design.co", phone: "+91 9876001234", location: "Bengaluru, India", portfolio: "ananyarao.design", linkedin: "linkedin.com/in/ananyarao" },
      about: "Product Designer with 3 years of experience crafting user-centered digital experiences. Expert in Figma with a strong foundation in user research and design systems. Shipped designs for apps with 1M+ users.",
      skills: [{ name: "Figma", level: "expert" }, { name: "Adobe XD", level: "advanced" }, { name: "Prototyping", level: "expert" }, { name: "User Research", level: "advanced" }, { name: "Design Systems", level: "expert" }, { name: "Usability Testing", level: "advanced" }, { name: "HTML/CSS", level: "intermediate" }],
      education: [{ institution: "NID Ahmedabad", degree: "B.Des", field: "Interaction Design", startDate: "2018", endDate: "2022", grade: "Distinction" }],
      experience: [{ company: "Swiggy", role: "Product Designer", location: "Bengaluru", startDate: "Jul 2022", endDate: "", current: true, description: "• Redesigned checkout flow → 23% increase in conversion\n• Built and maintained design system with 200+ components\n• Conducted 40+ user interviews and usability studies" }],
      projects: [{ name: "Healthcare App Redesign", description: "Redesigned patient booking flow reducing drop-off by 35%", technologies: ["Figma", "Maze", "Hotjar"] }],
      certifications: [{ name: "Google UX Design", issuer: "Coursera", date: "2021" }],
      achievements: [],
      languages: [{ name: "English", proficiency: "fluent" }],
    },
  },
];

const colorMap = {
  brand: "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border-[var(--color-brand-500)]/20",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  pink: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

const ResumeGallery = () => {
  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "presets"
  const [personalResumes, setPersonalResumes] = useState([]);
  const [loadingPersonal, setLoadingPersonal] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [downloadingResume, setDownloadingResume] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  const downloadRef = useRef();
  const navigate = useNavigate();

  // Fetch user resumes on mount
  const fetchPersonalResumes = async () => {
    setLoadingPersonal(true);
    try {
      const res = await api.get("/resumes");
      setPersonalResumes(res.data.resumes || []);
      // If user has no resumes, default to presets tab
      if ((res.data.resumes || []).length === 0) {
        setActiveTab("presets");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch your resumes");
    } finally {
      setLoadingPersonal(false);
    }
  };

  useEffect(() => {
    fetchPersonalResumes();
  }, []);

  // Delete Resume
  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this resume?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success("Resume deleted");
      setPersonalResumes(prev => prev.filter(r => r._id !== id));
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  // Share Resume link
  const handleShareResume = (id, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/resume/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Public sharing link copied to clipboard! 🔗");
  };

  // Download PDF
  const handleDownloadPDF = (resume, e) => {
    e.stopPropagation();
    setDownloadingResume(resume);
  };

  // Trigger actual html2pdf generation when downloadingResume is set
  useEffect(() => {
    if (!downloadingResume) return;

    const generatePDF = async () => {
      const loadToast = toast.loading("Building PDF layout... ⏳");
      try {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = downloadRef.current;
        if (!element) throw new Error("Target template element not rendered");

        const opt = {
          margin: 0,
          filename: `${downloadingResume.personal?.fullName || downloadingResume.personalInfo?.fullName || "resume"}_resume.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        await html2pdf().set(opt).from(element).save();
        toast.success("PDF downloaded successfully! 📥", { id: loadToast });
      } catch (err) {
        toast.error("Failed to generate PDF. Please try again.", { id: loadToast });
        console.error(err);
      } finally {
        setDownloadingResume(null);
      }
    };

    const timer = setTimeout(() => {
      generatePDF();
    }, 200);

    return () => clearTimeout(timer);
  }, [downloadingResume]);

  const renderTemplate = (r) => {
    if (!r) return null;
    const templateType = r.template;
    switch (templateType) {
      case "minimal": return <MinimalTemplate resume={r} />;
      case "professional": return <ProfessionalTemplate resume={r} />;
      default: return <ModernTemplate resume={r} />;
    }
  };

  return (
    <DashboardLayout title="Document Gallery">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden glass rounded-3xl p-8 border border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
          <div className="space-y-2 max-w-xl z-10">
            <h2 className="text-2xl font-bold tracking-tight text-main">
              Resume Gallery & Templates 🎯
            </h2>
            <p className="text-muted text-xs leading-relaxed">
              Organize, share, and export your personal documents, or browse our tailored preset career templates to bootstrap your resume profile with Gemini-powered logic.
            </p>
          </div>
          <Link
            to="/resume/new"
            className="btn-primary flex items-center justify-center gap-2 text-xs font-bold shrink-0 self-start md:self-center"
          >
            <Plus size={16} className="stroke-[3px]" /> Create From Scratch
          </Link>
        </motion.div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-subtle pb-px">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold relative transition-colors cursor-pointer ${activeTab === "personal" ? "text-accent" : "text-muted hover:text-main"}`}
            >
              <FolderGit size={14} /> My Documents
              {personalResumes.length > 0 && (
                <span className="ml-1 bg-accent/15 text-accent border border-accent/20 px-1.5 py-0.5 text-[9px] rounded-md font-bold">
                  {personalResumes.length}
                </span>
              )}
              {activeTab === "personal" && (
                <motion.div layoutId="activeGalleryTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold relative transition-colors cursor-pointer ${activeTab === "presets" ? "text-accent" : "text-muted hover:text-main"}`}
            >
              <BookOpen size={14} /> Career Templates
              <span className="ml-1 bg-[var(--color-border-subtle)] text-muted px-1.5 py-0.5 text-[9px] rounded-md font-bold">
                {exampleResumes.length}
              </span>
              {activeTab === "presets" && (
                <motion.div layoutId="activeGalleryTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          </div>
        </div>

        {/* Active Tab Screen */}
        <AnimatePresence mode="wait">
          {activeTab === "personal" ? (
            <motion.div
              key="personal-docs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {loadingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="glass rounded-2xl h-56 border border-subtle animate-pulse p-6 space-y-4">
                      <div className="flex justify-between">
                        <div className="w-10 h-10 rounded-xl bg-subtle" />
                        <div className="w-20 h-6 rounded-md bg-subtle" />
                      </div>
                      <div className="h-6 w-3/4 rounded bg-subtle" />
                      <div className="h-4 w-1/2 rounded bg-subtle" />
                      <div className="pt-6 border-t border-subtle flex justify-between">
                        <div className="w-16 h-8 rounded bg-subtle" />
                        <div className="w-20 h-8 rounded bg-subtle" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : personalResumes.length === 0 ? (
                <div className="glass border border-subtle rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto mt-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 animate-bounce-slow">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-main mb-2">No documents found</h3>
                  <p className="text-muted text-xs mb-8 max-w-xs leading-relaxed">
                    You haven't built any resumes yet. Start creating your first professional document or explore preset designs.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/resume/new" className="btn-primary text-xs font-bold flex items-center gap-2">
                      <Plus size={14} className="stroke-[3px]" /> Create New
                    </Link>
                    <button onClick={() => setActiveTab("presets")} className="btn-secondary text-xs font-bold">
                      Browse Preset Templates
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personalResumes.map((res, i) => (
                    <motion.div
                      key={res._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedResume(res)}
                      className="glass glass-hover rounded-2xl border border-subtle p-6 flex flex-col justify-between group cursor-pointer relative"
                    >
                      <div>
                        {/* Upper row: icon, template type, ats badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                            <FileText size={18} />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted font-bold tracking-wider uppercase bg-surface-hover px-2.5 py-0.5 rounded-full border border-subtle capitalize">
                              {res.template}
                            </span>
                            
                            {res.atsScore ? (
                              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                ATS: {res.atsScore}%
                              </span>
                            ) : (
                              <span className="text-[9px] text-muted tracking-wider uppercase font-semibold bg-surface border border-subtle px-1.5 py-0.5 rounded-md">
                                Unscanned
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title and details */}
                        <h4 className="text-sm font-bold text-main group-hover:text-accent transition-colors leading-snug">
                          {res.title || "Untitled Resume"}
                        </h4>
                        <p className="text-[11px] text-muted mt-2 font-medium">
                          {res.personal?.fullName || res.personalInfo?.fullName || "No contact name"}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-subtle/50 mt-6 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10.5px] text-muted">
                          <Clock size={12} />
                          <span>{new Date(res.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        </div>
                        
                        {/* Compact Action Icons */}
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <Link
                            to={`/resume/${res._id}/edit`}
                            title="Edit Document"
                            className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all"
                          >
                            <Edit size={12} />
                          </Link>
                          
                          <Link
                            to={`/jobs/match?resumeId=${res._id}`}
                            title="ATS Job Match Analysis"
                            className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-accent transition-all"
                          >
                            <Target size={12} />
                          </Link>
                          
                          <button
                            onClick={(e) => handleShareResume(res._id, e)}
                            title="Share Link"
                            className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                          >
                            <Share2 size={12} />
                          </button>
                          
                          <button
                            onClick={(e) => handleDownloadPDF(res, e)}
                            title="Download PDF"
                            className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                          >
                            <Download size={12} />
                          </button>
                          
                          <button
                            onClick={(e) => handleDeleteResume(res._id, e)}
                            title="Delete"
                            className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 flex items-center justify-center text-red-500 transition-all cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preset-inspo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {exampleResumes.map((ex, i) => (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPreset(ex)}
                  className="glass glass-hover rounded-2xl border border-subtle overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Mini visual mockup preview of template */}
                    <div className="h-40 bg-white dark:bg-[#151515] overflow-hidden relative border-b border-subtle">
                      <div className="transform scale-[0.3] origin-top-left w-[333%] pointer-events-none select-none opacity-85 group-hover:opacity-100 transition-opacity">
                        {renderTemplate(ex.resume)}
                      </div>
                      {/* Dark overlay showing on card hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2 px-4">
                        <span className="flex items-center gap-1.5 text-white text-[11px] font-semibold bg-accent px-3 py-1.5 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
                          <Eye size={12} className="stroke-[2.5px]" /> Quick Preview
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl bg-surface-hover w-9 h-9 rounded-xl flex items-center justify-center border border-subtle">
                          {ex.emoji}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${colorMap[ex.color]} font-semibold capitalize tracking-wide`}>
                          {ex.resume.template} Layout
                        </span>
                      </div>
                      
                      <h3 className="text-main font-bold text-sm tracking-tight pt-1">
                        {ex.label}
                      </h3>
                      
                      <p className="text-muted text-[11.5px] leading-relaxed line-clamp-2">
                        {ex.desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-5 pt-0 border-t border-subtle/30 mt-4">
                    <div className="flex gap-2 pt-4" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPreset(ex)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold btn-secondary flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye size={12} /> Inspect
                      </button>
                      <Link
                        to="/resume/new"
                        state={{ presetResume: ex.resume, presetName: ex.label }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold btn-primary flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Use structure <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden container for PDF downloading */}
        {downloadingResume && (
          <div 
            ref={downloadRef}
            style={{ 
              position: "absolute", 
              left: "-9999px", 
              top: "-9999px", 
              width: "816px", // standard letter width
              background: "var(--color-bg-base)",
              color: "var(--color-text-main)"
            }}
          >
            {renderTemplate({
              ...downloadingResume,
              personal: downloadingResume.personal || downloadingResume.personalInfo
            })}
          </div>
        )}

        {/* Personal Resume Preview Modal */}
        <AnimatePresence>
          {selectedResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedResume(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-3xl border border-subtle w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-subtle shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-main font-bold text-sm leading-tight">
                        {selectedResume.title}
                      </h3>
                      <p className="text-muted text-[11px] mt-0.5">
                        {selectedResume.template} template · Last updated {new Date(selectedResume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/resume/${selectedResume._id}/edit`}
                      className="text-xs px-3.5 py-2 rounded-xl btn-secondary font-medium flex items-center gap-1.5"
                    >
                      <Edit size={13} /> Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        handleDownloadPDF(selectedResume, e);
                        setSelectedResume(null);
                      }}
                      className="text-xs px-4 py-2 rounded-xl btn-primary font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} /> Export PDF
                    </button>
                    <button
                      onClick={() => setSelectedResume(null)}
                      className="w-9 h-9 rounded-xl bg-surface-hover hover:bg-subtle flex items-center justify-center text-muted hover:text-main transition-colors border border-subtle"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Modal preview box */}
                <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-[#0c0c0c] p-4 sm:p-8">
                  <div className="max-w-3xl mx-auto shadow-2xl bg-white rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800">
                    {renderTemplate(selectedResume)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preset Gallery Preview Modal */}
        <AnimatePresence>
          {selectedPreset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPreset(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-3xl border border-subtle w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-subtle shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-10 h-10 rounded-xl bg-surface border border-subtle flex items-center justify-center">
                      {selectedPreset.emoji}
                    </span>
                    <div>
                      <h3 className="text-main font-bold text-sm leading-tight">
                        {selectedPreset.label}
                      </h3>
                      <p className="text-muted text-[11px] mt-0.5">
                        Blueprint layout using {selectedPreset.resume.template} template
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      to="/resume/new"
                      state={{ presetResume: selectedPreset.resume, presetName: selectedPreset.label }}
                      className="text-xs px-4 py-2 rounded-xl btn-primary font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      Use Structure & Edit <ArrowRight size={12} />
                    </Link>
                    <button
                      onClick={() => setSelectedPreset(null)}
                      className="w-9 h-9 rounded-xl bg-surface-hover hover:bg-subtle flex items-center justify-center text-muted hover:text-main transition-colors border border-subtle"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Modal preview box */}
                <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-[#0c0c0c] p-4 sm:p-8">
                  <div className="max-w-3xl mx-auto shadow-2xl bg-white rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800">
                    {renderTemplate(selectedPreset.resume)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ResumeGallery;
