// ==========================================
// src/pages/ProfilePage.jsx
// ==========================================
// User profile and account settings

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Target, Save, Trash2, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
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
      api.get("/jobs/saved").then((res) => setSavedJobs(res.data.jobs || []));
    }
  }, [activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      updateUser(res.data.user);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const removeSavedJob = async (id) => {
    try {
      await api.delete(`/jobs/saved/${id}`);
      setSavedJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job removed");
    } catch {
      toast.error("Failed to remove job");
    }
  };

  const labelCls = "text-xs text-zinc-400 font-medium mb-1.5 block";

  return (
    <DashboardLayout title="Settings & Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Profile Card Header */}
        <div className="card-clean rounded-2xl p-6 border border-white/[0.08] bg-[#131316] flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400 shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-zinc-400">{user?.email}</p>
            {form.headline && (
              <p className="text-xs text-blue-400 font-medium pt-0.5">{form.headline}</p>
            )}
            {form.location && (
              <p className="text-xs text-zinc-500 flex items-center gap-1 pt-0.5">
                <MapPin size={11} /> {form.location}
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#131316] border border-white/[0.08] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Profile Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="card-clean rounded-2xl p-6 bg-[#131316] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <User size={15} className="text-blue-500" /> Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Professional Headline</label>
                  <input
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City, Country or Remote"
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555-0199"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Portfolio or GitHub URL</label>
                  <input
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            <div className="card-clean rounded-2xl p-6 bg-[#131316] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Target size={15} className="text-blue-500" /> Career Target
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Target Role</label>
                  <input
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                    placeholder="e.g. Full Stack Engineer"
                  />
                </div>
                <div>
                  <label className={labelCls}>Experience Level</label>
                  <select
                    className="w-full input-clean text-xs bg-[#0E0E11]"
                    value={form.experienceLevel}
                    onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                  >
                    <option value="">-- Select level --</option>
                    <option value="entry">Entry-Level / Fresher</option>
                    <option value="junior">Junior (1-2 yrs)</option>
                    <option value="mid">Mid-Level (3-5 yrs)</option>
                    <option value="senior">Senior (5+ yrs)</option>
                    <option value="lead">Staff / Lead</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs !py-2.5 !px-5 disabled:opacity-50"
              >
                <Save size={13} className="mr-1.5" />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === "saved" && (
          <div className="space-y-3">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div
                  key={job._id}
                  className="card-clean p-4 rounded-xl bg-[#131316] border border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-white">{job.role}</h4>
                    <p className="text-[11px] text-zinc-400">{job.company} • {job.location || "Remote"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary text-[11px] !py-1 !px-2.5 flex items-center gap-1"
                      >
                        Apply <ExternalLink size={10} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => removeSavedJob(job._id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-clean p-10 rounded-2xl bg-[#131316] border border-dashed border-white/10 text-center">
                <p className="text-xs text-zinc-400">No saved jobs yet.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
