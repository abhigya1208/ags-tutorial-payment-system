import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch payments ─────────────────────────────────────
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // FIXED: removed "/api" because it's already in api.js baseURL
      const res = await api.get("/admin/payments"); 
      if (res.data.success) {
        setPayments(res.data.payments); 
        setTotal(res.data.totalCollection);
      }
    } catch (err) {
      setError(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 p-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-violet-400">AGS Admin</h1>
          <button onClick={() => { logout(); navigate("/admin/login"); }} className="text-sm bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Total Collections</p>
            <h2 className="text-3xl font-bold text-emerald-400 mt-1">{formatINR(total)}</h2>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Total Students Paid</p>
            <h2 className="text-3xl font-bold text-violet-400 mt-1">{payments.length}</h2>
          </div>
          <div className="flex items-end">
            <button onClick={fetchPayments} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl border border-slate-700 transition-all">🔄 Refresh Data</button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-800">
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Mobile</th>
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-500">No successful payments found.</td></tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-white">{p.studentName || "Guest"}</td>
                      <td className="p-4 text-slate-400">{p.mobileNumber}</td>
                      <td className="p-4 text-slate-400">Class {p.studentClass}</td>
                      <td className="p-4 font-bold text-emerald-400">{formatINR(p.amount)}</td>
                      <td className="p-4 text-slate-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}