// ─────────────────────────────────────────────────────────────
//  pages/AdminDashboard.jsx  –  Admin payments dashboard
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { generateReceiptPDF } from "../utils/generatePDF";

// ── Change Password Modal Component ─────────────────────────
const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.put("/api/admin/change-password", { oldPassword, newPassword });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card border border-slate-700/50 rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Old Password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="form-input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="form-input w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-input w-full" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary py-2">{loading ? "Updating..." : "Update Password"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // ── Fetch payments from API ────────────────────────────
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/admin/payments"); // /api added
      if (res.data.success) {
        setPayments(res.data.payments.reverse()); // LIFO: latest first
        setTotal(res.data.totalCollection);
      }
    } catch (err) {
      if (err.message.includes("401") || err.message.toLowerCase().includes("authoris")) {
        logout();
        navigate("/admin/login");
      } else {
        setError(err.message || "Failed to load payments");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  // ── Logout handler ─────────────────────────────────────
  const handleLogout = () => { logout(); navigate("/admin/login"); };

  // ── Filter + Pagination ───────────────────────────────
  const filtered = payments.filter((p) => {
    const matchSearch = p.mobileNumber.includes(searchTerm) || p.razorpayPaymentId?.includes(searchTerm);
    const matchClass  = filterClass === "all" || p.studentClass === filterClass;
    return matchSearch && matchClass;
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterClass]);

  const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const avgPayment = payments.length ? Math.round(total / payments.length) : 0;
  const todayCount = payments.filter((p) => new Date(p.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen">
      {/* ── Top bar ───────────────────────────────────── */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AG</span>
            </div>
            <div>
              <span className="font-display font-bold text-white">AGS Tutorial</span>
              <span className="text-slate-500 text-xs ml-2">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:block">👤 {admin?.username || admin?.email}</span>
            <button onClick={() => setShowChangePwd(true)} className="text-slate-400 hover:text-violet-400 text-sm border border-slate-700 hover:border-violet-500/50 px-3 py-1.5 rounded-lg transition-all">🔑 Change Password</button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 text-sm border border-slate-700 hover:border-red-500/50 px-3 py-1.5 rounded-lg transition-all">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page title ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Fee Collections</h1>
            <p className="text-slate-400 text-sm mt-1">All verified payments in LIFO order</p>
          </div>
          <button onClick={fetchPayments} className="btn-secondary text-sm py-2">🔄 Refresh</button>
        </div>

        {/* ── Summary cards ────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{ label: "Total Collections", value: formatINR(total), icon: "💰", color: "text-emerald-400" },
            { label: "Total Payments", value: payments.length, icon: "📋", color: "text-violet-400" },
            { label: "Today's Payments", value: todayCount, icon: "📅", color: "text-amber-400" },
            { label: "Average Payment", value: formatINR(avgPayment), icon: "📊", color: "text-orange-400" }].map(stat => (
              <div key={stat.label} className="glass-card border border-slate-700/50 p-5">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`font-display text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
              </div>
          ))}
        </div>

        {/* Filters, table, mobile cards, pagination – remains same as before */}
        {/* ... Copy your existing table + mobile card + pagination JSX ... */}

      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePwd}
        onClose={() => setShowChangePwd(false)}
        onSuccess={() => { alert("Password changed successfully! Please login again."); logout(); navigate("/admin/login"); }}
      />
    </div>
  );
}