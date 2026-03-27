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
    setApiError(""); // Clear previous errors
    
    try {
      // Endpoint is /auth/login because api.js already adds /api
      const res = await api.post("/auth/login", form); 
      
      if (res.data.success) {
        login(res.data.token, res.data.admin);
        navigate("/admin", { replace: true });
      }
    } catch (err) {
      // Uses the message returned by the interceptor
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-orange-600/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">AG</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">AGS Tutorial Dashboard</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl px-8 py-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="admin.ags@edu"
                className={`w-full bg-slate-800 border ${errors.username ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">⚠ {errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-600'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">⚠ {errors.password}</p>}
            </div>

            {apiError && (
              <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3">
                <p className="text-red-300 text-sm">⚠ {apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-slate-500 text-sm">
          <Link to="/" className="hover:text-violet-400 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}