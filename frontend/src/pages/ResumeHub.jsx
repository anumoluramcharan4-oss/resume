// ==========================================
// src/pages/ResumeHub.jsx
// ==========================================
// Premium SaaS-level Resume Hub & analytics cockpit.

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Archive,
  RotateCcw,
  Share2,
  Calendar,
  Sparkles,
  Target,
  Download,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Loader2,
  QrCode,
  Upload,
  Briefcase,
  Printer,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ATSFriendlyTemplate from "../components/templates/ATSFriendlyTemplate";
import api from "../services/api";
import toast from "react-hot-toast";

// ---- Example resume data for each persona (presets) ----
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

const ResumeHub = () => {
  const navigate = useNavigate();

  // State Variables
  const [resumes, setResumes] = useState([]);
  const [activeHubTab, setActiveHubTab] = useState("documents"); // "documents" | "presets"
  const [metrics, setMetrics] = useState({
    totalResumes: 0,
    activeResumes: 0,
    archivedResumes: 0,
    averageAtsScore: 0,
    totalViews: 0,
    totalDownloads: 0
  });
  const [loading, setLoading] = useState(true);

  // Search/Filter/Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // "active" | "archived" | "all"
  const [sortBy, setSortBy] = useState("updatedAt"); // "updatedAt" | "title" | "atsScore"

  // Interaction Panels/Modals
  const [previewResume, setPreviewResume] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState("modern");
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewFullScreen, setPreviewFullScreen] = useState(false);

  const [shareConfigResume, setShareConfigResume] = useState(null);
  const [isSharePublic, setIsSharePublic] = useState(true);
  const [shareExpiry, setShareExpiry] = useState("");
  const [shareData, setShareData] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);

  const [aiScanResume, setAiScanResume] = useState(null);
  const [aiScanData, setAiScanData] = useState(null);
  const [aiScanLoading, setAiScanLoading] = useState(false);

  const [versionHistoryResume, setVersionHistoryResume] = useState(null);
  const [versions, setVersions] = useState([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [selectedVersionForPreview, setSelectedVersionForPreview] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [compareResults, setCompareResults] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // AI Resume Importer Modal states
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importTitle, setImportTitle] = useState("");
  const [importing, setImporting] = useState(false);
  const [importStep, setImportStep] = useState(1); // 1 = input, 2 = processing, 3 = summary
  const [importStatus, setImportStatus] = useState("");
  const [importedResume, setImportedResume] = useState(null);

  // File loading handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      toast.success("Redirecting to PDF Resume Importer...");
      setIsImportModalOpen(false);
      navigate("/resume/import", { state: { droppedFile: file } });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setImportText(content);
      if (!importTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setImportTitle(cleanName);
      }
      toast.success(`Loaded text from ${file.name}!`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      toast.success("Redirecting to PDF Resume Importer...");
      setIsImportModalOpen(false);
      navigate("/resume/import", { state: { droppedFile: file } });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setImportText(content);
      if (!importTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setImportTitle(cleanName);
      }
      toast.success(`Loaded text from ${file.name}!`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsText(file);
  };

  // Import handler
  const handleImportResume = async () => {
    if (!importText.trim()) {
      toast.error("Please provide previous resume content.");
      return;
    }

    setImporting(true);
    setImportStep(2);
    setImportStatus("Reading profile document...");

    const statusSequence = [
      { text: "Structuring contact info & summary...", delay: 1500 },
      { text: "Analyzing employment history & projects...", delay: 3000 },
      { text: "Mapping tech stack and education details...", delay: 4500 },
      { text: "Running ATS evaluation scans...", delay: 6000 },
      { text: "Wrapping up final document...", delay: 7500 }
    ];

    const timers = [];
    statusSequence.forEach((phase) => {
      const t = setTimeout(() => {
        setImportStatus(phase.text);
      }, phase.delay);
      timers.push(t);
    });

    try {
      const response = await api.post("/resumes/import", {
        resumeText: importText,
        title: importTitle
      });

      // Clear timers
      timers.forEach(t => clearTimeout(t));

      setImportedResume(response.data);
      setImportStep(3);
      toast.success("Resume parsed and imported successfully! 🎉");
      fetchResumes(); // Refresh lists
    } catch (err) {
      timers.forEach(t => clearTimeout(t));
      console.error("Import error:", err);
      toast.error(err.response?.data?.message || "Failed to parse resume.");
      setImportStep(1); // Go back to edit
    } finally {
      setImporting(false);
    }
  };

  // Reset import states
  const resetImportStates = () => {
    setIsImportModalOpen(false);
    setImportText("");
    setImportTitle("");
    setImportStep(1);
    setImportStatus("");
    setImportedResume(null);
  };

  // Fetch Resumes from API
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        sortBy
      });
      
      const res = await api.get(`/resumes?${queryParams.toString()}`);
      setResumes(res.data.resumes || []);
      if (res.data.metrics) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResumes();
    }, 300); // Debounce search changes
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, sortBy]);

  // Archive Resume
  const handleArchive = async (id, e) => {
    e.stopPropagation();
    try {
      await api.post(`/resumes/${id}/archive`);
      toast.success("Resume archived!");
      fetchResumes();
    } catch {
      toast.error("Failed to archive resume");
    }
  };

  // Restore Resume
  const handleRestore = async (id, e) => {
    e.stopPropagation();
    try {
      await api.post(`/resumes/${id}/restore`);
      toast.success("Resume restored!");
      fetchResumes();
    } catch {
      toast.error("Failed to restore resume");
    }
  };

  // Duplicate Resume
  const handleDuplicate = async (id, e) => {
    e.stopPropagation();
    try {
      await api.post(`/resumes/${id}/duplicate`);
      toast.success("Resume duplicated!");
      fetchResumes();
    } catch {
      toast.error("Failed to duplicate resume");
    }
  };

  // Delete Resume
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this resume and all its version history?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success("Resume deleted permanently!");
      fetchResumes();
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  // Open Share Config
  const openShareConfig = async (resume, e) => {
    e.stopPropagation();
    setShareConfigResume(resume);
    setShareLoading(true);
    try {
      const res = await api.get(`/resumes/${resume._id}/share`);
      if (res.data.share) {
        setShareData(res.data.share);
        setIsSharePublic(res.data.share.isPublic);
        if (res.data.share.expiresAt) {
          setShareExpiry(new Date(res.data.share.expiresAt).toISOString().split("T")[0]);
        } else {
          setShareExpiry("");
        }
      } else {
        setShareData(null);
        setIsSharePublic(true);
        setShareExpiry("");
      }
    } catch (err) {
      toast.error("Failed to load share settings");
    } finally {
      setShareLoading(false);
    }
  };

  // Save Share Configuration
  const saveShareSettings = async () => {
    if (!shareConfigResume) return;
    try {
      setShareLoading(true);
      const res = await api.post(`/resumes/${shareConfigResume._id}/share`, {
        isPublic: isSharePublic,
        expiresAt: shareExpiry ? new Date(shareExpiry) : null
      });
      setShareData(res.data.share);
      toast.success("Share settings saved!");
    } catch (err) {
      toast.error("Failed to configure sharing");
    } finally {
      setShareLoading(false);
    }
  };

  // Open AI Scan Panel
  const openAiScan = async (resume, e) => {
    e.stopPropagation();
    setAiScanResume(resume);
    setAiScanData(resume.aiAnalysis || null);
  };

  // Trigger Gemini Analysis
  const runAiAnalysis = async () => {
    if (!aiScanResume) return;
    setAiScanLoading(true);
    const loadToast = toast.loading("Gemini is analyzing your resume keywords, format, and ATS score... ⏳");
    try {
      const res = await api.post(`/resumes/${aiScanResume._id}/analyze`);
      setAiScanData(res.data.analysis);
      toast.success("AI analysis complete! Score updated.", { id: loadToast });
      fetchResumes();
    } catch (err) {
      console.error(err);
      toast.error("Gemini AI scan failed. Verify API key config.", { id: loadToast });
    } finally {
      setAiScanLoading(false);
    }
  };

  // Fetch Version History
  const openVersionHistory = async (resume, e) => {
    e.stopPropagation();
    setVersionHistoryResume(resume);
    setVersionsLoading(true);
    try {
      const res = await api.get(`/resumes/${resume._id}/versions`);
      setVersions(res.data.versions || []);
      setSelectedVersionForPreview(null);
    } catch {
      toast.error("Could not retrieve version timeline");
    } finally {
      setVersionsLoading(false);
    }
  };

  // Restore Version Snapshot
  const handleRestoreVersion = async (versionId) => {
    if (!versionHistoryResume) return;
    if (!confirm("Are you sure you want to restore this version? This will update your active resume and save a snapshot of the current state.")) return;
    
    try {
      const res = await api.post(`/resumes/${versionHistoryResume._id}/versions/${versionId}/restore`);
      toast.success(res.data.message || "Version restored successfully!");
      setVersionHistoryResume(null);
      fetchResumes();
    } catch (err) {
      toast.error("Failed to restore version snapshot");
    }
  };

  // Compare Version Snapshots
  const handleCompareVersions = async () => {
    if (selectedCompareIds.length !== 2) {
      toast.error("Please select exactly two versions to compare.");
      return;
    }
    setCompareLoading(true);
    try {
      const res = await api.get(`/resumes/${versionHistoryResume._id}/compare-versions?versionIdA=${selectedCompareIds[0]}&versionIdB=${selectedCompareIds[1]}`);
      setCompareResults(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to compare versions.");
    } finally {
      setCompareLoading(false);
    }
  };

  // Download PDF
  const handleDownloadPDF = async (resume, e) => {
    if (e) e.stopPropagation();
    const loadToast = toast.loading("Building PDF layout... ⏳");
    try {
      // Track export
      try {
        await api.post(`/resumes/${resume._id}/track-export`);
      } catch (err) {
        console.warn("Export tracking failed:", err);
      }

      // Generate client-side PDF
      const html2pdf = (await import("html2pdf.js")).default;
      
      // Temporary container for rendering the PDF layout
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "794px"; // A4 width at 96 DPI
      document.body.appendChild(tempDiv);
      
      // Render layout inside target element
      const reactDom = (await import("react-dom/client")).default;
      const root = reactDom.createRoot(tempDiv);
      
      const props = { resume };
      let templateComponent;
      switch (resume.template) {
        case "minimal": templateComponent = <MinimalTemplate {...props} />; break;
        case "professional": templateComponent = <ProfessionalTemplate {...props} />; break;
        case "ats-friendly": templateComponent = <ATSFriendlyTemplate {...props} />; break;
        default: templateComponent = <ModernTemplate {...props} />; break;
      }
      
      root.render(templateComponent);
      
      // Give React time to complete rendering
      setTimeout(async () => {
        const opt = {
          margin: 0,
          filename: `${resume.personal?.fullName || "resume"}_resume.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        
        await html2pdf().set(opt).from(tempDiv).save();
        document.body.removeChild(tempDiv);
        toast.success("PDF exported successfully! 📥", { id: loadToast });
        fetchResumes();
      }, 300);
      
    } catch (err) {
      toast.error("Failed to generate PDF. Please try again.", { id: loadToast });
      console.error(err);
    }
  };

  const renderPreviewTemplate = (resumeObj) => {
    const props = { resume: resumeObj };
    switch (previewTemplate) {
      case "minimal": return <MinimalTemplate {...props} />;
      case "professional": return <ProfessionalTemplate {...props} />;
      case "ats-friendly": return <ATSFriendlyTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  return (
    <DashboardLayout title="Resume Hub">
      <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
        
        {/* Dashboard Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden glass rounded-3xl p-6 sm:p-8 border border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
          <div className="space-y-2 max-w-xl z-10">
            <h2 className="text-2xl font-bold tracking-tight text-main">
              Resume Control Center 🎯
            </h2>
            <p className="text-muted text-xs leading-relaxed max-w-lg">
              Manage, analyze, and customize multiple versions of your resumes. Evaluate your ATS scores with Gemini AI, configure public recruiter sharing, and export premium print-ready documents.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 self-start md:self-center z-10 w-full sm:w-auto">
            <Link
              to="/resume/import"
              className="btn-secondary flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer py-2.5 px-4"
            >
              <Upload size={14} /> Import Resume
            </Link>
            <Link
              to="/resume/new"
              className="btn-primary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer py-2.5 px-4"
            >
              <Plus size={14} className="stroke-[3px]" /> Create Resume
            </Link>
          </div>
        </motion.div>

        {/* METRICS DASHBOARD CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Resumes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-2xl p-5 border border-subtle flex items-center gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Total Resumes</p>
              <h3 className="text-xl font-extrabold text-main mt-0.5">{metrics.totalResumes}</h3>
            </div>
          </motion.div>

          {/* Card 2: Average ATS Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-5 border border-subtle flex items-center gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Avg ATS Score</p>
              <h3 className="text-xl font-extrabold text-main mt-0.5">{metrics.averageAtsScore}%</h3>
            </div>
          </motion.div>

          {/* Card 3: Total Recruiter Views */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 border border-subtle flex items-center gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Resume Views</p>
              <h3 className="text-xl font-extrabold text-main mt-0.5">{metrics.totalViews}</h3>
            </div>
          </motion.div>

          {/* Card 4: Total Exports */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5 border border-subtle flex items-center gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Download size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Downloads</p>
              <h3 className="text-xl font-extrabold text-main mt-0.5">{metrics.totalDownloads}</h3>
            </div>
          </motion.div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-subtle pb-px mb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveHubTab("documents")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold relative transition-colors cursor-pointer ${
                activeHubTab === "documents" ? "text-accent font-bold" : "text-muted hover:text-main"
              }`}
            >
              My Documents
              {activeHubTab === "documents" && (
                <motion.div layoutId="activeHubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveHubTab("presets")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold relative transition-colors cursor-pointer ${
                activeHubTab === "presets" ? "text-accent font-bold" : "text-muted hover:text-main"
              }`}
            >
              Career Templates (Presets)
              {activeHubTab === "presets" && (
                <motion.div layoutId="activeHubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          </div>
        </div>

        {activeHubTab === "documents" && (
          <>
            {/* SEARCH, FILTER & SORT BAR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-subtle pb-6">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl input-dark text-xs placeholder-muted/50 leading-relaxed"
              placeholder="Search by resume title or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filters */}
            <div className="flex rounded-lg bg-surface/30 border border-subtle p-0.5">
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === "active" ? "bg-accent text-black shadow-sm" : "text-muted hover:text-main"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("archived")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === "archived" ? "bg-accent text-black shadow-sm" : "text-muted hover:text-main"
                }`}
              >
                Archived
              </button>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === "all" ? "bg-accent text-black shadow-sm" : "text-muted hover:text-main"
                }`}
              >
                All
              </button>
            </div>

            {/* Sorting select */}
            <div className="relative">
              <select
                className="appearance-none bg-surface/30 border border-subtle hover:border-focus rounded-xl pl-3.5 pr-8 py-2 text-[11px] font-bold text-muted hover:text-main transition-all outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updatedAt">Sort: Last Updated</option>
                <option value="title">Sort: Title A-Z</option>
                <option value="atsScore">Sort: ATS Score</option>
                <option value="createdAt">Sort: Created Date</option>
              </select>
              <ChevronDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
            </div>
          </div>
        </div>

        {/* RESUME GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-3xl h-60 border border-subtle animate-pulse p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="w-10 h-10 rounded-xl bg-subtle" />
                  <div className="w-24 h-6 rounded-full bg-subtle" />
                </div>
                <div className="h-6 w-3/4 rounded bg-subtle" />
                <div className="h-4 w-1/2 rounded bg-subtle" />
                <div className="pt-6 border-t border-subtle/50 flex justify-between">
                  <div className="w-16 h-8 rounded bg-subtle" />
                  <div className="w-20 h-8 rounded bg-subtle" />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass border border-subtle rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto mt-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6">
              <FileText size={28} />
            </div>
            <h3 className="text-md font-bold text-main mb-2">No documents found</h3>
            <p className="text-muted text-xs mb-8 max-w-xs leading-relaxed">
              No resumes match your criteria. Try widening your search or build your first resume now.
            </p>
            <Link to="/resume/new" className="btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer">
              <Plus size={14} className="stroke-[3px]" /> Create New Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((res, i) => (
              <motion.div
                key={res._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  setPreviewResume(res);
                  setPreviewTemplate(res.template || "modern");
                }}
                className={`glass glass-hover rounded-3xl border p-6 flex flex-col justify-between group cursor-pointer relative ${
                  res.isArchived ? "border-amber-500/20 bg-amber-500/[0.01]" : "border-subtle"
                }`}
              >
                <div>
                  {/* Card upper row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                      <FileText size={18} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted font-bold tracking-wider uppercase bg-surface-hover px-2.5 py-0.5 rounded-full border border-subtle capitalize">
                        {res.template || "modern"}
                      </span>
                      {res.isArchived && (
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                          Archived
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title and details */}
                  <h4 className="text-sm font-bold text-main group-hover:text-accent transition-colors leading-snug truncate">
                    {res.title || "Untitled Resume"}
                  </h4>
                  <p className="text-[11px] text-muted mt-1 font-medium truncate">
                    {res.personal?.fullName || "No Name Configured"}
                  </p>

                  {/* Profile Completion percentage */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted">
                      <span>Completion</span>
                      <span>{res.completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-subtle rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-yellow-500 rounded-full transition-all duration-300"
                        style={{ width: `${res.completionPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Score and Analytics Bottom Row */}
                <div className="mt-6 space-y-4 border-t border-subtle/50 pt-4">
                  <div className="flex items-center justify-between">
                    {/* ATS Badge */}
                    {res.atsScore ? (
                      <div 
                        onClick={(e) => openAiScan(res, e)}
                        className="flex items-center gap-1.5 text-[10.5px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg hover:bg-green-500/25 transition-all"
                      >
                        <Target size={12} />
                        <span>ATS: {res.atsScore}%</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => openAiScan(res, e)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg hover:bg-purple-500/25 transition-all cursor-pointer"
                      >
                        <Sparkles size={11} />
                        <span>Scan ATS</span>
                      </button>
                    )}

                    {/* View Metrics */}
                    <div className="flex items-center gap-3 text-[10px] text-muted font-medium">
                      <span title="Views count">👁️ {res.viewsCount || 0}</span>
                      <span title="Downloads count">📥 {res.downloadsCount || 0}</span>
                    </div>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/resume/${res._id}/edit`}
                        title="Edit Resume Builder"
                        className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                      >
                        <Edit size={12} />
                      </Link>

                      <button
                        onClick={(e) => openVersionHistory(res, e)}
                        title="Version Timeline"
                        className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                      >
                        <Clock size={12} />
                      </button>

                      <Link
                        to="/resume/import"
                        state={{ resumeId: res._id, originalPdfName: res.originalPdfName }}
                        title="Re-upload Resume PDF"
                        className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                      >
                        <Upload size={12} />
                      </Link>

                      <button
                        onClick={(e) => openShareConfig(res, e)}
                        title="Recruiter Sharing Settings"
                        className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                      >
                        <Share2 size={12} />
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(res)}
                        title="Export PDF"
                        className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                      >
                        <Download size={12} />
                      </button>
                    </div>

                    {/* Right align helper operations */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDuplicate(res._id, e)}
                        title="Duplicate Resume"
                        className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main transition-all cursor-pointer"
                      >
                        <Copy size={12} />
                      </button>

                      {res.isArchived ? (
                        <button
                          onClick={(e) => handleRestore(res._id, e)}
                          title="Restore Resume"
                          className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/25 flex items-center justify-center text-amber-500 transition-all cursor-pointer"
                        >
                          <RotateCcw size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleArchive(res._id, e)}
                          title="Archive Resume"
                          className="w-7 h-7 rounded-lg bg-surface border border-subtle hover:border-amber-500/30 flex items-center justify-center text-muted hover:text-amber-500 transition-all cursor-pointer"
                        >
                          <Archive size={12} />
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDelete(res._id, e)}
                        title="Delete Permanently"
                        className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 flex items-center justify-center text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
          </>
        )}

        {activeHubTab === "presets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleResumes.map((ex) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass glass-hover rounded-3xl border border-subtle overflow-hidden flex flex-col justify-between group transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl bg-surface-hover w-10 h-10 rounded-xl flex items-center justify-center border border-subtle">
                      {ex.emoji}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${colorMap[ex.color]} font-bold capitalize tracking-wide`}>
                      {ex.resume.template} Layout
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-main font-bold text-sm tracking-tight pt-1">
                      {ex.label}
                    </h4>
                    <p className="text-muted text-[11px] leading-relaxed mt-2 line-clamp-2">
                      {ex.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-subtle/30 mt-4 flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setPreviewResume(ex.resume);
                      setPreviewTemplate(ex.resume.template);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold btn-secondary flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={12} /> Inspect
                  </button>
                  <Link
                    to="/resume/new"
                    state={{ presetResume: ex.resume, presetName: ex.label }}
                    className="flex-1 py-2 rounded-xl text-xs font-bold btn-primary flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Use Structure <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 1. PROFESSIONAL PREVIEW MODAL */}
        <AnimatePresence>
          {previewResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
              onClick={() => setPreviewResume(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`glass border border-subtle flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
                  previewFullScreen ? "fixed inset-0 rounded-none w-screen h-screen" : "rounded-3xl w-full max-w-4xl h-[90vh]"
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-subtle shrink-0 gap-4 bg-surface/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h3 className="text-main font-bold text-sm leading-tight max-w-[200px] sm:max-w-none truncate">
                        {previewResume.title}
                      </h3>
                      <p className="text-muted text-[10px] mt-0.5">
                        Profile Completion: {previewResume.completionPercentage || 0}%
                      </p>
                    </div>
                  </div>

                  {/* Template selector inside preview */}
                  <div className="flex items-center gap-1.5 bg-surface/50 border border-subtle rounded-xl p-1">
                    {["modern", "minimal", "professional", "ats-friendly"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setPreviewTemplate(t)}
                        className={`px-2.5 py-1 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          previewTemplate === t ? "bg-accent text-black shadow-sm" : "text-muted hover:text-main"
                        }`}
                      >
                        {t.replace("-", " ")}
                      </button>
                    ))}
                  </div>

                  {/* Zoom, Print and PDF controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.15))}
                      title="Zoom Out"
                      className="w-8 h-8 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main cursor-pointer"
                    >
                      <ZoomOut size={13} />
                    </button>
                    <span className="text-[10px] font-bold text-muted w-8 text-center">{Math.round(previewZoom * 100)}%</span>
                    <button
                      onClick={() => setPreviewZoom(Math.min(1.5, previewZoom + 0.15))}
                      title="Zoom In"
                      className="w-8 h-8 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main cursor-pointer"
                    >
                      <ZoomIn size={13} />
                    </button>

                    <button
                      onClick={() => setPreviewFullScreen(!previewFullScreen)}
                      title="Toggle Fullscreen"
                      className="w-8 h-8 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main cursor-pointer ml-1"
                    >
                      {previewFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    </button>

                    <button
                      onClick={() => window.print()}
                      title="Print Document"
                      className="w-8 h-8 rounded-lg bg-surface border border-subtle hover:border-focus flex items-center justify-center text-muted hover:text-main cursor-pointer"
                    >
                      <Printer size={13} />
                    </button>

                    {previewResume && previewResume._id ? (
                      <>
                        <Link
                          to={`/resume/${previewResume._id}/edit`}
                          className="text-xs px-3.5 py-1.5 rounded-xl btn-secondary font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit size={12} /> Edit
                        </Link>
                        <button
                          onClick={() => {
                            handleDownloadPDF({ ...previewResume, template: previewTemplate });
                          }}
                          className="text-xs px-3.5 py-1.5 rounded-xl btn-primary font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={13} /> Export
                        </button>
                      </>
                    ) : (
                      previewResume && (
                        <Link
                          to="/resume/new"
                          state={{ presetResume: previewResume, presetName: previewResume.personal?.fullName ? `${previewResume.personal.fullName}'s Template` : "Template" }}
                          className="text-xs px-3.5 py-1.5 rounded-xl btn-primary font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <ArrowRight size={12} /> Use Structure
                        </Link>
                      )
                    )}

                    <button
                      onClick={() => setPreviewResume(null)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center text-red-500 cursor-pointer ml-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Preview Box content */}
                <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-[#08080a] p-4 sm:p-8 flex items-start justify-center">
                  <div 
                    className="shadow-2xl bg-white rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 transition-transform duration-200"
                    style={{ 
                      width: "794px", 
                      minHeight: "1123px",
                      transform: `scale(${previewZoom})`, 
                      transformOrigin: "top center",
                      marginBottom: `${(previewZoom - 1) * 1123}px` // offsets scaled down document layout height in flexbox
                    }}
                  >
                    {renderPreviewTemplate(previewResume)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. RECRUITER SHARING SETTINGS OVERLAY */}
        <AnimatePresence>
          {shareConfigResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShareConfigResume(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-3xl border border-subtle w-full max-w-md p-6 overflow-hidden shadow-2xl relative"
              >
                <div className="flex justify-between items-center pb-4 border-b border-subtle mb-5">
                  <h3 className="font-bold text-main text-sm flex items-center gap-2">
                    <Share2 size={16} className="text-accent" /> Share Link & QR Settings
                  </h3>
                  <button 
                    onClick={() => setShareConfigResume(null)}
                    className="w-7 h-7 rounded-lg hover:bg-subtle flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle"
                  >
                    <X size={14} />
                  </button>
                </div>

                {shareLoading && !shareData ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-xs text-muted mt-2">Loading sharing config...</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Toggle Link Type */}
                    <div className="flex justify-between items-center p-3 rounded-xl bg-surface/30 border border-subtle">
                      <div>
                        <p className="text-xs font-bold text-main">Public Recruiter Link</p>
                        <p className="text-[10px] text-muted mt-0.5">Allow anyone with the link to view</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={isSharePublic}
                        onChange={(e) => setIsSharePublic(e.target.checked)}
                        className="rounded border-subtle bg-base text-accent focus:ring-accent w-4 h-4 cursor-pointer accent-accent"
                      />
                    </div>

                    {/* Expiration date */}
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Link Expiration Date (Optional)</label>
                      <div className="relative">
                        <input 
                          type="date"
                          value={shareExpiry}
                          onChange={(e) => setShareExpiry(e.target.value)}
                          className="w-full input-dark rounded-xl py-2 px-3.5 text-xs text-main"
                        />
                        <Calendar size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* Generate trigger */}
                    <button
                      onClick={saveShareSettings}
                      disabled={shareLoading}
                      className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {shareLoading ? "Configuring..." : shareData ? "Update Link Config" : "Generate Share Link"}
                    </button>

                    {/* Results Container */}
                    {shareData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-4 border-t border-subtle/50 space-y-4 text-center"
                      >
                        {/* QR Code visualization */}
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Recruiter QR Scan</p>
                          <div className="p-3 bg-white rounded-2xl border border-gray-200">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`${window.location.origin}/resume/shared/${shareData.shareId}`)}`}
                              alt="Resume QR Code"
                              className="w-32 h-32"
                            />
                          </div>
                        </div>

                        {/* Copy Link input group */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/resume/shared/${shareData.shareId}`}
                            className="flex-1 input-dark rounded-xl py-2 px-3.5 text-[11px] font-semibold text-accent/80 select-all"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/resume/shared/${shareData.shareId}`);
                              toast.success("Public share link copied to clipboard! 🔗");
                            }}
                            className="btn-secondary rounded-xl px-3 flex items-center justify-center text-main hover:border-focus cursor-pointer"
                          >
                            <Copy size={13} />
                          </button>
                        </div>

                        {/* Public Link Statistics */}
                        <div className="grid grid-cols-2 gap-3 text-left">
                          <div className="p-2.5 rounded-xl bg-surface/30 border border-subtle">
                            <p className="text-[9px] text-muted uppercase font-bold">Views Logged</p>
                            <p className="text-sm font-extrabold text-main mt-0.5">{shareData.viewsCount || 0}</p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-surface/30 border border-subtle">
                            <p className="text-[9px] text-muted uppercase font-bold">Downloads Logged</p>
                            <p className="text-sm font-extrabold text-main mt-0.5">{shareData.downloadsCount || 0}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. AI ATS ANALYSIS SCANS DRAWER */}
        <AnimatePresence>
          {aiScanResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end"
              onClick={() => setAiScanResume(null)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className="glass border-l border-subtle w-full max-w-md h-screen flex flex-col shadow-2xl bg-base"
              >
                {/* Header */}
                <div className="p-5 border-b border-subtle flex items-center justify-between bg-surface/30 shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-500" size={18} />
                    <span className="font-bold text-main text-sm">AI ATS Analysis Panel</span>
                  </div>
                  <button 
                    onClick={() => setAiScanResume(null)}
                    className="w-8 h-8 rounded-lg hover:bg-subtle flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                  {!aiScanData && !aiScanLoading ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Target size={28} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-main">No scans found</h4>
                        <p className="text-xs text-muted max-w-xs mt-1 leading-relaxed">
                          Analyze your resume structure, keyword match density, and format issues against recruiting standards using Gemini.
                        </p>
                      </div>
                      <button
                        onClick={runAiAnalysis}
                        className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Sparkles size={13} /> Scan Resume Now
                      </button>
                    </div>
                  ) : aiScanLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                      <p className="text-xs text-muted font-medium">Gemini AI parsing document structure...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Metric Circular scores or bars */}
                      <div className="p-5 rounded-2xl border border-subtle bg-surface/10 space-y-4">
                        <h4 className="text-xs font-bold text-main uppercase tracking-wider">ATS Score Summary</h4>
                        
                        <div className="flex items-center justify-around py-2">
                          {/* Score Metric 1: ATS Rating */}
                          <div className="text-center">
                            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/30">
                              <span className="text-sm font-extrabold text-green-500">{aiScanData.score}%</span>
                            </div>
                            <span className="text-[10px] text-muted font-bold block mt-2">ATS Rating</span>
                          </div>

                          {/* Score Metric 2: Keywords */}
                          <div className="text-center">
                            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/10 border-2 border-blue-500/30">
                              <span className="text-sm font-extrabold text-blue-500">{aiScanData.keywordMatch || 75}%</span>
                            </div>
                            <span className="text-[10px] text-muted font-bold block mt-2">Keyword Density</span>
                          </div>

                          {/* Score Metric 3: Readability */}
                          <div className="text-center">
                            <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-yellow-500/10 border-2 border-yellow-500/30">
                              <span className="text-sm font-extrabold text-yellow-500">{aiScanData.readabilityScore || 80}%</span>
                            </div>
                            <span className="text-[10px] text-muted font-bold block mt-2">Readability</span>
                          </div>
                        </div>
                      </div>

                      {/* Missing skills */}
                      {aiScanData.missingSkills?.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold text-main flex items-center gap-1.5">
                            <X className="text-red-500" size={13} /> Missing Keywords & Skills
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {aiScanData.missingSkills.map((sk, idx) => (
                              <span key={idx} className="text-[10.5px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Formatting issues */}
                      {aiScanData.formattingIssues?.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold text-main flex items-center gap-1.5">
                            <AlertCircle size={13} className="text-yellow-500" /> Layout & Formatting Issues
                          </h4>
                          <ul className="space-y-1.5">
                            {aiScanData.formattingIssues.map((issue, idx) => (
                              <li key={idx} className="text-xs text-muted flex items-start gap-2 leading-relaxed">
                                <span className="text-yellow-500 mt-0.5">•</span>
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Specific Improvement lists */}
                      {aiScanData.improvements?.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold text-main flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-green-500" /> Actionable Improvements
                          </h4>
                          <ul className="space-y-2">
                            {aiScanData.improvements.map((tip, idx) => (
                              <li key={idx} className="text-xs text-muted flex items-start gap-2.5 leading-relaxed bg-surface/30 p-2.5 border border-subtle rounded-xl">
                                <span className="text-green-500 font-bold">{idx + 1}.</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Section Feedback */}
                      {aiScanData.sectionFeedback && (
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-bold text-main uppercase tracking-wider">Sections Detailed Review</h4>
                          <div className="space-y-3">
                            {Object.entries(aiScanData.sectionFeedback).map(([section, feedback], idx) => (
                              <div key={idx} className="p-3 rounded-xl border border-subtle bg-surface/10 text-xs">
                                <p className="font-bold text-main capitalize mb-1">{section} Section</p>
                                <p className="text-muted leading-relaxed">{feedback}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Re-run scan */}
                      <button
                        onClick={runAiAnalysis}
                        disabled={aiScanLoading}
                        className="w-full btn-secondary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border border-subtle hover:border-focus"
                      >
                        <Sparkles size={13} /> Re-scan Document
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. VERSION TIMELINE TIMESTAMPS DRAWER */}
        <AnimatePresence>
          {versionHistoryResume && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end"
              onClick={() => setVersionHistoryResume(null)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className="glass border-l border-subtle w-full max-w-md h-screen flex flex-col shadow-2xl bg-base"
              >
                {/* Header */}
                <div className="p-5 border-b border-subtle flex items-center justify-between bg-surface/30 shrink-0">
                  <div className="flex items-center gap-2">
                    <Clock className="text-accent" size={18} />
                    <span className="font-bold text-main text-sm">Version Timeline History</span>
                  </div>
                  <button 
                    onClick={() => {
                      setVersionHistoryResume(null);
                      setCompareMode(false);
                      setSelectedCompareIds([]);
                      setCompareResults(null);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-subtle flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                  {/* Compare mode toggle */}
                  {versions.length > 0 && !versionsLoading && (
                    <div className="flex justify-between items-center bg-surface/20 p-3 rounded-xl border border-subtle">
                      <div>
                        <p className="text-xs font-bold text-main">Version Comparison Mode</p>
                        <p className="text-[9px] text-muted">Select any two versions to inspect differences</p>
                      </div>
                      <button
                        onClick={() => {
                          setCompareMode(!compareMode);
                          setSelectedCompareIds([]);
                          setCompareResults(null);
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          compareMode
                            ? "bg-accent text-black border-accent"
                            : "bg-surface hover:bg-subtle text-muted hover:text-main border-subtle"
                        }`}
                      >
                        {compareMode ? "Cancel" : "Compare"}
                      </button>
                    </div>
                  )}

                  {compareMode && selectedCompareIds.length === 2 && (
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl flex flex-col gap-2">
                      <button
                        onClick={handleCompareVersions}
                        disabled={compareLoading}
                        className="w-full btn-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {compareLoading ? "Running Diff Analysis..." : "Compare Selected Versions"}
                      </button>

                      {compareResults && (
                        <div className="text-left mt-1 p-3 bg-surface/90 border border-subtle rounded-xl max-h-[200px] overflow-y-auto custom-scrollbar">
                          <p className="text-[10px] font-bold text-accent uppercase tracking-wider mb-2 font-display">
                            Changes (V{compareResults.versionB.version} vs V{compareResults.versionA.version})
                          </p>
                          {compareResults.changesDetected?.length === 0 ? (
                            <p className="text-xs text-muted italic">No differences detected.</p>
                          ) : (
                            <ul className="text-xs text-muted space-y-1 pl-4 list-disc">
                              {compareResults.changesDetected?.map((change, idx) => (
                                <li key={idx} className="leading-snug">{change}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {versionsLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-10 h-10 text-accent animate-spin" />
                      <p className="text-xs text-muted font-medium">Reconstructing version history list...</p>
                    </div>
                  ) : versions.length === 0 ? (
                    <div className="py-12 text-center text-muted text-xs leading-relaxed">
                      No versions captured. Modify and save your resume to create timeline snapshots.
                    </div>
                  ) : (
                    <div className="space-y-4 relative pl-4 border-l border-subtle mt-2">
                      {versions.map((ver, idx) => (
                        <div key={ver._id} className="relative mb-6 last:mb-0">
                          {/* Timeline node */}
                          <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-base ${
                            selectedVersionForPreview?._id === ver._id && !compareMode ? "border-accent scale-125" : "border-muted"
                          }`} />
                          
                          <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            selectedVersionForPreview?._id === ver._id && !compareMode
                              ? "border-accent/40 bg-accent/[0.03]" 
                              : selectedCompareIds.includes(ver._id)
                              ? "border-accent/50 bg-accent/[0.02]"
                              : "border-subtle hover:border-focus bg-surface/10"
                          }`}
                          onClick={() => {
                            if (compareMode) {
                              if (selectedCompareIds.includes(ver._id)) {
                                setSelectedCompareIds(prev => prev.filter(id => id !== ver._id));
                              } else {
                                if (selectedCompareIds.length < 2) {
                                  setSelectedCompareIds(prev => [...prev, ver._id]);
                                } else {
                                  toast.error("You can only select up to 2 versions.");
                                }
                              }
                            } else {
                              setSelectedVersionForPreview(ver);
                            }
                          }}
                          >
                            <div className="flex gap-2.5 items-start">
                              {compareMode && (
                                <input
                                  type="checkbox"
                                  checked={selectedCompareIds.includes(ver._id)}
                                  readOnly
                                  className="mt-1 cursor-pointer accent-accent"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-main">Version {ver.version}</span>
                                  <span className="text-[9.5px] text-muted font-bold">
                                    {new Date(ver.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                
                                <p className="text-[11px] text-muted italic truncate leading-snug">"{ver.title || "Untitled"}" ({ver.template})</p>

                                {/* Changes list within version card */}
                                {ver.changesDetected && ver.changesDetected.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-subtle/30 space-y-1 text-left">
                                    <p className="text-[9px] font-bold text-accent uppercase tracking-wider">Changes:</p>
                                    <ul className="text-[10px] text-muted space-y-0.5 list-disc pl-3">
                                      {ver.changesDetected.map((change, cIdx) => (
                                        <li key={cIdx} className="leading-normal">{change}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Version Controls */}
                            {selectedVersionForPreview?._id === ver._id && !compareMode && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 pt-3 border-t border-subtle/50 flex gap-2"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewResume(ver);
                                    setPreviewTemplate(ver.template || "modern");
                                  }}
                                  className="flex-1 py-1.5 bg-surface hover:bg-subtle text-muted hover:text-main rounded-lg text-[10px] font-bold border border-subtle transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <Eye size={11} /> Quick View
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreVersion(ver._id);
                                  }}
                                  className="flex-1 py-1.5 bg-accent hover:bg-accent/80 text-black rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                                >
                                  <RotateCcw size={11} /> Revert Active
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. AI RESUME IMPORTER MODAL */}
        <AnimatePresence>
          {isImportModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={resetImportStates}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass border border-subtle w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-subtle bg-surface/30 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-main font-bold text-sm leading-tight">AI Resume Importer</h3>
                      <p className="text-muted text-[10px] mt-0.5">Parse, structure, and evaluate your pre-existing resume</p>
                    </div>
                  </div>
                  <button
                    onClick={resetImportStates}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-main hover:bg-surface-hover transition-colors cursor-pointer border border-subtle/50"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {importStep === 1 && (
                    <div className="space-y-5">
                      {/* Optional Title Field */}
                      <div className="space-y-1.5">
                        <label className="text-muted text-[10px] font-bold uppercase tracking-wider">
                          Resume Title <span className="text-muted/50 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2.5 rounded-xl input-dark text-xs placeholder-muted/50 outline-none border border-subtle"
                          placeholder="e.g., Senior Full Stack Developer (2026)"
                          value={importTitle}
                          onChange={(e) => setImportTitle(e.target.value)}
                        />
                      </div>

                      {/* File Drag & Drop Section */}
                      <div className="space-y-1.5">
                        <label className="text-muted text-[10px] font-bold uppercase tracking-wider">
                          Upload File
                        </label>
                        <div
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className="border border-dashed border-subtle rounded-2xl p-6 bg-surface/10 hover:bg-surface/20 transition-all flex flex-col items-center justify-center text-center cursor-pointer group hover:border-accent/40 relative overflow-hidden"
                        >
                          <input
                            type="file"
                            accept=".txt,.json"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300 mb-3 border border-accent/20">
                            <Upload size={18} />
                          </div>
                          <p className="text-main font-semibold text-xs mb-1">
                            Drag & drop file here, or <span className="text-accent underline group-hover:text-accent-muted transition-colors">browse</span>
                          </p>
                          <p className="text-muted text-[10px] max-w-xs leading-normal">
                            Supports .txt and .json files. For PDF or DOCX, please copy and paste the text in the box below.
                          </p>
                        </div>
                      </div>

                      {/* Raw Text Box */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-muted text-[10px] font-bold uppercase tracking-wider">
                            Paste Resume Text <span className="text-red-500">*</span>
                          </label>
                          {importText && (
                            <button
                              onClick={() => setImportText("")}
                              className="text-accent hover:text-accent-muted text-[10px] font-bold cursor-pointer"
                            >
                              Clear Text
                            </button>
                          )}
                        </div>
                        <textarea
                          rows={7}
                          className="w-full px-4 py-3 rounded-xl input-dark text-xs placeholder-muted/40 outline-none border border-subtle resize-y min-h-[140px] leading-relaxed font-sans"
                          placeholder="Paste the text from your previous resume doc, PDF, LinkedIn profile, or draft bio here..."
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {importStep === 2 && (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/25 shadow-lg shadow-accent/5"
                      >
                        <Sparkles size={24} className="animate-pulse" />
                      </motion.div>
                      <div className="space-y-2">
                        <h4 className="text-main font-bold text-sm tracking-tight">AI structuring in progress...</h4>
                        <p className="text-muted text-[11px] leading-relaxed max-w-xs">{importStatus}</p>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className="w-full max-w-xs h-1.5 bg-subtle rounded-full overflow-hidden relative border border-subtle/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-accent to-amber-500"
                          initial={{ width: "0%" }}
                          animate={{
                            width:
                              importStatus.includes("Reading") ? "15%" :
                              importStatus.includes("contact") ? "35%" :
                              importStatus.includes("employment") ? "55%" :
                              importStatus.includes("tech") ? "75%" :
                              importStatus.includes("ATS") ? "90%" : "98%"
                          }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}

                  {importStep === 3 && importedResume && (
                    <div className="space-y-6">
                      {/* Success banner */}
                      <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"
                        >
                          <CheckCircle2 size={24} />
                        </motion.div>
                        <div className="space-y-1">
                          <h4 className="text-main font-bold text-sm tracking-tight">Success! Resume Imported & Analyzed</h4>
                          <p className="text-muted text-[11px]">
                            CareerAI completed structuring and generated active ATS scoring insights.
                          </p>
                        </div>
                      </div>

                      {/* Brief details checklist */}
                      <div className="glass bg-surface/20 rounded-2xl p-5 border border-subtle space-y-4">
                        <div className="flex items-center justify-between border-b border-subtle/40 pb-3">
                          <div>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Document Name</p>
                            <h5 className="text-main font-bold text-xs mt-0.5">{importedResume.title}</h5>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted font-bold uppercase tracking-wider">ATS Score</p>
                            {importedResume.atsScore !== null && importedResume.atsScore !== undefined ? (
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mt-1 uppercase border ${
                                importedResume.atsScore >= 80
                                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                                  : importedResume.atsScore >= 60
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                  : "bg-red-500/10 border-red-500/30 text-red-400"
                              }`}>
                                {importedResume.atsScore}% Score
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold mt-1 uppercase border bg-purple-500/10 border-purple-500/30 text-purple-400">
                                Ready to Scan
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted">
                              <FileText size={12} className="text-accent" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Bio Summary</span>
                            </div>
                            <p className="text-main text-xs font-semibold pl-4">
                              {importedResume.about ? "Yes" : "No"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted">
                              <Briefcase size={12} className="text-accent" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Experience</span>
                            </div>
                            <p className="text-main text-xs font-semibold pl-4">
                              {importedResume.experience?.length || 0} items
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted">
                              <Sparkles size={12} className="text-accent" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Skills Found</span>
                            </div>
                            <p className="text-main text-xs font-semibold pl-4">
                              {importedResume.skills?.length || 0} skills
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted">
                              <BookOpen size={12} className="text-accent" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Education</span>
                            </div>
                            <p className="text-main text-xs font-semibold pl-4">
                              {importedResume.education?.length || 0} items
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Short AI message */}
                      <p className="text-muted text-[10px] leading-relaxed text-center px-4">
                        💡 Tip: Open the document in the builder to fine-tune parsed details, add links, select templates, or optimize layout page breaks.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-5 border-t border-subtle bg-surface/40 flex items-center justify-end gap-3 shrink-0">
                  {importStep === 1 && (
                    <>
                      <button
                        onClick={resetImportStates}
                        className="btn-secondary py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!importText.trim() || importing}
                        onClick={handleImportResume}
                        className="btn-primary py-2 px-5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                      >
                        {importing ? (
                          <>
                            <Loader2 size={13} className="animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            Process with CareerAI <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {importStep === 2 && (
                    <span className="text-[10px] text-muted/60 font-semibold italic animate-pulse">
                      Analyzing profile metadata... please wait
                    </span>
                  )}

                  {importStep === 3 && (
                    <>
                      <button
                        onClick={resetImportStates}
                        className="btn-secondary py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Close & View Dashboard
                      </button>
                      <button
                        onClick={() => {
                          const id = importedResume._id;
                          resetImportStates();
                          navigate(`/resume/${id}/edit`);
                        }}
                        className="btn-primary py-2 px-5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                      >
                        Open in Builder <Edit size={13} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ResumeHub;
