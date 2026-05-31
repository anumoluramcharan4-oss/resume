// ==========================================
// src/pages/ResumePreview.jsx
// ==========================================
// Full-page resume preview with download PDF option

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Edit, Trash2, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";
import toast from "react-hot-toast";

const ResumePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/resumes/${id}`);
        setResume(res.data.resume);
      } catch {
        toast.error("Resume not found");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success("Resume deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Dynamically import html2pdf to keep bundle size small
      const html2pdf = (await import("html2pdf.js")).default;
      const element = resumeRef.current;
      const opt = {
        margin: 0,
        filename: `${resume.personal?.fullName || "resume"}_resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded! 📥");
    } catch (err) {
      toast.error("PDF generation failed. Try again.");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const renderTemplate = () => {
    if (!resume) return null;
    switch (resume.template) {
      case "minimal": return <MinimalTemplate resume={resume} />;
      case "professional": return <ProfessionalTemplate resume={resume} />;
      default: return <ModernTemplate resume={resume} />;
    }
  };

  if (loading) return (
    <DashboardLayout title="Resume Preview">
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Resume Preview">
      <div className="max-w-5xl mx-auto">
        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 glass rounded-[1.5rem] p-4 border border-subtle shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm text-muted hover:text-main transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <div className="w-px h-5 bg-[var(--color-border-subtle)]" />
            <div>
              <h2 className="text-main font-semibold text-sm">{resume.title}</h2>
              <p className="text-muted text-xs capitalize">{resume.template} Template</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/ai?resumeId=${id}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-colors font-medium"
            >
              <Sparkles size={13} /> AI Analyze
            </Link>
            <Link
              to={`/resume/${id}/edit`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs btn-secondary"
            >
              <Edit size={13} /> Edit
            </Link>
            <button
              onClick={handleDownload}
              disabled={downloading}
              id="download-pdf-btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs btn-primary font-medium disabled:opacity-50"
            >
              <Download size={13} /> {downloading ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </motion.div>

        {/* ATS Score Badge */}
        {resume.atsScore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 flex items-center gap-2 p-3 glass rounded-xl border border-green-500/20"
          >
            <div className="text-green-500 font-bold text-lg">{resume.atsScore}%</div>
            <div>
              <p className="text-xs font-medium text-green-500">ATS Score</p>
              <p className="text-xs text-muted">{resume.aiAnalysis}</p>
            </div>
          </motion.div>
        )}

        {/* Resume Paper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="shadow-xl"
        >
          <div ref={resumeRef} className="bg-white">
            {renderTemplate()}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ResumePreview;
