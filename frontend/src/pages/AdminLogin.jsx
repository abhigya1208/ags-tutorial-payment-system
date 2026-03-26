// ─────────────────────────────────────────────────────────────
//  pages/AdminLogin.jsx  –  Admin login form
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Already logged in → redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) navigate("/admin", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/api/a/login", form); // <-- /api added for Render
      if (res.data.success) {
        login(res.data.token, res.data.admin);
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-orange-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-display font-bold text-xl">AG</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">AGS Tutorial Dashboard</p>
        </div>

        {/* Card */}
        <div className="glass-card border border-slate-700/50 px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin.ags@edu"
                autoComplete="username"
                className={`form-input ${errors.username ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1.5">⚠ {errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className={`form-input pr-12 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200
                             focus:outline-none text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">⚠ {errors.password}</p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3">
                <p className="text-red-300 text-sm">⚠ {apiError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-slate-500 text-sm">
          <Link to="/" className="hover:text-violet-400 transition-colors">
            ← Back to Home
          </Link>
        </p>

        {/* Hint */}
        <div className="mt-4 glass-card border border-slate-700/30 px-4 py-3 text-center">
          <p className="text-slate-500 text-xs">
            Default credentials: <span className="text-violet-400">admin.ags@edu</span> / <span className="text-violet-400">Abhigya@1208</span>
          </p>
          <p className="text-slate-600 text-xs mt-1">
            (Run <code className="bg-slate-800 px-1 rounded">/api/auth/seed</code> POST once to create the admin)
          </p>
        </div>
      </div>
    </div>
  );
}