// ==========================================
// src/pages/LoginPage.jsx
// ==========================================
// Editorial Luxe Login Page - Dark Editorial Luxe Aesthetic

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">

      {/* Background Metallic Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="bg-grid-metallic opacity-[0.15]"></div>
        <div className="glow-orb glow-orb--1" style={{ animationDelay: '0s' }}></div>
        <div className="glow-orb glow-orb--2" style={{ animationDelay: '6s' }}></div>
        <div className="glow-orb glow-orb--3" style={{ animationDelay: '12s' }}></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
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
          className="glass border border-[rgba(212,175,55,0.1)] rounded-[2.25rem] shadow-2xl sm:p-12 p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-headline text-main tracking-tight mb-2">Welcome back</h2>
            <p className="text-body-sm text-muted font-medium">Log in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-[var(--color-border-focus)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-4 py-3 input-dark rounded-xl text-base focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-main mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-[var(--color-border-focus)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 input-dark rounded-xl text-base focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-main focus:outline-none transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[rgba(212,175,55,0.2)] bg-base text-[var(--color-text-accent)] focus:ring-[var(--color-text-accent)]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted font-medium">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-[var(--color-text-accent)] hover:text-[var(--color-text-accent-muted)] transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-4">
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
                  ></motion.div>
                ) : (
                  <>Sign In <ArrowRight size={20} /></>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(212,175,55,0.1)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-base text-muted font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <a
                href="#"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[rgba(212,175,55,0.1)] bg-base text-main font-medium hover:bg-surface-hover hover:border-[var(--color-border-focus)] transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </a>

              <a
                href="#"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-[rgba(212,175,55,0.1)] bg-base text-main font-medium hover:bg-surface-hover hover:border-[var(--color-border-focus)] transition-all"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub
              </a>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-muted font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-accent hover:text-[var(--color-text-accent-muted)] transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;