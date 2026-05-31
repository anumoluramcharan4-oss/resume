// ==========================================
// src/pages/ResumeBuilder.jsx
// ==========================================
// Multi-step resume builder with live preview

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, Eye, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import SkillBadge from "../components/SkillBadge";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import api from "../services/api";
import toast from "react-hot-toast";

// ---- Default resume data structure ----
const defaultResume = {
  title: "My Resume",
  template: "modern",
  personal: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "", twitter: "" },
  about: "",
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
};

// ---- Step definitions ----
const steps = [
  { id: "personal", label: "Personal", emoji: "👤" },
  { id: "about", label: "About", emoji: "✍️" },
  { id: "skills", label: "Skills", emoji: "⚡" },
  { id: "education", label: "Education", emoji: "🎓" },
  { id: "experience", label: "Experience", emoji: "💼" },
  { id: "projects", label: "Projects", emoji: "🚀" },
  { id: "certifications", label: "Certs", emoji: "🏆" },
  { id: "template", label: "Template", emoji: "🎨" },
];

const templates = [
  { id: "modern", label: "Modern", desc: "Bold and contemporary" },
  { id: "minimal", label: "Minimal", desc: "Clean and simple" },
  { id: "professional", label: "Professional", desc: "Classic and formal" },
];

const ResumeBuilder = () => {
  const [resume, setResume] = useState(defaultResume);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // If editing existing resume, load it
  useEffect(() => {
    if (id && id !== "new") {
      const load = async () => {
        try {
          const res = await api.get(`/resumes/${id}`);
          setResume(res.data.resume);
        } catch {
          toast.error("Resume not found");
          navigate("/dashboard");
        }
      };
      load();
    }
  }, [id]);

  const update = (field, value) => setResume((r) => ({ ...r, [field]: value }));
  const updatePersonal = (field, value) =>
    setResume((r) => ({ ...r, personal: { ...r.personal, [field]: value } }));

  // Save resume to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      if (id && id !== "new") {
        await api.put(`/resumes/${id}`, resume);
        toast.success("Resume saved! ✅");
      } else {
        const res = await api.post("/resumes", resume);
        toast.success("Resume created! 🎉");
        navigate(`/resume/${res.data.resume._id}`);
      }
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // AI improve summary
  const handleImproveAbout = async () => {
    if (!resume.about.trim()) return toast.error("Write something first!");
    setAiLoading(true);
    try {
      const res = await api.post("/ai/improve-text", {
        text: resume.about,
        context: "professional summary",
      });
      update("about", res.data.improved);
      toast.success("AI improved your summary! ✨");
    } catch {
      toast.error("AI unavailable. Check your Gemini API key.");
    } finally {
      setAiLoading(false);
    }
  };

  // Add skill
  const addSkill = () => {
    if (!skillInput.trim()) return;
    setResume((r) => ({
      ...r,
      skills: [...r.skills, { name: skillInput.trim(), level: "intermediate" }],
    }));
    setSkillInput("");
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setResume((r) => ({
      ...r,
      skills: r.skills.filter((s) => s.name !== skillToRemove.name),
    }));
  };

  // Add/remove array items
  const addItem = (section, template) =>
    setResume((r) => ({ ...r, [section]: [...r[section], template] }));

  const removeItem = (section, index) =>
    setResume((r) => ({ ...r, [section]: r[section].filter((_, i) => i !== index) }));

  const updateItem = (section, index, field, value) =>
    setResume((r) => ({
      ...r,
      [section]: r[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

  // Render current template
  const renderTemplate = () => {
    const props = { resume };
    switch (resume.template) {
      case "minimal": return <MinimalTemplate {...props} />;
      case "professional": return <ProfessionalTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  // Render current step content
  const renderStep = () => {
    const stepId = steps[currentStep].id;
    const inputCls = "w-full input-dark rounded-xl py-2.5 px-3.5 text-sm mt-1.5 leading-relaxed tracking-wide placeholder-muted/40";
    const labelCls = "text-xs text-muted font-medium tracking-wide block mb-1";

    switch (stepId) {
      case "personal":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Resume Title</label>
              <input className={inputCls} value={resume.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g., Software Engineer Resume" />
            </div>
            <div>
              <label className={labelCls}>Full Name</label>
              <input className={inputCls} value={resume.personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} value={resume.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="john@example.com" />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} value={resume.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+91 9876543210" />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input className={inputCls} value={resume.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="Mumbai, India" />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input className={inputCls} value={resume.personal.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" />
            </div>
            <div>
              <label className={labelCls}>GitHub URL</label>
              <input className={inputCls} value={resume.personal.github} onChange={(e) => updatePersonal("github", e.target.value)} placeholder="github.com/johndoe" />
            </div>
            <div>
              <label className={labelCls}>Portfolio URL</label>
              <input className={inputCls} value={resume.personal.portfolio} onChange={(e) => updatePersonal("portfolio", e.target.value)} placeholder="johndoe.dev" />
            </div>
            <div>
              <label className={labelCls}>Twitter</label>
              <input className={inputCls} value={resume.personal.twitter} onChange={(e) => updatePersonal("twitter", e.target.value)} placeholder="@johndoe" />
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-muted font-medium tracking-wide">Professional Summary</label>
                <button
                  onClick={handleImproveAbout}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                >
                  {aiLoading ? "Improving..." : <><Sparkles size={12} /> AI Improve</>}
                </button>
              </div>
              <textarea
                className={`${inputCls} h-40 resize-none`}
                value={resume.about}
                onChange={(e) => update("about", e.target.value)}
                placeholder="Write a compelling professional summary about yourself. Tell your story, highlight key skills, and mention your career goals..."
              />
              <p className="text-xs text-muted mt-1">{resume.about.length} characters</p>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Add Skills</label>
              <div className="flex gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  placeholder="e.g., React, Python, Node.js"
                />
                <button onClick={addSkill} className="px-4 py-2.5 btn-primary rounded-xl font-medium mt-1.5">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {resume.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <SkillBadge key={i} skill={skill} onRemove={removeSkill} />
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-muted mb-2">Quick add popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "Python", "TypeScript", "MongoDB", "Git", "Docker", "AWS", "Figma"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { if (!resume.skills.find(sk => sk.name === s)) addItem("skills", { name: s, level: "intermediate" }); }}
                    className="px-3 py-1 text-xs rounded-full border border-subtle text-muted hover:border-[var(--color-brand-500)]/40 hover:text-[var(--color-brand-500)] transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            {resume.education.map((edu, i) => (
              <div key={i} className="relative p-5 rounded-2xl border border-[rgba(212,175,55,0.08)] bg-white/[0.02] hover:bg-white/[0.03] transition-colors duration-200 space-y-4 shadow-sm group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Education #{i + 1}</span>
                  <button onClick={() => removeItem("education", i)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Institution</label>
                    <input className={inputCls} value={edu.institution || ""} onChange={(e) => updateItem("education", i, "institution", e.target.value)} placeholder="e.g., Stanford University" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Degree</label>
                    <input className={inputCls} value={edu.degree || ""} onChange={(e) => updateItem("education", i, "degree", e.target.value)} placeholder="e.g., Bachelor of Science" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Field of Study</label>
                    <input className={inputCls} value={edu.field || ""} onChange={(e) => updateItem("education", i, "field", e.target.value)} placeholder="e.g., Computer Science" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Start Date</label>
                    <input className={inputCls} value={edu.startDate || ""} onChange={(e) => updateItem("education", i, "startDate", e.target.value)} placeholder="e.g., Sep 2020" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">End Date (or 'Present')</label>
                    <input className={inputCls} value={edu.endDate || ""} onChange={(e) => updateItem("education", i, "endDate", e.target.value)} placeholder="e.g., Jun 2024" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Grade/CGPA</label>
                    <input className={inputCls} value={edu.grade || ""} onChange={(e) => updateItem("education", i, "grade", e.target.value)} placeholder="e.g., 3.8 / 4.0" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Description</label>
                    <textarea className={`${inputCls} h-20 resize-none`} value={edu.description || ""} onChange={(e) => updateItem("education", i, "description", e.target.value)} placeholder="Key achievements or activities" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("education", { institution: "", degree: "", field: "", startDate: "", endDate: "", grade: "", description: "" })} className="w-full py-3 border border-dashed border-[var(--color-text-accent)]/30 rounded-xl text-[var(--color-text-accent)] text-sm hover:bg-[var(--color-text-accent)]/5 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus size={16} /> Add Education
            </button>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            {resume.experience.map((exp, i) => (
              <div key={i} className="relative p-5 rounded-2xl border border-[rgba(212,175,55,0.08)] bg-white/[0.02] hover:bg-white/[0.03] transition-colors duration-200 space-y-4 shadow-sm group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Experience #{i + 1}</span>
                  <button onClick={() => removeItem("experience", i)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Company</label>
                    <input className={inputCls} value={exp.company || ""} onChange={(e) => updateItem("experience", i, "company", e.target.value)} placeholder="e.g., Google" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Job Title</label>
                    <input className={inputCls} value={exp.role || ""} onChange={(e) => updateItem("experience", i, "role", e.target.value)} placeholder="e.g., Frontend Engineer" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Location</label>
                    <input className={inputCls} value={exp.location || ""} onChange={(e) => updateItem("experience", i, "location", e.target.value)} placeholder="e.g., Mountain View, CA" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Start Date</label>
                    <input className={inputCls} value={exp.startDate || ""} onChange={(e) => updateItem("experience", i, "startDate", e.target.value)} placeholder="e.g., Jan 2022" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">End Date</label>
                    <input className={inputCls} value={exp.endDate || ""} onChange={(e) => updateItem("experience", i, "endDate", e.target.value)} placeholder="e.g., Present" disabled={exp.current} />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 py-1">
                    <input type="checkbox" id={`current-${i}`} checked={exp.current || false} onChange={(e) => updateItem("experience", i, "current", e.target.checked)} className="rounded border-subtle bg-base text-accent focus:ring-accent accent-accent" />
                    <label htmlFor={`current-${i}`} className="text-xs text-muted font-medium select-none cursor-pointer">I am currently working in this role</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Description (use bullet points)</label>
                    <textarea className={`${inputCls} h-28 resize-none`} value={exp.description || ""} onChange={(e) => updateItem("experience", i, "description", e.target.value)} placeholder="• Developed feature X that improved user retention by 15%&#10;• Led a cross-functional team of 4 engineers..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("experience", { company: "", role: "", location: "", startDate: "", endDate: "", current: false, description: "" })} className="w-full py-3 border border-dashed border-[var(--color-text-accent)]/30 rounded-xl text-[var(--color-text-accent)] text-sm hover:bg-[var(--color-text-accent)]/5 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus size={16} /> Add Experience
            </button>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            {resume.projects.map((proj, i) => (
              <div key={i} className="relative p-5 rounded-2xl border border-[rgba(212,175,55,0.08)] bg-white/[0.02] hover:bg-white/[0.03] transition-colors duration-200 space-y-4 shadow-sm group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Project #{i + 1}</span>
                  <button onClick={() => removeItem("projects", i)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Project Name</label>
                    <input className={inputCls} value={proj.name || ""} onChange={(e) => updateItem("projects", i, "name", e.target.value)} placeholder="e.g., E-commerce Platform" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Live URL</label>
                    <input className={inputCls} value={proj.liveUrl || ""} onChange={(e) => updateItem("projects", i, "liveUrl", e.target.value)} placeholder="e.g., https://myproject.com" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">GitHub URL</label>
                    <input className={inputCls} value={proj.githubUrl || ""} onChange={(e) => updateItem("projects", i, "githubUrl", e.target.value)} placeholder="e.g., https://github.com/user/project" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Technologies (comma separated)</label>
                    <input className={inputCls} value={(proj.technologies || []).join(", ")} onChange={(e) => updateItem("projects", i, "technologies", e.target.value.split(",").map(t => t.trim()))} placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted mb-1 block font-medium">Description</label>
                    <textarea className={`${inputCls} h-24 resize-none`} value={proj.description || ""} onChange={(e) => updateItem("projects", i, "description", e.target.value)} placeholder="Describe what you built, the tech stack used, and the direct impact or key features of the project..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("projects", { name: "", description: "", technologies: [], liveUrl: "", githubUrl: "" })} className="w-full py-3 border border-dashed border-[var(--color-text-accent)]/30 rounded-xl text-[var(--color-text-accent)] text-sm hover:bg-[var(--color-text-accent)]/5 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus size={16} /> Add Project
            </button>
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-6">
            {resume.certifications.map((cert, i) => (
              <div key={i} className="relative p-5 rounded-2xl border border-[rgba(212,175,55,0.08)] bg-white/[0.02] hover:bg-white/[0.03] transition-colors duration-200 space-y-4 shadow-sm group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Certification #{i + 1}</span>
                  <button onClick={() => removeItem("certifications", i)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Certification Name</label>
                    <input className={inputCls} value={cert.name || ""} onChange={(e) => updateItem("certifications", i, "name", e.target.value)} placeholder="e.g., AWS Certified Solutions Architect" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Issuer</label>
                    <input className={inputCls} value={cert.issuer || ""} onChange={(e) => updateItem("certifications", i, "issuer", e.target.value)} placeholder="e.g., Amazon Web Services" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Date</label>
                    <input className={inputCls} value={cert.date || ""} onChange={(e) => updateItem("certifications", i, "date", e.target.value)} placeholder="e.g., Jan 2023" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-medium">Credential URL</label>
                    <input className={inputCls} value={cert.url || ""} onChange={(e) => updateItem("certifications", i, "url", e.target.value)} placeholder="e.g., https://cred.ly/..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => addItem("certifications", { name: "", issuer: "", date: "", url: "" })} className="w-full py-3 border border-dashed border-[var(--color-text-accent)]/30 rounded-xl text-[var(--color-text-accent)] text-sm hover:bg-[var(--color-text-accent)]/5 transition-colors flex items-center justify-center gap-2 font-medium">
              <Plus size={16} /> Add Certification
            </button>
          </div>
        );

      case "template":
        return (
          <div className="space-y-4">
            <p className="text-muted text-sm">Choose how your resume looks:</p>
            <div className="grid gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("template", t.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    resume.template === t.id
                      ? "border-[var(--color-text-accent)]/60 bg-[var(--color-text-accent)]/10"
                      : "border-subtle hover:border-[var(--color-text-accent)]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${resume.template === t.id ? "border-[var(--color-text-accent)] bg-[var(--color-text-accent)]" : "border-subtle"}`} />
                    <div>
                      <p className="text-main font-medium text-sm">{t.label}</p>
                      <p className="text-muted text-xs">{t.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <DashboardLayout title={id && id !== "new" ? "Edit Resume" : "Resume Builder"}>
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
          
          {/* Editor Panel (45%) */}
          <div className="lg:col-span-5 glass rounded-[1.5rem] border border-subtle flex flex-col h-[calc(100vh-140px)] shadow-sm">
            
            {/* Sticky Header & Tabs */}
            <div className="sticky top-0 z-20 glass rounded-t-[1.5rem] border-b border-subtle">
              <div className="p-5 pb-3">
                <h2 className="text-main font-semibold text-lg flex items-center gap-2">
                  <span>{steps[currentStep].emoji}</span> {steps[currentStep].label}
                </h2>
              </div>
              
              {/* Step Progress Tabs */}
              <div className="px-5 pb-4 flex items-center gap-4 overflow-x-auto custom-scrollbar">
                {steps.map((step, i) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(i)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 tracking-wide ${
                      i === currentStep
                        ? "btn-primary shadow-md scale-105"
                        : "btn-secondary text-muted hover:text-main hover:scale-105"
                    }`}
                  >
                    <span>{step.emoji}</span>
                    {step.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full space-y-6"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="p-5 border-t border-subtle flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl btn-secondary text-sm disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn-secondary text-sm lg:hidden"
                >
                  <Eye size={15} /> Preview
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  id="save-resume-btn"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl btn-primary font-medium disabled:opacity-50"
                >
                  <Save size={15} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl btn-secondary text-sm disabled:opacity-30"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Live Preview Panel (55%) */}
          <div className="hidden lg:flex flex-col lg:col-span-7 glass rounded-[1.5rem] border border-subtle overflow-hidden h-[calc(100vh-140px)] shadow-sm">
            <div className="px-6 py-4 border-b border-subtle flex items-center justify-between glass z-20">
              <span className="text-sm text-muted font-medium flex items-center gap-2">
                <Eye size={14} className="text-[var(--color-brand-500)]" /> Live Preview
              </span>
              <button
                onClick={() => navigate(id && id !== "new" ? `/resume/${id}` : "/dashboard")}
                className="flex items-center gap-1.5 text-xs text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] transition-colors bg-[var(--color-brand-500)]/10 px-3 py-1.5 rounded-lg font-medium"
              >
                Full Preview
              </button>
            </div>
            
            {/* Paper Container Background */}
            <div className="flex-1 overflow-y-auto bg-base p-8 flex justify-center items-start custom-scrollbar">
              {/* Fixed A4 dimensions for accurate scaling */}
              <div 
                className="w-[794px] min-h-[1123px] shrink-0 bg-white shadow-xl transform scale-[0.6] xl:scale-[0.7] 2xl:scale-[0.85] origin-top transition-transform duration-300 mb-[-30%] xl:mb-[-20%] 2xl:mb-0"
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 glass border-b border-subtle">
                <span className="text-main font-medium">Preview</span>
                <button onClick={() => setShowPreview(false)}><X size={20} className="text-muted" /></button>
              </div>
              <div className="flex-1 overflow-auto bg-white">
                {renderTemplate()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
