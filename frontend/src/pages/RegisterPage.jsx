// ==========================================
// src/pages/RegisterPage.jsx
// ==========================================
// Editorial Luxe Register Page - Dark Editorial Luxe Aesthetic

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome to CareerAI, ${res.data.user.name}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">

      {/* Background Metallic Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="bg-grid-metallic opacity-[0.15]"></div>
        <div className="glow-orb glow-orb--1" style={{ animationDelay: '0s' }}></div>
        <div className="glow-orb glow-orb--2" style={{ animationDelay: '6s' }}></div>
        <div className="glow-orb glow-orb--3" style={{ animationDelay: '12s' }}></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-text-accent)] to-[var(--color-text-accent-muted)] flex items-center justify-center shadow-lg shadow-[var(--color-text-accent)]/20 group-hover:shadow-[var(--color-text-accent)]/40 transition-shadow">
              <Zap size={20} className="text-base" fill="currentColor" />
            </div>
            <span className="font-bold text-main text-2xl tracking-tight">
              Career<span className="text-accent">AI</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass border border-[rgba(212,175,55,0.1)] rounded-[2rem] shadow-2xl sm:px-10 px-6 py-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-headline text-main tracking-tight mb-3">Create your account</h2>
            <p className="text-body text-muted font-medium">Start building your career with AI today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-[var(--color-border-focus)] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="register-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-4 py-3 input-dark rounded-xl text-base focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-[var(--color-border-focus)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="register-email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-4 py-3 input-dark rounded-xl text-base focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-[var(--color-border-focus)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  id="register-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="block w-full pl-10 pr-12 py-3 input-dark rounded-xl text-base focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-main focus:outline-none transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

                {/* Password strength indicator */}
                <div className="flex gap-2 mt-2 text-xs">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${form.password.length >= i * 3
                        ? i === 1 ? "bg-[var(--color-text-accent)]/30" : i === 2 ? "bg-[var(--color-text-accent)]/50" : "bg-[var(--color-text-accent)]"
                        : "bg-[var(--color-border-subtle)]"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-border-focus)] disabled:opacity-70"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>Create Account <ArrowRight size={20} /></>
                )}
              </motion.button>
            </div>
          </form>

          {/* Login link */}
          <p className="mt-10 text-center text-sm text-muted font-medium">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-accent hover:text-[var(--color-text-accent-muted)] transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;