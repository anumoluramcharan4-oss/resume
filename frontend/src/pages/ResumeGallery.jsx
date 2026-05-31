// ==========================================
// src/pages/ResumeGallery.jsx
// ==========================================
// Example resume gallery for 6 different career personas

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Copy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";

// ---- Example resume data for each persona ----
const exampleResumes = [
  {
    id: "fresher",
    label: "Fresher",
    emoji: "🎓",
    template: "modern",
    color: "brand",
    desc: "Final year student with academic projects and internship",
    resume: {
      template: "modern",
      personal: { fullName: "Priya Sharma", email: "priya@gmail.com", phone: "+91 9876543210", location: "Pune, India", github: "github.com/priyasharma", linkedin: "linkedin.com/in/priyasharma" },
      about: "Enthusiastic Computer Science graduate with strong fundamentals in data structures and algorithms. Passionate about building scalable web applications. Actively seeking opportunities to apply my skills in a dynamic work environment.",
      skills: [{ name: "Python" }, { name: "Java" }, { name: "HTML/CSS" }, { name: "JavaScript" }, { name: "MySQL" }, { name: "Git" }],
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
    label: "Frontend Developer",
    emoji: "🎨",
    template: "minimal",
    color: "purple",
    desc: "2 years experience in React and modern UI development",
    resume: {
      template: "minimal",
      personal: { fullName: "Arjun Mehta", email: "arjun@dev.com", phone: "+91 9988776655", location: "Bengaluru, India", github: "github.com/arjundev", portfolio: "arjunmehta.dev" },
      about: "Creative Frontend Developer with 2+ years of experience building performant, accessible web applications using React and modern CSS. Passionate about UI/UX and pixel-perfect implementations.",
      skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind CSS" }, { name: "Next.js" }, { name: "Framer Motion" }, { name: "Figma" }, { name: "Git" }],
      education: [{ institution: "VIT University", degree: "B.Tech", field: "Information Technology", startDate: "2019", endDate: "2023", grade: "8.9 CGPA" }],
      experience: [{ company: "TechSpark Solutions", role: "Frontend Developer", location: "Remote", startDate: "Jan 2023", endDate: "", current: true, description: "• Built 5+ React apps serving 10K+ users\n• Reduced page load time by 40% via code splitting\n• Mentored 2 junior developers" }],
      projects: [{ name: "Design System Library", description: "Open-source React component library with 30+ components, 500+ GitHub stars", technologies: ["React", "TypeScript", "Storybook"] }],
      certifications: [{ name: "Meta Frontend Developer", issuer: "Coursera", date: "2022" }],
      achievements: [],
      languages: [],
    },
  },
  {
    id: "fullstack",
    label: "Full Stack Developer",
    emoji: "🚀",
    template: "professional",
    color: "cyan",
    desc: "MERN stack developer with production experience",
    resume: {
      template: "professional",
      personal: { fullName: "Rahul Verma", email: "rahul@fullstack.dev", phone: "+91 9876512345", location: "Hyderabad, India", github: "github.com/rahulverma", linkedin: "linkedin.com/in/rahulverma" },
      about: "Full Stack Developer with 3 years of experience in MERN stack. Built and deployed production applications serving 50K+ users. Strong in both frontend performance and backend architecture.",
      skills: [{ name: "React" }, { name: "Node.js" }, { name: "MongoDB" }, { name: "Express.js" }, { name: "AWS" }, { name: "Docker" }, { name: "Redis" }, { name: "GraphQL" }],
      education: [{ institution: "BITS Pilani", degree: "B.E.", field: "Computer Science", startDate: "2018", endDate: "2022", grade: "9.1 CGPA" }],
      experience: [{ company: "Razorpay", role: "Full Stack Developer", location: "Bengaluru", startDate: "Jun 2022", endDate: "", current: true, description: "• Architected microservices handling 1M+ daily transactions\n• Built real-time notification system using WebSockets\n• Optimized DB queries reducing response time by 60%" }],
      projects: [{ name: "E-Commerce Platform", description: "Full-stack e-commerce with payment integration, admin panel, and real-time inventory", technologies: ["React", "Node.js", "MongoDB", "Stripe"] }],
      certifications: [{ name: "AWS Solutions Architect", issuer: "Amazon", date: "2023" }],
      achievements: [{ title: "Best Engineer Q3 2023", description: "Awarded for shipping payment gateway feature ahead of schedule" }],
      languages: [],
    },
  },
  {
    id: "data-analyst",
    label: "Data Analyst",
    emoji: "📊",
    template: "modern",
    color: "green",
    desc: "Python and SQL expert with business intelligence experience",
    resume: {
      template: "modern",
      personal: { fullName: "Sneha Patel", email: "sneha@data.com", phone: "+91 9988001122", location: "Mumbai, India", linkedin: "linkedin.com/in/snehapatel" },
      about: "Data Analyst with expertise in Python, SQL, and Power BI. Experienced in translating complex datasets into actionable business insights. Proficient in statistical analysis and predictive modeling.",
      skills: [{ name: "Python" }, { name: "SQL" }, { name: "Power BI" }, { name: "Pandas" }, { name: "NumPy" }, { name: "Tableau" }, { name: "Excel" }, { name: "Machine Learning" }],
      education: [{ institution: "IIT Delhi", degree: "M.Tech", field: "Data Science", startDate: "2021", endDate: "2023", grade: "9.2 CGPA" }],
      experience: [{ company: "Flipkart", role: "Data Analyst", location: "Bengaluru", startDate: "Aug 2023", endDate: "", current: true, description: "• Analyzed 5M+ customer records to identify churn patterns\n• Built dashboards that saved ₹2Cr monthly through insights\n• Automated reporting pipeline saving 20 hours/week" }],
      projects: [{ name: "Customer Churn Predictor", description: "ML model predicting customer churn with 89% accuracy using Random Forest", technologies: ["Python", "Scikit-learn", "Pandas"] }],
      certifications: [{ name: "Google Data Analytics", issuer: "Coursera", date: "2022" }],
      achievements: [],
      languages: [],
    },
  },
  {
    id: "software-engineer",
    label: "Software Engineer",
    emoji: "⚙️",
    template: "professional",
    color: "orange",
    desc: "Backend systems engineer with 4 years experience",
    resume: {
      template: "professional",
      personal: { fullName: "Karan Singh", email: "karan@engineer.io", phone: "+91 9765432100", location: "Delhi, India", github: "github.com/karansingh" },
      about: "Software Engineer specializing in scalable backend systems and distributed computing. 4 years of experience at product-based companies. Strong in Java, Go, and system design.",
      skills: [{ name: "Java", level: "expert" }, { name: "Go", level: "advanced" }, { name: "Kubernetes", level: "advanced" }, { name: "PostgreSQL", level: "advanced" }, { name: "Kafka", level: "intermediate" }, { name: "System Design" }],
      education: [{ institution: "NIT Trichy", degree: "B.Tech", field: "Computer Science", startDate: "2017", endDate: "2021", grade: "8.7 CGPA" }],
      experience: [{ company: "Google", role: "Software Engineer II", location: "Hyderabad", startDate: "Mar 2021", endDate: "", current: true, description: "• Designed APIs serving 500M+ requests per day\n• Led migration of monolith to microservices\n• Reduced infrastructure costs by 30%" }],
      projects: [],
      certifications: [{ name: "Certified Kubernetes Administrator", issuer: "CNCF", date: "2022" }],
      achievements: [{ title: "Google Spot Bonus 2022", description: "For exceptional performance in infrastructure optimization project" }],
      languages: [],
    },
  },
  {
    id: "uiux",
    label: "UI/UX Designer",
    emoji: "🎭",
    template: "minimal",
    color: "pink",
    desc: "Product designer with Figma expertise and user research skills",
    resume: {
      template: "minimal",
      personal: { fullName: "Ananya Rao", email: "ananya@design.co", phone: "+91 9876001234", location: "Bengaluru, India", portfolio: "ananyarao.design", linkedin: "linkedin.com/in/ananyarao" },
      about: "Product Designer with 3 years of experience crafting user-centered digital experiences. Expert in Figma with a strong foundation in user research and design systems. Shipped designs for apps with 1M+ users.",
      skills: [{ name: "Figma" }, { name: "Adobe XD" }, { name: "Prototyping" }, { name: "User Research" }, { name: "Design Systems" }, { name: "Usability Testing" }, { name: "HTML/CSS" }],
      education: [{ institution: "NID Ahmedabad", degree: "B.Des", field: "Interaction Design", startDate: "2018", endDate: "2022", grade: "Distinction" }],
      experience: [{ company: "Swiggy", role: "Product Designer", location: "Bengaluru", startDate: "Jul 2022", endDate: "", current: true, description: "• Redesigned checkout flow → 23% increase in conversion\n• Built and maintained design system with 200+ components\n• Conducted 40+ user interviews and usability studies" }],
      projects: [{ name: "Healthcare App Redesign", description: "Redesigned patient booking flow reducing drop-off by 35%", technologies: ["Figma", "Maze", "Hotjar"] }],
      certifications: [{ name: "Google UX Design", issuer: "Coursera", date: "2021" }],
      achievements: [],
      languages: [],
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
  const [selected, setSelected] = useState(null);

  const renderTemplate = (r) => {
    switch (r.template) {
      case "minimal": return <MinimalTemplate resume={r} />;
      case "professional": return <ProfessionalTemplate resume={r} />;
      default: return <ModernTemplate resume={r} />;
    }
  };

  return (
    <DashboardLayout title="Example Resume Gallery">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[1.5rem] p-6 border border-subtle mb-8 shadow-sm"
        >
          <h2 className="text-xl font-bold text-main mb-2">Get inspired by real-world resumes 🎯</h2>
          <p className="text-muted text-sm">
            Browse professional resume examples for different career paths. Click any card to see the full resume.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exampleResumes.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelected(ex)}
              className="glass glass-hover rounded-[1.5rem] border border-subtle overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Template mini preview */}
              <div className="h-48 bg-white overflow-hidden relative border-b border-subtle">
                <div className="transform scale-[0.35] origin-top-left w-[286%] pointer-events-none">
                  {renderTemplate(ex.resume)}
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-[var(--color-brand-500)] px-3 py-1.5 rounded-full shadow-lg">
                    <Eye size={12} /> View Full Resume
                  </span>
                </div>
              </div>

              {/* Card info */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{ex.emoji}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${colorMap[ex.color]} font-medium capitalize`}>
                    {ex.resume.template}
                  </span>
                </div>
                <h3 className="text-main font-semibold mb-1">{ex.label}</h3>
                <p className="text-muted text-xs line-clamp-2">{ex.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Preview Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-[1.5rem] border border-subtle w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              >
                {/* Modal header */}
                <div className="flex items-center justify-between p-5 border-b border-subtle">
                  <div>
                    <h3 className="text-main font-bold flex items-center gap-2">
                      <span className="text-xl">{selected.emoji}</span> {selected.label}
                    </h3>
                    <p className="text-muted text-xs mt-1">{selected.resume.personal.fullName} · {selected.resume.template} template</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/resume/new"
                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl btn-primary font-medium shadow-sm"
                    >
                      Use Structure <ArrowRight size={12} />
                    </Link>
                    <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-xl btn-secondary flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Resume preview */}
                <div className="flex-1 overflow-auto bg-[var(--color-bg-base)] p-4 sm:p-8">
                  <div className="max-w-3xl mx-auto shadow-2xl bg-white rounded-sm">
                    {renderTemplate(selected.resume)}
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
