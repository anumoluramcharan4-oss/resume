// ==========================================
// src/pages/ResumeImport.jsx
// ==========================================
// Rebuilt Premium AI Resume Importer & Review Dashboard - Vercel / Stripe Style
// Incorporates real-time parsing steppers and a 3-column AI Analysis & Edit Panel.

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, ChevronRight, ChevronDown, Plus, Trash2, Edit, Check,
  ArrowRight, RefreshCw, X, Eye, Phone, MapPin, Mail, Sparkles,
  AlertCircle, CheckCircle2, Award, Compass, Download, User, Target, Brain,
  Briefcase, GraduationCap, ClipboardList, Flame, Star
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import api from "../services/api";
import toast from "react-hot-toast";

const parsingStepsList = [
  { label: "Uploading...", desc: "Sending document structure to API gateway" },
  { label: "Extracting PDF...", desc: "Loading font tables and reading text layers" },
  { label: "Cleaning Resume...", desc: "Removing duplicate lines, page numbers, and headers" },
  { label: "Analyzing with AI...", desc: "Querying fallback LLMs for entity mapping" },
  { label: "Generating Profile...", desc: "Generating career roadmap and ATS scores" },
  { label: "Completed", desc: "Profile data is compiled and ready for review" }
];

const ResumeImport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Inputs dropped from Dashboard
  const incomingResumeId = location.state?.resumeId || null;
  const incomingPdfName = location.state?.originalPdfName || null;
  const incomingDroppedFile = location.state?.droppedFile || null;

  // Step state: 'upload' | 'parsing' | 'review' | 'saving'
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [base64Data, setBase64Data] = useState("");
  
  // Real-time parsing steps counters
  const [activeParseStep, setActiveParseStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Parsed Resume Fields
  const [resumeData, setResumeData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [importTitle, setImportTitle] = useState("");
  const [rawText, setRawText] = useState("");

  // Editor Accordion State
  const [activeSection, setActiveSection] = useState("personal");
  const [editingIndex, setEditingIndex] = useState({ section: null, index: null });
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (incomingDroppedFile) {
      handleFileSelected(incomingDroppedFile);
    }
  }, [incomingDroppedFile]);

  const handleFileSelected = (selectedFile) => {
    setErrorMessage("");
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("Only PDF files are supported. Please select a valid PDF.");
      toast.error("Only PDF files are supported");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB size limit. Please upload a smaller PDF.");
      toast.error("File exceeds 5MB limit");
      return;
    }

    setFile(selectedFile);
    setImportTitle(selectedFile.name.replace(".pdf", "") + " (Imported)");

    // Read to base64 DataURL
    const reader = new FileReader();
    reader.onload = () => {
      setBase64Data(reader.result);
    };
    reader.onerror = () => {
      setErrorMessage("Error reading PDF file. Try again.");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleStartParsing = async () => {
    if (!base64Data) {
      toast.error("Please upload a PDF resume first");
      return;
    }

    setStep("parsing");
    setActiveParseStep(0);
    setUploadProgress(5);

    // Smoothly animate parsing steps in real-time
    const interval = setInterval(() => {
      setActiveParseStep((prev) => {
        if (prev < 4) {
          setUploadProgress((prevProgress) => Math.min(95, prevProgress + 18));
          return prev + 1;
        }
        return prev;
      });
    }, 2200);

    try {
      const response = await api.post("/resumes/import-pdf", {
        pdfData: base64Data,
        fileName: file.name,
        title: importTitle
      }, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percent < 100) {
            setUploadProgress(Math.max(5, Math.round(percent / 5)));
          }
        }
      });

      clearInterval(interval);
      setActiveParseStep(5);
      setUploadProgress(100);

      // Save parsed results
      setResumeData(response.data.parsedData);
      setSuggestions(response.data.suggestions);
      setRawText(response.data.rawText || "");

      setTimeout(() => {
        toast.success("Resume parsed successfully! 🎉");
        setStep("review");
      }, 1000);

    } catch (err) {
      clearInterval(interval);
      console.error(err);
      const errReason = err.response?.data?.reason || err.response?.data?.message || "Failed to analyze resume.";
      setErrorMessage(errReason);
      toast.error("Model analysis failed. Try again.");
      setStep("upload");
    }
  };

  const handleSaveProfile = async () => {
    setStep("saving");
    try {
      const payload = {
        resumeId: incomingResumeId,
        parsedData: resumeData,
        suggestions: suggestions,
        originalPdfData: base64Data,
        originalPdfName: file.name,
        rawText: rawText
      };

      const res = await api.post("/resumes/import/save", payload);
      toast.success(res.data.message || "Profile sync completed! 🚀");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync profile");
      setStep("review");
    }
  };

  const handleReset = () => {
    setFile(null);
    setBase64Data("");
    setResumeData(null);
    setSuggestions(null);
    setRawText("");
    setUploadProgress(0);
    setActiveParseStep(0);
    setErrorMessage("");
    setStep("upload");
  };

  // List editing functions
  const startEditing = (section, index, initialData) => {
    setEditingIndex({ section, index });
    setEditForm(initialData);
  };

  const saveEdit = (section, index) => {
    const list = [...resumeData[section]];
    list[index] = editForm;
    setResumeData({ ...resumeData, [section]: list });
    setEditingIndex({ section: null, index: null });
    setEditForm({});
    toast.success("Item updated successfully");
  };

  const deleteItem = (section, index) => {
    const list = [...resumeData[section]];
    list.splice(index, 1);
    setResumeData({ ...resumeData, [section]: list });
    toast.success("Item deleted");
  };

  const addItem = (section, defaultObject) => {
    const list = [...(resumeData[section] || [])];
    list.push(defaultObject);
    setResumeData({ ...resumeData, [section]: list });
    startEditing(section, list.length - 1, defaultObject);
  };

  const addMissingSkill = (skillName) => {
    const exists = resumeData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      toast.error("Skill is already listed in profile!");
      return;
    }
    const updatedSkills = [...resumeData.skills, { name: skillName, level: "intermediate" }];
    setResumeData({ ...resumeData, skills: updatedSkills });
    setSuggestions({
      ...suggestions,
      missingSkills: suggestions.missingSkills.filter(s => s !== skillName)
    });
    toast.success(`Added ${skillName} to your skills! ⚡`);
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs placeholder-slate-400 focus:border-blue-500 outline-none transition-colors text-slate-800 dark:text-slate-200";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 text-left";

  return (
    <DashboardLayout title="Resume Importer">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 text-left">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-blue-500" size={20} />
              {incomingResumeId ? "Update Active Profile Resume" : "AI Profile Resume Importer"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {incomingResumeId 
                ? "Re-upload and replace document assets for your existing active profile." 
                : "Extract, validate, and populate your candidate growth dashboard from a PDF."}
            </p>
          </div>
          {step === "review" && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleReset} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors flex items-center gap-1.5 cursor-pointer">
                <RefreshCw size={13} /> Re-upload PDF
              </button>
            </div>
          )}
        </div>

        {/* 1. UPLOAD STEP */}
        {step === "upload" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-6 pt-4">
            <GlassCard className="border-slate-200/80 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden bg-white dark:bg-slate-900/60 shadow-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileSelected(e.dataTransfer.files[0]);
                }}
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/40 bg-slate-50/30 hover:bg-slate-50/60 dark:bg-slate-950/20 dark:hover:bg-slate-950/35 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group relative"
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelected(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform duration-300 mb-4 shadow-sm">
                  <Upload size={24} className="stroke-[2.5px]" />
                </div>
                
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Drag & drop your resume PDF here
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal font-medium">
                  or <span className="text-blue-500 underline group-hover:text-blue-600 transition-colors">browse files</span> from your computer. Supported format: PDF (max 5MB).
                </p>
              </div>

              {file && (
                <div className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold shrink-0 text-[10px]">
                      PDF
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[180px] sm:max-w-[240px]">{file.name}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 cursor-pointer transition-colors border border-slate-200 dark:border-slate-800">
                    <X size={12} />
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-start gap-2.5 text-left leading-relaxed">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Model Endpoint Failure</p>
                    <p className="text-[11px] text-red-500/90 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <button
                disabled={!file}
                onClick={handleStartParsing}
                className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                Start AI Resume Parsing <ArrowRight size={14} />
              </button>
            </GlassCard>
          </motion.div>
        )}

        {/* 2. PARSING ANIMATION STEP */}
        {step === "parsing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-12 space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                className="w-16 h-16 rounded-2xl bg-blue-500/5 border border-dashed border-blue-500 flex items-center justify-center text-blue-500"
              >
                <Sparkles size={24} className="animate-pulse" />
              </motion.div>
            </div>
            
            <div className="space-y-1.5 text-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Analyzing Resume Structuring...</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">Please wait while the AI models process your content</p>
            </div>

            {/* Stepper progress list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-sm text-left">
              {parsingStepsList.map((st, idx) => {
                const isActive = idx === activeParseStep;
                const isCompleted = idx < activeParseStep;
                
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-normal">
                    <div className="flex flex-col items-center mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <RefreshCw size={14} className="text-blue-500 animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 dark:border-slate-800 shrink-0 bg-transparent" />
                      )}
                      {idx < 5 && (
                        <div className={`w-[1.5px] h-6 my-1 ${isCompleted ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className={`font-bold ${isActive ? "text-blue-500" : isCompleted ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                        {st.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isActive ? "text-slate-500 dark:text-slate-400" : "text-slate-400"}`}>
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress status */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200/40 dark:border-slate-800/60">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest text-center block">{uploadProgress}% Structuring Profile</span>
          </motion.div>
        )}

        {/* 3. REVIEW AND EDIT STEP (3-Column Layout) */}
        {step === "review" && resumeData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: Resume Raw Text Preview (Left - 3 cols) */}
            <div className="lg:col-span-3 space-y-4 text-left">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                  <Eye size={14} className="text-blue-500" /> Resume Preview
                </h3>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">Clean extracted plain text representation of the PDF resume.</p>
                
                {/* Clean Plain-text rendering paper box (No binary data) */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850/80 text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar select-text shadow-inner">
                  {rawText || "No text could be extracted."}
                </div>
              </div>
            </div>

            {/* COLUMN 2: ATS Summary & Editable Accordion Fields (Center - 5 cols) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              
              {/* ATS and Career Readiness Scores summary */}
              <GlassCard className="border-slate-200/80 dark:border-slate-800 !p-5 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                  <Target size={14} className="text-blue-500" /> Suitability Scans
                </h3>

                <div className="flex justify-around items-center py-2">
                  {/* ATS Compatibility */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-full border-4 border-blue-500/20 flex items-center justify-center bg-blue-500/5">
                      <span className="text-base font-extrabold text-blue-500">{suggestions.atsScore || 70}%</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mt-3">ATS Compatibility</span>
                    <span className="text-[9px] text-slate-400 leading-tight block mt-0.5">Keyword match metrics</span>
                  </div>

                  {/* Career Readiness */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-full border-4 border-purple-500/20 flex items-center justify-center bg-purple-500/5">
                      <span className="text-base font-extrabold text-purple-500">{suggestions.careerReadinessScore || 70}%</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mt-3">Career Readiness</span>
                    <span className="text-[9px] text-slate-400 leading-tight block mt-0.5">Market readiness check</span>
                  </div>
                </div>
              </GlassCard>

              {/* Editable accordions */}
              <div className="space-y-3.5">
                
                {/* 1. Personal Info */}
                <GlassCard className="border-slate-200/80 dark:border-slate-800 !p-4 bg-white dark:bg-slate-900/60 shadow-sm">
                  <button
                    onClick={() => setActiveSection(activeSection === "personal" ? null : "personal")}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
                        <User size={15} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Personal Information</h3>
                        <p className="text-[9px] text-slate-400 font-medium">Contact coordinates & online profiles</p>
                      </div>
                    </div>
                    {activeSection === "personal" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {activeSection === "personal" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Full Name</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={resumeData.personal?.fullName || ""}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personal: { ...resumeData.personal, fullName: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Target Job Title</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={resumeData.title || ""}
                          onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Email Address</label>
                        <input
                          type="email"
                          className={inputClass}
                          value={resumeData.personal?.email || ""}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personal: { ...resumeData.personal, email: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={resumeData.personal?.phone || ""}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personal: { ...resumeData.personal, phone: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={resumeData.personal?.location || ""}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personal: { ...resumeData.personal, location: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>LinkedIn Username/URL</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={resumeData.personal?.linkedin || ""}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personal: { ...resumeData.personal, linkedin: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>GitHub Username/URL</label>
                        <input
                          type="text"
                          className={inputClass}
                          value={resumeData.personal?.github || ""}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personal: { ...resumeData.personal, github: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Professional Summary</label>
                        <textarea
                          rows={3}
                          className={`${inputClass} md:col-span-2 resize-y`}
                          value={resumeData.about || ""}
                          onChange={(e) => setResumeData({ ...resumeData, about: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}
                </GlassCard>

                {/* 2. Skills list */}
                <GlassCard className="border-slate-200/80 dark:border-slate-800 !p-4 bg-white dark:bg-slate-900/60 shadow-sm">
                  <button
                    onClick={() => setActiveSection(activeSection === "skills" ? null : "skills")}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
                        <Brain size={15} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Skills Mapped ({resumeData.skills?.length || 0})</h3>
                        <p className="text-[9px] text-slate-400 font-medium">Core technical capabilities & proficiencies</p>
                      </div>
                    </div>
                    {activeSection === "skills" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {activeSection === "skills" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {resumeData.skills.map((sk, idx) => (
                          <div key={idx} className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 py-1 pl-2.5 pr-1.5 rounded-lg">
                            <span>{sk.name}</span>
                            <button
                              onClick={() => {
                                const list = resumeData.skills.filter((_, i) => i !== idx);
                                setResumeData({ ...resumeData, skills: list });
                              }}
                              className="w-4.5 h-4.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-650 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add skill row */}
                      <div className="flex gap-2">
                        <input
                          id="new-skill-input"
                          type="text"
                          className={inputClass}
                          placeholder="e.g. Docker, Next.js, Kubernetes"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value.trim()) {
                              const sName = e.target.value.trim();
                              const exists = resumeData.skills.some(s => s.name.toLowerCase() === sName.toLowerCase());
                              if (!exists) {
                                setResumeData({
                                  ...resumeData,
                                  skills: [...resumeData.skills, { name: sName, level: "intermediate" }]
                                });
                                e.target.value = "";
                                toast.success("Skill added!");
                              } else {
                                toast.error("Skill already exists");
                              }
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </GlassCard>

                {/* 3. Work Experience */}
                <GlassCard className="border-slate-200/80 dark:border-slate-800 !p-4 bg-white dark:bg-slate-900/60 shadow-sm">
                  <button
                    onClick={() => setActiveSection(activeSection === "experience" ? null : "experience")}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
                        <Briefcase size={15} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Work Experience ({resumeData.experience?.length || 0})</h3>
                        <p className="text-[9px] text-slate-400 font-medium">Employment history records</p>
                      </div>
                    </div>
                    {activeSection === "experience" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {activeSection === "experience" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 relative">
                          {editingIndex.section === "experience" && editingIndex.index === idx ? (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2 flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-1">
                                <span className="text-[10px] font-bold text-blue-500">Editing Experience</span>
                                <div className="flex gap-1.5">
                                  <button onClick={() => saveEdit("experience", idx)} className="px-2.5 py-1 bg-blue-500 text-white rounded-lg text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"><Check size={10} /> Save</button>
                                  <button onClick={() => setEditingIndex({ section: null, index: null })} className="px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-bold cursor-pointer">Cancel</button>
                                </div>
                              </div>
                              <div>
                                <label className={labelClass}>Company</label>
                                <input type="text" className={inputClass} value={editForm.company || ""} onChange={e => setEditForm({ ...editForm, company: e.target.value })} />
                              </div>
                              <div>
                                <label className={labelClass}>Role Title</label>
                                <input type="text" className={inputClass} value={editForm.role || ""} onChange={e => setEditForm({ ...editForm, role: e.target.value })} />
                              </div>
                              <div>
                                <label className={labelClass}>Duration (e.g. Jun 2024 - Present)</label>
                                <input type="text" className={inputClass} value={editForm.startDate || ""} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} />
                              </div>
                              <div>
                                <label className={labelClass}>Location</label>
                                <input type="text" className={inputClass} value={editForm.location || ""} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                              </div>
                              <div className="col-span-2">
                                <label className={labelClass}>Description / Accomplishments</label>
                                <textarea rows={3} className={`${inputClass} resize-y`} value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="absolute top-3 right-3 flex gap-1.5">
                                <button onClick={() => startEditing("experience", idx, exp)} className="w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer border border-slate-200 dark:border-slate-800"><Edit size={10} /></button>
                                <button onClick={() => deleteItem("experience", idx)} className="w-6 h-6 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer border border-slate-200 dark:border-slate-800"><Trash2 size={10} /></button>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                              <p className="text-[10px] text-blue-500 font-semibold">{exp.company} {exp.location ? `· ${exp.location}` : ""}</p>
                              <p className="text-[9px] text-slate-400 font-medium mt-0.5">{exp.startDate} {exp.endDate ? ` - ${exp.endDate}` : ""}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-450 whitespace-pre-line mt-2 border-t border-slate-100 dark:border-slate-850/40 pt-2 leading-relaxed">{exp.description}</p>
                            </>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addItem("experience", { company: "Company Name", role: "Software Engineer", location: "Remote", startDate: "Jun 2025 - Present", description: "" })}
                        className="w-full border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/40 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer bg-slate-50/30"
                      >
                        <Plus size={12} /> Add Experience Record
                      </button>
                    </motion.div>
                  )}
                </GlassCard>

                {/* 4. Education Accordion */}
                <GlassCard className="border-slate-200/80 dark:border-slate-800 !p-4 bg-white dark:bg-slate-900/60 shadow-sm">
                  <button
                    onClick={() => setActiveSection(activeSection === "education" ? null : "education")}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
                        <GraduationCap size={15} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Education ({resumeData.education?.length || 0})</h3>
                        <p className="text-[9px] text-slate-400 font-medium">Academic degrees & records</p>
                      </div>
                    </div>
                    {activeSection === "education" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {activeSection === "education" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 relative">
                          {editingIndex.section === "education" && editingIndex.index === idx ? (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2 flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-1">
                                <span className="text-[10px] font-bold text-blue-500">Editing Education</span>
                                <div className="flex gap-1.5">
                                  <button onClick={() => saveEdit("education", idx)} className="px-2.5 py-1 bg-blue-500 text-white rounded-lg text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"><Check size={10} /> Save</button>
                                  <button onClick={() => setEditingIndex({ section: null, index: null })} className="px-2.5 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-bold cursor-pointer">Cancel</button>
                                </div>
                              </div>
                              <div>
                                <label className={labelClass}>Institution</label>
                                <input type="text" className={inputClass} value={editForm.institution || ""} onChange={e => setEditForm({ ...editForm, institution: e.target.value })} />
                              </div>
                              <div>
                                <label className={labelClass}>Degree</label>
                                <input type="text" className={inputClass} value={editForm.degree || ""} onChange={e => setEditForm({ ...editForm, degree: e.target.value })} />
                              </div>
                              <div>
                                <label className={labelClass}>Field of Study</label>
                                <input type="text" className={inputClass} value={editForm.field || ""} onChange={e => setEditForm({ ...editForm, field: e.target.value })} />
                              </div>
                              <div>
                                <label className={labelClass}>Graduation / End Date</label>
                                <input type="text" className={inputClass} value={editForm.endDate || ""} onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="absolute top-3 right-3 flex gap-1.5">
                                <button onClick={() => startEditing("education", idx, edu)} className="w-6 h-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer border border-slate-200 dark:border-slate-800"><Edit size={10} /></button>
                                <button onClick={() => deleteItem("education", idx)} className="w-6 h-6 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-slate-400 hover:text-red-500 cursor-pointer border border-slate-200 dark:border-slate-800"><Trash2 size={10} /></button>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{edu.institution}</h4>
                              <p className="text-[10px] text-blue-500 font-semibold">{edu.degree} in {edu.field}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">Completed: {edu.endDate} {edu.grade ? ` · Grade: ${edu.grade}` : ""}</p>
                            </>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addItem("education", { institution: "University Name", degree: "B.S.", field: "Computer Science", endDate: "2026", grade: "" })}
                        className="w-full border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/40 py-2.5 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer bg-slate-50/30"
                      >
                        <Plus size={12} /> Add Education Record
                      </button>
                    </motion.div>
                  )}
                </GlassCard>
              </div>

              {/* Action sync buttons at bottom */}
              <div className="flex items-center gap-3 pt-2 justify-end">
                <button onClick={handleReset} className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer">
                  Discard
                </button>
                <button onClick={handleSaveProfile} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer">
                  Sync & Create Dashboard <Check size={14} className="stroke-[3px]" />
                </button>
              </div>
            </div>

            {/* COLUMN 3: AI Recommendations & Roadmaps (Right - 4 cols) */}
            <div className="lg:col-span-4 space-y-4 text-left">
              
              {/* Missing Skills tags suggestions */}
              {suggestions.missingSkills?.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-red-500" /> Missing Skills Gaps
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    AI identified the following gaps against targeted specifications. Click to add them to your profile skills:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {suggestions.missingSkills.map((sk, idx) => (
                      <button
                        key={idx}
                        onClick={() => addMissingSkill(sk)}
                        title={`Add ${sk}`}
                        className="text-[9px] px-2.5 py-1 bg-red-500/10 hover:bg-emerald-500/15 text-red-500 hover:text-emerald-500 border border-red-500/20 hover:border-emerald-500/30 rounded-lg font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={10} /> {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimizations and tips list */}
              {suggestions.improvements?.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={14} className="text-purple-500" /> Optimization Tips
                  </h4>
                  <ul className="space-y-2">
                    {suggestions.improvements.map((tip, idx) => (
                      <li key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 bg-slate-50/50 dark:bg-slate-950/20 p-2.5 border border-slate-100 dark:border-slate-850/40 rounded-xl leading-relaxed">
                        <span className="text-purple-500 font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Career Paths */}
              {suggestions.recommendedCareerPaths?.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Compass size={14} className="text-cyan-500" /> Career Roadmap Paths
                  </h4>
                  <div className="space-y-2">
                    {suggestions.recommendedCareerPaths.map((path, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-950/20 text-[10.5px] font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center">
                        <span>{path}</span>
                        <ChevronRight size={13} className="text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended internships or jobs */}
              {suggestions.recommendedInternships?.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase size={14} className="text-emerald-500" /> Recommended Internships
                  </h4>
                  <div className="space-y-2">
                    {suggestions.recommendedInternships.map((intern, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl text-[10px] leading-relaxed text-slate-550 flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><Star size={10} fill="currentColor" /></div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{intern}</p>
                          <p className="text-[9px] text-emerald-500 mt-0.5 font-semibold">High Match Quality Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 4. SAVING STEP SCREEN */}
        {step === "saving" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-20 text-center space-y-4">
            <RefreshCw className="w-9 h-9 text-blue-500 animate-spin mx-auto" />
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Syncing Candidate Databases...</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
                Populating your AI resume builder, skill checklist progress indicators, and career roadmap milestones...
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ResumeImport;
