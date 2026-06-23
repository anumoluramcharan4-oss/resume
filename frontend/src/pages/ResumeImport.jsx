// ==========================================
// src/pages/ResumeImport.jsx
// ==========================================
// Premium LinkedIn-style Resume Parser, Profile Importer, and Career Advisor Coach.

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, ChevronRight, ChevronDown, Plus, Trash2, Edit, Save,
  ArrowRight, ArrowLeft, Loader2, Sparkles, CheckCircle2, AlertCircle,
  Download, Award, Compass, RefreshCw, X, Eye, Phone, MapPin, Mail,
  Globe, Link as LinkIcon, User, Target, Brain, Check, Briefcase, BookOpen
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import api from "../services/api";
import toast from "react-hot-toast";

const ResumeImport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Route States (checks if Dashboard dropped a file or ResumeHub requested updates)
  const incomingResumeId = location.state?.resumeId || null;
  const incomingPdfName = location.state?.originalPdfName || null;
  const incomingDroppedFile = location.state?.droppedFile || null;

  // Flow State: 'upload' | 'parsing' | 'review' | 'saving'
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [base64Data, setBase64Data] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseStatus, setParseStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Target Resume Data (Parsed & editable)
  const [resumeData, setResumeData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [importTitle, setImportTitle] = useState("");
  const [rawText, setRawText] = useState("");

  // Accordion Sections State
  const [activeSection, setActiveSection] = useState("personal");

  // Inline Section Editing States
  const [editingIndex, setEditingIndex] = useState({ section: null, index: null });
  const [editForm, setEditForm] = useState({});

  // Auto-initiate upload if file dropped from Dashboard
  useEffect(() => {
    if (incomingDroppedFile) {
      handleFileSelected(incomingDroppedFile);
    }
  }, [incomingDroppedFile]);

  // File selection validator
  const handleFileSelected = (selectedFile) => {
    setErrorMessage("");
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("Unsupported format. Please upload a PDF file only.");
      toast.error("Only PDF files are supported");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds 10MB limit. Please compress and upload again.");
      toast.error("File size limit is 10MB");
      return;
    }

    setFile(selectedFile);
    setImportTitle(selectedFile.name.replace(".pdf", "") + " (Imported)");

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      setBase64Data(reader.result);
    };
    reader.onerror = () => {
      setErrorMessage("Error reading PDF file. Try again.");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    handleFileSelected(dropped);
  };

  // Perform Gemini parsing
  const handleStartParsing = async () => {
    if (!base64Data) {
      toast.error("Please select a PDF file first");
      return;
    }

    setStep("parsing");
    setUploadProgress(10);
    setParseStatus("Uploading document structure...");

    // Simulate progress updates for premium UX
    const statusIntervals = [
      { prg: 25, msg: "Reading PDF page layouts..." },
      { prg: 45, msg: "Extracting contact details & bio..." },
      { prg: 65, msg: "Mapping work experience & education arrays..." },
      { prg: 80, msg: "Compiling skill graphs & hackathons..." },
      { prg: 95, msg: "Evaluating ATS matching & career advice metrics..." }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < statusIntervals.length) {
        setUploadProgress(statusIntervals[currentIdx].prg);
        setParseStatus(statusIntervals[currentIdx].msg);
        currentIdx++;
      }
    }, 1500);

    try {
      const response = await api.post("/resumes/import-pdf", {
        pdfData: base64Data,
        fileName: file.name,
        title: importTitle
      }, {
        onUploadProgress: (progressEvent) => {
          // If network upload takes time
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentage < 100) {
            setUploadProgress(Math.max(10, Math.round(percentage / 4)));
          }
        }
      });

      clearInterval(interval);
      setUploadProgress(100);
      setParseStatus("Extraction complete!");

      // Store parsed result
      setResumeData(response.data.parsedData);
      setSuggestions(response.data.suggestions);
      setRawText(response.data.rawText || "");

      toast.success("Resume parsed successfully! 🎉");
      setStep("review");
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to structure resume PDF.");
      setStep("upload");
    }
  };

  // Save parsed data to profile
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
      toast.success(res.data.message || "Profile created successfully! 🚀");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
      setStep("review");
    }
  };

  // Download raw extracted JSON file
  const handleDownloadJSON = () => {
    const rawJSON = {
      resumeData,
      suggestions
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rawJSON, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resumeData.personal?.fullName || "extracted"}_resume_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("JSON data file downloaded!");
  };

  // Reset upload flow
  const handleReset = () => {
    setFile(null);
    setBase64Data("");
    setResumeData(null);
    setSuggestions(null);
    setRawText("");
    setUploadProgress(0);
    setErrorMessage("");
    setStep("upload");
  };

  // Edit list items helpers
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
    toast.success("Item updated inline");
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

  // Click tag to add to current skills
  const addMissingSkill = (skillName) => {
    const exists = resumeData.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      toast.error("Skill is already listed in profile!");
      return;
    }
    const updatedSkills = [...resumeData.skills, { name: skillName, level: "intermediate" }];
    setResumeData({ ...resumeData, skills: updatedSkills });
    // Remove from missing skills suggestions
    setSuggestions({
      ...suggestions,
      missingSkills: suggestions.missingSkills.filter(s => s !== skillName)
    });
    toast.success(`Added ${skillName} to your skills! ⚡`);
  };

  // Styles
  const inputClass = "w-full input-dark rounded-xl py-2 px-3 text-xs border border-subtle focus:border-focus";
  const labelClass = "text-[10px] font-bold text-muted uppercase tracking-wider block mb-1";

  return (
    <DashboardLayout title="Import Resume">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-subtle pb-4">
          <div>
            <h2 className="text-xl font-black text-main flex items-center gap-2">
              <Sparkles className="text-accent" size={20} />
              {incomingResumeId ? "Update Existing Resume Profile" : "AI Resume Importer"}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {incomingResumeId 
                ? `Re-upload and replace resume version snapshots for existing profile.` 
                : `Extract, edit, and populate your entire Career AI profile from a PDF resume.`}
            </p>
          </div>
          {step === "review" && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleReset} className="btn-secondary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <RefreshCw size={13} /> Re-upload PDF
              </button>
              <button onClick={handleDownloadJSON} className="btn-secondary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Download size={13} /> Download JSON
              </button>
            </div>
          )}
        </div>

        {/* 1. UPLOAD STEP */}
        {step === "upload" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-6 pt-6">
            <GlassCard className="border-subtle p-8 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/3 rounded-full blur-3xl pointer-events-none" />
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full border-2 border-dashed border-subtle hover:border-accent/40 bg-surface/20 hover:bg-surface/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group relative"
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelected(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300 mb-4 shadow-md">
                  <Upload size={24} className="stroke-[2.5px]" />
                </div>
                
                <h3 className="text-sm font-bold text-main">
                  Drag & drop your resume PDF here
                </h3>
                <p className="text-xs text-muted mt-1 max-w-xs leading-normal">
                  or <span className="text-accent underline group-hover:text-accent-muted transition-colors">browse files</span> from your computer. Only PDF files are supported (max 10MB).
                </p>
              </div>

              {file && (
                <div className="w-full flex items-center justify-between p-3.5 bg-surface rounded-xl border border-subtle text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500 font-bold shrink-0">
                      PDF
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-main font-bold truncate max-w-[180px] sm:max-w-[240px]">{file.name}</p>
                      <p className="text-muted text-[10px] mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="w-6 h-6 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle">
                    <X size={12} />
                  </button>
                </div>
              )}

              {errorMessage && (
                <div className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 text-left">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {incomingResumeId && (
                <div className="w-full p-3 bg-accent/5 border border-accent/20 text-accent rounded-xl text-xs flex items-center gap-2 text-left leading-normal">
                  <Target size={14} className="shrink-0" />
                  <span><strong>Notice:</strong> This upload will replace document version snapshots for: <em>{incomingPdfName || "Existing Resume"}</em>.</span>
                </div>
              )}

              <button
                disabled={!file}
                onClick={handleStartParsing}
                className="w-full btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                Start AI Resume Parsing <ArrowRight size={14} />
              </button>
            </GlassCard>
          </motion.div>
        )}

        {/* 2. PARSING LOADING STEP */}
        {step === "parsing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-16 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                className="w-20 h-20 rounded-3xl bg-accent/5 border-2 border-dashed border-accent flex items-center justify-center text-accent"
              >
                <Sparkles size={32} className="animate-pulse" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-bold text-main">Gemini Structuring Profile Data...</h3>
              <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">{parseStatus}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-subtle rounded-full overflow-hidden relative border border-subtle/20">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-amber-500"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[11px] font-bold text-accent uppercase tracking-widest block">{uploadProgress}% Complete</span>
          </motion.div>
        )}

        {/* 3. REVIEW AND EDIT STEP */}
        {step === "review" && resumeData && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column: Editable Accordion Fields */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Personal Details */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "personal" ? null : "personal")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <User size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Personal Information</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Contact coordinates & online handles</p>
                    </div>
                  </div>
                  {activeSection === "personal" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "personal" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className={labelClass}>Location (City, Country)</label>
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
                      <label className={labelClass}>LinkedIn URL</label>
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
                      <label className={labelClass}>GitHub URL</label>
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
                  </motion.div>
                )}
              </GlassCard>

              {/* Professional Summary */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "about" ? null : "about")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <FileText size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Professional Summary</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Short introduction biography</p>
                    </div>
                  </div>
                  {activeSection === "about" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "about" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40">
                    <label className={labelClass}>Summary Text</label>
                    <textarea
                      rows={4}
                      className={`${inputClass} resize-y leading-relaxed`}
                      value={resumeData.about || ""}
                      onChange={(e) => setResumeData({ ...resumeData, about: e.target.value })}
                    />
                  </motion.div>
                )}
              </GlassCard>

              {/* Skills */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "skills" ? null : "skills")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <Brain size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Skills Listed ({resumeData.skills?.length || 0})</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Core technical and soft expertise</p>
                    </div>
                  </div>
                  {activeSection === "skills" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "skills" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 space-y-4">
                    {/* Add skill input form */}
                    <div className="flex gap-2 bg-surface/40 p-3 rounded-xl border border-subtle items-end">
                      <div className="flex-1">
                        <label className={labelClass}>New Skill Name</label>
                        <input
                          type="text"
                          id="new-skill-input"
                          className={inputClass}
                          placeholder="e.g., Python"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Level</label>
                        <select id="new-skill-level" className={inputClass}>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate" selected>Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          const name = document.getElementById("new-skill-input").value.trim();
                          const level = document.getElementById("new-skill-level").value;
                          if (name) {
                            setResumeData({
                              ...resumeData,
                              skills: [...(resumeData.skills || []), { name, level }]
                            });
                            document.getElementById("new-skill-input").value = "";
                            toast.success("Skill added!");
                          }
                        }}
                        className="btn-primary py-2 px-3 rounded-xl text-xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-2">
                      {(resumeData.skills || []).map((sk, index) => (
                        <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-subtle rounded-xl text-xs font-semibold text-main hover:border-focus transition-all group">
                          <span>{sk.name}</span>
                          <span className="text-[9px] uppercase font-bold text-accent bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10">{sk.level}</span>
                          <button
                            onClick={() => deleteItem("skills", index)}
                            className="text-muted hover:text-red-500 transition-colors p-0.5 cursor-pointer ml-1"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </GlassCard>

              {/* Work Experience */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "experience" ? null : "experience")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <Briefcase size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Employment History ({resumeData.experience?.length || 0})</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Work history, roles, & responsibilities</p>
                    </div>
                  </div>
                  {activeSection === "experience" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "experience" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 space-y-4">
                    {(resumeData.experience || []).map((job, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-subtle bg-surface/30 space-y-3 relative text-left">
                        {editingIndex.section === "experience" && editingIndex.index === idx ? (
                          /* Edit Mode fields */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2 flex justify-between items-center pb-2 border-b border-subtle/50">
                              <span className="text-xs font-bold text-accent">Editing Experience</span>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit("experience", idx)} className="btn-primary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"><Check size={10} /> Done</button>
                                <button onClick={() => setEditingIndex({ section: null, index: null })} className="btn-secondary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer">Cancel</button>
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Company Name</label>
                              <input type="text" className={inputClass} value={editForm.company || ""} onChange={e => setEditForm({ ...editForm, company: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>Job Title / Role</label>
                              <input type="text" className={inputClass} value={editForm.role || ""} onChange={e => setEditForm({ ...editForm, role: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>Duration (e.g., Jun 2023 - Present)</label>
                              <input type="text" className={inputClass} value={editForm.startDate || ""} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} placeholder="Start - End Date" />
                            </div>
                            <div>
                              <label className={labelClass}>Location</label>
                              <input type="text" className={inputClass} value={editForm.location || ""} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelClass}>Responsibilities / Key Achievements</label>
                              <textarea rows={3} className={`${inputClass} resize-y`} value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          /* View Mode details */
                          <>
                            <div className="absolute top-4 right-4 flex gap-1.5">
                              <button onClick={() => startEditing("experience", idx, job)} className="w-7 h-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle" title="Edit Item"><Edit size={12} /></button>
                              <button onClick={() => deleteItem("experience", idx)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-500 cursor-pointer border border-subtle" title="Delete Item"><Trash2 size={12} /></button>
                            </div>
                            <h4 className="text-xs font-bold text-main pr-16">{job.role}</h4>
                            <p className="text-[11px] text-accent font-semibold">{job.company} · <span className="text-muted font-normal">{job.location}</span></p>
                            <p className="text-[10px] text-muted mt-0.5">{job.startDate} {job.endDate ? `- ${job.endDate}` : ""}</p>
                            {job.description && (
                              <p className="text-xs text-muted mt-2 border-t border-subtle/30 pt-2 whitespace-pre-line leading-relaxed">{job.description}</p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem("experience", { company: "New Company", role: "Software Engineer", location: "Remote", startDate: "Jun 2026 - Present", description: "" })}
                      className="w-full border border-dashed border-subtle hover:border-focus py-3 rounded-xl text-xs font-bold text-muted hover:text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-surface/5"
                    >
                      <Plus size={14} /> Add Work Experience
                    </button>
                  </motion.div>
                )}
              </GlassCard>

              {/* Projects */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "projects" ? null : "projects")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <Target size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Projects Listed ({resumeData.projects?.length || 0})</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Portfolios, hackathons, & personal builds</p>
                    </div>
                  </div>
                  {activeSection === "projects" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "projects" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 space-y-4">
                    {(resumeData.projects || []).map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-subtle bg-surface/30 space-y-3 relative text-left">
                        {editingIndex.section === "projects" && editingIndex.index === idx ? (
                          /* Edit Mode fields */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2 flex justify-between items-center pb-2 border-b border-subtle/50">
                              <span className="text-xs font-bold text-accent">Editing Project</span>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit("projects", idx)} className="btn-primary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"><Check size={10} /> Done</button>
                                <button onClick={() => setEditingIndex({ section: null, index: null })} className="btn-secondary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer">Cancel</button>
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Project Name</label>
                              <input type="text" className={inputClass} value={editForm.name || ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>GitHub / Demo Link</label>
                              <input type="text" className={inputClass} value={editForm.githubUrl || ""} onChange={e => setEditForm({ ...editForm, githubUrl: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelClass}>Technologies (Comma separated)</label>
                              <input type="text" className={inputClass} value={Array.isArray(editForm.technologies) ? editForm.technologies.join(", ") : editForm.technologies || ""} onChange={e => setEditForm({ ...editForm, technologies: e.target.value.split(",").map(t => t.trim()) })} />
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelClass}>Project Description</label>
                              <textarea rows={3} className={`${inputClass} resize-y`} value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          /* View Mode details */
                          <>
                            <div className="absolute top-4 right-4 flex gap-1.5">
                              <button onClick={() => startEditing("projects", idx, proj)} className="w-7 h-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle" title="Edit Item"><Edit size={12} /></button>
                              <button onClick={() => deleteItem("projects", idx)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-500 cursor-pointer border border-subtle" title="Delete Item"><Trash2 size={12} /></button>
                            </div>
                            <h4 className="text-xs font-bold text-main pr-16">{proj.name}</h4>
                            {proj.githubUrl && (
                              <p className="text-[10px] text-accent flex items-center gap-1.5 mt-0.5 truncate max-w-[200px]">
                                <Globe size={11} /> {proj.githubUrl}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(proj.technologies || []).map((t, tIdx) => (
                                <span key={tIdx} className="text-[9px] font-bold text-muted bg-surface/50 border border-subtle px-1.5 py-0.5 rounded">{t}</span>
                              ))}
                            </div>
                            {proj.description && (
                              <p className="text-xs text-muted mt-2 border-t border-subtle/30 pt-2 whitespace-pre-line leading-relaxed">{proj.description}</p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem("projects", { name: "New Portfolio Project", description: "Project description...", technologies: ["React"], githubUrl: "" })}
                      className="w-full border border-dashed border-subtle hover:border-focus py-3 rounded-xl text-xs font-bold text-muted hover:text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-surface/5"
                    >
                      <Plus size={14} /> Add Project
                    </button>
                  </motion.div>
                )}
              </GlassCard>

              {/* Education */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "education" ? null : "education")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <BookOpen size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Education ({resumeData.education?.length || 0})</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Academic institutions, degrees, & CGPAs</p>
                    </div>
                  </div>
                  {activeSection === "education" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "education" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 space-y-4">
                    {(resumeData.education || []).map((edu, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-subtle bg-surface/30 space-y-3 relative text-left">
                        {editingIndex.section === "education" && editingIndex.index === idx ? (
                          /* Edit Mode fields */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2 flex justify-between items-center pb-2 border-b border-subtle/50">
                              <span className="text-xs font-bold text-accent">Editing Education</span>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit("education", idx)} className="btn-primary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"><Check size={10} /> Done</button>
                                <button onClick={() => setEditingIndex({ section: null, index: null })} className="btn-secondary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer">Cancel</button>
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>College / Institution</label>
                              <input type="text" className={inputClass} value={editForm.institution || ""} onChange={e => setEditForm({ ...editForm, institution: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>Degree & Field</label>
                              <input type="text" className={inputClass} value={editForm.degree || ""} onChange={e => setEditForm({ ...editForm, degree: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>Graduation Year / Duration</label>
                              <input type="text" className={inputClass} value={editForm.endDate || ""} onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>CGPA / GPA Score</label>
                              <input type="text" className={inputClass} value={editForm.grade || ""} onChange={e => setEditForm({ ...editForm, grade: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          /* View Mode details */
                          <>
                            <div className="absolute top-4 right-4 flex gap-1.5">
                              <button onClick={() => startEditing("education", idx, edu)} className="w-7 h-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle" title="Edit Item"><Edit size={12} /></button>
                              <button onClick={() => deleteItem("education", idx)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-500 cursor-pointer border border-subtle" title="Delete Item"><Trash2 size={12} /></button>
                            </div>
                            <h4 className="text-xs font-bold text-main pr-16">{edu.institution}</h4>
                            <p className="text-[11px] text-accent font-semibold">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</p>
                            <p className="text-[10px] text-muted mt-0.5">Graduated: {edu.endDate} · Score: <span className="text-main font-bold">{edu.grade || "N/A"}</span></p>
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem("education", { institution: "University Name", degree: "Bachelor of Science", field: "Computer Science", endDate: "2026", grade: "9.0 CGPA" })}
                      className="w-full border border-dashed border-subtle hover:border-focus py-3 rounded-xl text-xs font-bold text-muted hover:text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-surface/5"
                    >
                      <Plus size={14} /> Add Education Record
                    </button>
                  </motion.div>
                )}
              </GlassCard>

              {/* Certifications */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "certifications" ? null : "certifications")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <Award size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Certifications ({resumeData.certifications?.length || 0})</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Professional credentials & courseware</p>
                    </div>
                  </div>
                  {activeSection === "certifications" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "certifications" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 space-y-4">
                    {(resumeData.certifications || []).map((cert, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-subtle bg-surface/30 space-y-3 relative text-left">
                        {editingIndex.section === "certifications" && editingIndex.index === idx ? (
                          /* Edit Mode fields */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2 flex justify-between items-center pb-2 border-b border-subtle/50">
                              <span className="text-xs font-bold text-accent">Editing Certification</span>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit("certifications", idx)} className="btn-primary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"><Check size={10} /> Done</button>
                                <button onClick={() => setEditingIndex({ section: null, index: null })} className="btn-secondary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer">Cancel</button>
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Certification Name</label>
                              <input type="text" className={inputClass} value={editForm.name || ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div>
                              <label className={labelClass}>Issuing Organization</label>
                              <input type="text" className={inputClass} value={editForm.issuer || ""} onChange={e => setEditForm({ ...editForm, issuer: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          /* View Mode details */
                          <>
                            <div className="absolute top-4 right-4 flex gap-1.5">
                              <button onClick={() => startEditing("certifications", idx, cert)} className="w-7 h-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle" title="Edit Item"><Edit size={12} /></button>
                              <button onClick={() => deleteItem("certifications", idx)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-500 cursor-pointer border border-subtle" title="Delete Item"><Trash2 size={12} /></button>
                            </div>
                            <h4 className="text-xs font-bold text-main pr-16">{cert.name}</h4>
                            <p className="text-[11px] text-accent font-semibold">{cert.issuer} {cert.date ? `· ${cert.date}` : ""}</p>
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem("certifications", { name: "New AWS / Cloud Credential", issuer: "Amazon Web Services" })}
                      className="w-full border border-dashed border-subtle hover:border-focus py-3 rounded-xl text-xs font-bold text-muted hover:text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-surface/5"
                    >
                      <Plus size={14} /> Add Certification
                    </button>
                  </motion.div>
                )}
              </GlassCard>

              {/* Achievements */}
              <GlassCard className="border-subtle !p-5">
                <button
                  onClick={() => setActiveSection(activeSection === "achievements" ? null : "achievements")}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                      <Target size={15} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-main uppercase tracking-wider">Awards & Achievements ({resumeData.achievements?.length || 0})</h3>
                      <p className="text-[10px] text-muted leading-none mt-0.5">Competitions, hackathons, & placements</p>
                    </div>
                  </div>
                  {activeSection === "achievements" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {activeSection === "achievements" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-subtle/40 space-y-4">
                    {(resumeData.achievements || []).map((ach, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-subtle bg-surface/30 space-y-3 relative text-left">
                        {editingIndex.section === "achievements" && editingIndex.index === idx ? (
                          /* Edit Mode fields */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2 flex justify-between items-center pb-2 border-b border-subtle/50">
                              <span className="text-xs font-bold text-accent">Editing Achievement</span>
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit("achievements", idx)} className="btn-primary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1"><Check size={10} /> Done</button>
                                <button onClick={() => setEditingIndex({ section: null, index: null })} className="btn-secondary py-1 px-3 rounded-lg text-[10px] font-bold cursor-pointer">Cancel</button>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelClass}>Achievement Name</label>
                              <input type="text" className={inputClass} value={editForm.title || ""} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                              <label className={labelClass}>Description / Ranking details</label>
                              <textarea rows={2} className={`${inputClass} resize-y`} value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                            </div>
                          </div>
                        ) : (
                          /* View Mode details */
                          <>
                            <div className="absolute top-4 right-4 flex gap-1.5">
                              <button onClick={() => startEditing("achievements", idx, ach)} className="w-7 h-7 rounded-lg hover:bg-surface-hover flex items-center justify-center text-muted hover:text-main cursor-pointer border border-subtle" title="Edit Item"><Edit size={12} /></button>
                              <button onClick={() => deleteItem("achievements", idx)} className="w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-500 cursor-pointer border border-subtle" title="Delete Item"><Trash2 size={12} /></button>
                            </div>
                            <h4 className="text-xs font-bold text-main pr-16">{ach.title || ach.name}</h4>
                            {ach.description && <p className="text-xs text-muted mt-1 leading-relaxed">{ach.description}</p>}
                          </>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addItem("achievements", { title: "1st Place Hackathon Winner", description: "Ranked 1/200 participants at CareerHack 2026." })}
                      className="w-full border border-dashed border-subtle hover:border-focus py-3 rounded-xl text-xs font-bold text-muted hover:text-main transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-surface/5"
                    >
                      <Plus size={14} /> Add Achievement Record
                    </button>
                  </motion.div>
                )}
              </GlassCard>

              {/* Action buttons at bottom */}
              <div className="flex items-center gap-3 pt-4 justify-end">
                <button onClick={handleReset} className="btn-secondary py-3 px-6 rounded-xl text-xs font-bold cursor-pointer">
                  Discard & Re-upload
                </button>
                <button onClick={handleSaveProfile} className="btn-primary py-3 px-8 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md shadow-accent/15">
                  Save Resume & Sync Profile <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column: AI Insights & Suggestions panel */}
            <div className="space-y-6">
              
              {/* ATS and Career Readiness Scores */}
              <GlassCard className="border-accent/20 bg-accent/[0.01] flex flex-col gap-5">
                <h3 className="text-xs font-bold text-main uppercase tracking-widest flex items-center gap-1.5 font-display border-b border-subtle/50 pb-3">
                  <Sparkles size={14} className="text-accent" /> AI Suitability Scans
                </h3>

                <div className="flex justify-around items-center py-2">
                  {/* ATS Compatibility */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-full border-4 border-accent/25 flex items-center justify-center bg-accent/5 glow-sm">
                      <span className="text-base font-extrabold text-accent">{suggestions.atsScore || 70}%</span>
                    </div>
                    <span className="text-[10px] font-bold text-main uppercase tracking-wider block mt-3">ATS Compatibility</span>
                    <span className="text-[8.5px] text-muted leading-tight block mt-0.5">Based on keywords</span>
                  </div>

                  {/* Career Readiness */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-full border-4 border-purple-500/25 flex items-center justify-center bg-purple-500/5">
                      <span className="text-base font-extrabold text-purple-400">{suggestions.careerReadinessScore || 70}%</span>
                    </div>
                    <span className="text-[10px] font-bold text-main uppercase tracking-wider block mt-3">Career Readiness</span>
                    <span className="text-[8.5px] text-muted leading-tight block mt-0.5">Market suitability</span>
                  </div>
                </div>
              </GlassCard>

              {/* Missing Skills tags */}
              {suggestions.missingSkills?.length > 0 && (
                <GlassCard className="border-subtle flex flex-col gap-4 text-left">
                  <h4 className="text-[11px] font-bold text-main uppercase tracking-widest flex items-center gap-1.5 font-display">
                    <AlertCircle size={13} className="text-red-500" /> Missing Skills suggestions
                  </h4>
                  <p className="text-[10px] text-muted leading-relaxed">
                    Gemini scanned your experience and identified missing keywords below. Click any tag to add it to your profile.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {suggestions.missingSkills.map((sk, idx) => (
                      <button
                        key={idx}
                        onClick={() => addMissingSkill(sk)}
                        title={`Click to add ${sk} to your skills list`}
                        className="text-[10px] px-2.5 py-1 bg-red-500/10 hover:bg-green-500/15 text-red-400 hover:text-green-400 border border-red-500/20 hover:border-green-500/30 rounded-lg font-bold tracking-wide uppercase transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={10} /> {sk}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Improvement Tips */}
              {suggestions.improvements?.length > 0 && (
                <GlassCard className="border-subtle flex flex-col gap-3.5 text-left">
                  <h4 className="text-[11px] font-bold text-main uppercase tracking-widest flex items-center gap-1.5 font-display">
                    <CheckCircle2 size={13} className="text-green-500" /> Optimizations & Tips
                  </h4>
                  <ul className="space-y-2">
                    {suggestions.improvements.map((tip, idx) => (
                      <li key={idx} className="text-xs text-muted flex items-start gap-2.5 leading-relaxed bg-surface/30 p-2.5 border border-subtle rounded-xl">
                        <span className="text-green-500 font-bold">{idx + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}

              {/* Recommended Career Paths */}
              {suggestions.recommendedCareerPaths?.length > 0 && (
                <GlassCard className="border-subtle flex flex-col gap-3.5 text-left">
                  <h4 className="text-[11px] font-bold text-main uppercase tracking-widest flex items-center gap-1.5 font-display">
                    <Compass size={13} className="text-accent" /> Recommended Career Paths
                  </h4>
                  <div className="space-y-2">
                    {suggestions.recommendedCareerPaths.map((path, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-subtle bg-surface/25 text-xs font-semibold text-main flex justify-between items-center">
                        <span>{path}</span>
                        <ChevronRight size={14} className="text-muted" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Recommended Internships */}
              {suggestions.recommendedInternships?.length > 0 && (
                <GlassCard className="border-subtle flex flex-col gap-3.5 text-left">
                  <h4 className="text-[11px] font-bold text-main uppercase tracking-widest flex items-center gap-1.5 font-display">
                    <Award size={13} className="text-purple-400" /> Target Job / Internship Matches
                  </h4>
                  <div className="space-y-2">
                    {suggestions.recommendedInternships.map((intern, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-subtle bg-surface/25 text-xs leading-normal font-semibold text-main text-left">
                        <p className="text-xs font-bold text-main">{intern}</p>
                        <p className="text-[10px] text-accent mt-0.5">High Compatibility Rating</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </motion.div>
        )}

        {/* 4. SAVING STEP */}
        {step === "saving" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-20 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-main">Syncing Platform Databases...</h3>
              <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
                Populating your resume builder templates, skill tracker checklist, and career advisor coaching roadmap...
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeImport;
