// ==========================================
// src/pages/ProfilePage.jsx
// ==========================================
// User profile with editable info and saved jobs

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Globe, Phone, Target, Save, Trash2, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    location: user?.location || "",
    website: user?.website || "",
    phone: user?.phone || "",
    targetRole: user?.targetRole || "",
    experienceLevel: user?.experienceLevel || "",
  });
  const [saving, setSaving] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (activeTab === "saved") {
      api.get("/jobs/saved").then(res => setSavedJobs(res.data.jobs));
    }
  }, [activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      updateUser(res.data.user);
      toast.success("Profile saved! ✅");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const removeSavedJob = async (id) => {
    try {
      await api.delete(`/jobs/saved/${id}`);
      setSavedJobs(prev => prev.filter(j => j._id !== id));
      toast.success("Job removed");
    } catch {
      toast.error("Failed to remove job");
    }
  };

  const inputCls = "w-full input-dark rounded-xl py-2.5 px-4 text-sm";
  const labelCls = "text-sm text-muted font-medium mb-1.5 block";

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-subtle mb-6 flex items-center gap-6 shadow-sm"
        >
          <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-3xl font-black text-white flex-shrink-0 glow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-main">{user?.name}</h2>
            <p className="text-muted">{user?.email}</p>
            {form.headline && <p className="text-[var(--color-brand-500)] text-sm mt-1">{form.headline}</p>}
            {form.location && (
              <p className="text-muted text-xs flex items-center gap-1 mt-1">
                <MapPin size={11} /> {form.location}
              </p>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["profile", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border border-[var(--color-brand-500)]/30 shadow-sm"
                  : "btn-secondary border-transparent"
              }`}
            >
              {tab === "saved" ? "📌 Saved Jobs" : "👤 Profile"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleSave} className="space-y-4">
              <GlassCard className="!p-6 border-subtle">
                <h3 className="text-main font-semibold mb-4 flex items-center gap-2"><User size={16} className="text-[var(--color-brand-500)]" /> Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={labelCls}>Professional Headline</label>
                    <input className={inputCls} value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} placeholder="e.g., Full Stack Developer" />
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <input className={inputCls} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, Country" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input className={inputCls} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className={labelCls}>Website / Portfolio</label>
                    <input className={inputCls} value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="yourwebsite.com" />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-6 border-subtle">
                <h3 className="text-main font-semibold mb-4 flex items-center gap-2"><Target size={16} className="text-purple-500" /> Career Goals</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Target Role</label>
                    <input className={inputCls} value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})} placeholder="e.g., Software Engineer" />
                  </div>
                  <div>
                    <label className={labelCls}>Experience Level</label>
                    <select className={inputCls} value={form.experienceLevel} onChange={e => setForm({...form, experienceLevel: e.target.value})}>
                      <option value="">-- Select level --</option>
                      <option value="fresher">Fresher (0 years)</option>
                      <option value="junior">Junior (1-2 years)</option>
                      <option value="mid">Mid-level (3-5 years)</option>
                      <option value="senior">Senior (5+ years)</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <button
                type="submit"
                id="save-profile-btn"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary font-semibold disabled:opacity-50 mt-4"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === "saved" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {savedJobs.length === 0 ? (
              <GlassCard className="text-center py-12 border-subtle">
                <div className="text-4xl mb-3">📌</div>
                <h3 className="text-main font-semibold mb-2">No saved jobs yet</h3>
                <p className="text-muted text-sm">Go to Jobs page and save interesting opportunities.</p>
              </GlassCard>
            ) : (
              savedJobs.map((job) => (
                <GlassCard key={job._id} className="border-subtle hover:border-focus transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-brand-500)]/10 text-[var(--color-brand-500)] border border-[var(--color-brand-500)]/20 capitalize">{job.type}</span>
                        {job.matchScore > 0 && <span className="text-xs text-green-500">{job.matchScore}% match</span>}
                      </div>
                      <h4 className="text-main font-semibold">{job.role}</h4>
                      <p className="text-muted text-sm">{job.company} · {job.location}</p>
                      {job.salary && <p className="text-green-500 text-xs mt-1">💰 {job.salary}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={job.applyUrl || "#"} target="_blank" rel="noreferrer" className="text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] transition-colors p-2 glass rounded-lg">
                        <ExternalLink size={16} />
                      </a>
                      <button onClick={() => removeSavedJob(job._id)} className="text-red-500 hover:text-red-600 transition-colors p-2 glass rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
