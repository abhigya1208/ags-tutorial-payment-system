// ─────────────────────────────────────────────────────────────
//  pages/AdminDashboard.jsx  –  Admin payments dashboard
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { generateReceiptPDF } from "../utils/generatePDF";

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
  const ITEMS_PER_PAGE = 10;

  // ── Fetch payments from API ────────────────────────────
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/payments");
      if (res.data.success) {
        setPayments(res.data.payments);
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

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ── Logout handler ─────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // ── Filtered + paginated list ──────────────────────────
  const filtered = payments.filter((p) => {
    const matchSearch = p.mobileNumber.includes(searchTerm) || p.razorpayPaymentId?.includes(searchTerm);
    const matchClass  = filterClass === "all" || p.studentClass === filterClass;
    return matchSearch && matchClass;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterClass]);

  // ── Format currency ────────────────────────────────────
  const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  // ── Summary stats ──────────────────────────────────────
  const avgPayment = payments.length ? Math.round(total / payments.length) : 0;
  const todayCount = payments.filter(
    (p) => new Date(p.createdAt).toDateString() === new Date().toDateString()
  ).length;

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
            <span className="text-slate-400 text-sm hidden sm:block">
              👤 {admin?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 text-sm border border-slate-700
                         hover:border-red-500/50 px-3 py-1.5 rounded-lg transition-all"
            >
              Logout
            </button>
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
          <button
            onClick={fetchPayments}
            className="btn-secondary text-sm py-2 px-4"
          >
            🔄 Refresh
          </button>
        </div>

        {/* ── Summary cards ────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Collections", value: formatINR(total),        icon: "💰", color: "text-emerald-400" },
            { label: "Total Payments",    value: payments.length,          icon: "📋", color: "text-violet-400" },
            { label: "Today's Payments",  value: todayCount,               icon: "📅", color: "text-amber-400" },
            { label: "Average Payment",   value: formatINR(avgPayment),    icon: "📊", color: "text-orange-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card border border-slate-700/50 p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`font-display text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filters ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by mobile or payment ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input sm:max-w-xs"
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="form-input sm:max-w-[160px]"
          >
            <option value="all">All Classes</option>
            {["8","9","10","11","12"].map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          {(searchTerm || filterClass !== "all") && (
            <button
              onClick={() => { setSearchTerm(""); setFilterClass("all"); }}
              className="text-slate-400 hover:text-slate-200 text-sm px-3 py-2 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Table ────────────────────────────────────── */}
        {loading ? (
          <Loader message="Loading payments…" />
        ) : error ? (
          <div className="glass-card border border-red-500/30 p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchPayments} className="btn-primary mt-4 text-sm py-2">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-400">No payments found matching your filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="glass-card border border-slate-700/50 overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900/60">
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">#</th>
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Mobile</th>
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Class</th>
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Amount</th>
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Payment ID</th>
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Date & Time</th>
                      <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p, idx) => (
                      <tr
                        key={p._id}
                        className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-4 text-slate-500">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </td>
                        <td className="px-5 py-4 text-slate-200 font-medium">{p.mobileNumber}</td>
                        <td className="px-5 py-4">
                          <span className="bg-violet-500/15 text-violet-300 border border-violet-500/25 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            Class {p.studentClass}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-emerald-400 font-semibold">
                          {formatINR(p.amount)}
                        </td>
                        <td className="px-5 py-4 text-slate-400 font-mono text-xs max-w-[180px] truncate">
                          {p.razorpayPaymentId || "—"}
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => generateReceiptPDF(p)}
                            title="Download PDF Receipt"
                            className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10
                                       px-3 py-1.5 rounded-lg text-xs border border-violet-500/20
                                       hover:border-violet-500/50 transition-all"
                          >
                            ⬇ PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden space-y-3">
              {paginated.map((p, idx) => (
                <div key={p._id} className="glass-card border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 font-bold text-lg">{formatINR(p.amount)}</span>
                    <span className="bg-violet-500/15 text-violet-300 border border-violet-500/25 px-2.5 py-0.5 rounded-full text-xs">
                      Class {p.studentClass}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium text-sm mb-1">📱 {p.mobileNumber}</p>
                  <p className="text-slate-500 text-xs mb-1 font-mono truncate">
                    🔑 {p.razorpayPaymentId || "—"}
                  </p>
                  <p className="text-slate-500 text-xs mb-3">
                    📅 {new Date(p.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <button
                    onClick={() => generateReceiptPDF(p)}
                    className="text-violet-400 hover:text-violet-300 text-xs border border-violet-500/20
                               hover:border-violet-500/50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    ⬇ Download PDF
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-slate-400 text-sm">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-700 text-slate-300
                               hover:border-violet-500/50 hover:text-violet-300 disabled:opacity-40
                               disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm rounded-lg border border-slate-700 text-slate-300
                               hover:border-violet-500/50 hover:text-violet-300 disabled:opacity-40
                               disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
