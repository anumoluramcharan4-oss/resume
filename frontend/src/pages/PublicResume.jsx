// ==========================================
// src/pages/PublicResume.jsx
// ==========================================
// Standalone public-facing page to view shared resumes.
// Renders the resume beautifully in A4 dimensions, with action controls.

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Printer, Download, AlertCircle, FileText, Loader2 } from "lucide-react";
import axios from "axios"; // Using axios directly for public requests to avoid Auth token issues
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ATSFriendlyTemplate from "../components/templates/ATSFriendlyTemplate";
import toast from "react-hot-toast";

const PublicResume = () => {
  const { shareId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  
  const printRef = useRef();

  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/resumes/public/${shareId}`);
        setResume(res.data.resume);
        
        // Update document title for SEO
        if (res.data.resume?.personal?.fullName) {
          document.title = `${res.data.resume.personal.fullName}'s Resume — Powered by CareerAI`;
        }
      } catch (err) {
        console.error("Fetch shared resume error:", err);
        setError(err.response?.data?.message || "This shared resume is private or has expired.");
      } finally {
        setLoading(false);
      }
    };
    
    if (shareId) {
      fetchPublicResume();
    }
  }, [shareId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!resume || downloading) return;
    setDownloading(true);
    const loadToast = toast.loading("Generating high-quality PDF... 📥");
    
    try {
      // Log export analytics event on the backend
      try {
        await axios.post(`/api/resumes/${resume._id}/track-export`);
      } catch (e) {
        console.warn("Analytics tracking failed:", e);
      }

      // Generate client-side PDF
      const html2pdf = (await import("html2pdf.js")).default;
      const element = printRef.current;
      if (!element) throw new Error("Template container missing");

      const opt = {
        margin: 0,
        filename: `${resume.personal?.fullName || "resume"}_shared.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      
      await html2pdf().set(opt).from(element).save();
      toast.success("Downloaded PDF successfully!", { id: loadToast });
    } catch (err) {
      console.error(err);
      toast.error("Failed to build PDF. Please try printing to PDF instead.", { id: loadToast });
    } finally {
      setDownloading(false);
    }
  };

  const renderTemplate = () => {
    if (!resume) return null;
    const props = { resume };
    switch (resume.template) {
      case "minimal": return <MinimalTemplate {...props} />;
      case "professional": return <ProfessionalTemplate {...props} />;
      case "ats-friendly": return <ATSFriendlyTemplate {...props} />;
      default: return <ModernTemplate {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mb-4" />
        <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">Retrieving shared document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm leading-relaxed mb-6">
          {error}
        </p>
        <a 
          href="/" 
          className="text-xs font-bold px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl transition-all shadow-md"
        >
          Go to CareerAI
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#09090b] pb-12 print:bg-white print:p-0">
      {/* Floating Action Topbar (Hidden during print) */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-neutral-800/50 px-6 py-4 flex items-center justify-between print:hidden backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-500 to-amber-500 flex items-center justify-center text-black font-black text-xs">
            CA
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">CareerAI Shared Resume</span>
            <p className="text-[10px] text-gray-400 font-medium mt-px">Verified Candidate Document</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <Printer size={13} /> Print
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download size={13} />
            )}
            Download PDF
          </button>
        </div>
      </header>

      {/* A4 Resume Visualizer */}
      <main className="max-w-4xl mx-auto mt-6 sm:mt-10 px-4 print:mt-0 print:px-0">
        <div 
          ref={printRef}
          className="bg-white shadow-xl dark:shadow-neutral-950/20 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800 print:shadow-none print:border-none print:rounded-none"
        >
          {renderTemplate()}
        </div>
      </main>

      {/* Footer (Hidden during print) */}
      <footer className="text-center mt-12 text-xs text-gray-400 dark:text-neutral-500 print:hidden font-sans">
        This document was created and shared using <a href="/" className="text-yellow-500 hover:underline font-semibold">CareerAI</a>.
      </footer>
    </div>
  );
};

export default PublicResume;
