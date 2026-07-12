"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("All fields are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-white/10 backdrop-blur-xl p-8 shadow-2xl"
        >
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-slate-100/95 px-4 py-2 transition hover:bg-slate-200 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-blue-600 ring-1 ring-sky-400/30">
                <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="20" width="28" height="16" rx="3" fill="#0EA5E9" />
                  <path d="M12 22L24 11L36 22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 36V26H28V36" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your StayWay Finder account</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-4"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4"
            >
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-400">{success}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-12 py-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded bg-white/10 border border-white/20 accent-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot Password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-sm text-slate-500">New to StayWay?</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Sign Up Link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
            <p className="text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition">
                Create Account
              </Link>
            </p>
          </motion.div>

          {/* Demo Credentials Hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-slate-500 mb-2">
              <span className="font-semibold text-blue-400">Demo Credentials:</span>
            </p>
            <p className="text-xs text-slate-400">Email: demo@example.com</p>
            <p className="text-xs text-slate-400">Password: demo123</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
