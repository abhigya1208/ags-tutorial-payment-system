// ─────────────────────────────────────────────────────────────
//  pages/PaymentPage.jsx  –  Fee payment form + Razorpay flow
// ─────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";

const CLASS_OPTIONS = ["8", "9", "10", "11", "12"];

export default function PaymentPage() {
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────
  const [form, setForm] = useState({
    mobileNumber: "",
    studentClass: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Handle input change ────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // ── Client-side validation ─────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (!form.studentClass) {
      newErrors.studentClass = "Please select your class";
    }
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt < 50) {
      newErrors.amount = "Minimum amount is ₹50";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Load Razorpay checkout ─────────────────────────────
  const openRazorpay = (orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,           // in paise
      currency: orderData.currency,
      name: "AGS Tutorial",
      description: `Class ${form.studentClass} Fee Payment`,
      order_id: orderData.orderId,
      prefill: {
        contact: form.mobileNumber,
      },
      theme: { color: "#8b5cf6" },

      // ── On success ─────────────────────────────────────
      handler: async (response) => {
        try {
          setLoading(true);
          const verifyRes = await api.post("/payment/verify", {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            // Navigate to receipt page, passing payment data via state
            navigate("/receipt", { state: { payment: verifyRes.data.payment } });
          } else {
            setApiError("Payment verification failed. Please contact support.");
          }
        } catch (err) {
          setApiError(err.message || "Verification error. Please contact support.");
        } finally {
          setLoading(false);
        }
      },

      // ── On modal close ─────────────────────────────────
      modal: {
        ondismiss: () => {
          setLoading(false);
          setApiError("Payment was cancelled. You can try again.");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    // Handle payment failure from Razorpay side
    rzp.on("payment.failed", (response) => {
      setLoading(false);
      setApiError(
        `Payment failed: ${response.error.description || "Unknown error"}. Please try again.`
      );
    });

    rzp.open();
  };

  // ── Form submit ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await api.post("/payment/create-order", {
        mobileNumber: form.mobileNumber,
        studentClass: form.studentClass,
        amount: Number(form.amount),
      });

      if (res.data.success) {
        // Hand off to Razorpay checkout
        openRazorpay(res.data);
      } else {
        setApiError(res.data.message || "Could not initiate payment.");
        setLoading(false);
      }
    } catch (err) {
      setApiError(err.message || "Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {loading && <Loader fullPage message="Processing payment…" />}

      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-32 left-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md animate-fadeInUp">
          {/* Card header */}
          <div className="glass-card border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-violet-800 px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AG</span>
                </div>
                <div>
                  <h1 className="font-display font-bold text-white text-xl">AGS Tutorial</h1>
                  <p className="text-violet-200 text-xs">Secure Fee Payment</p>
                </div>
              </div>
              <p className="text-violet-100 text-sm mt-3">
                Fill in your details below and pay securely via UPI, Card or NetBanking.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`form-input ${errors.mobileNumber ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {errors.mobileNumber && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.mobileNumber}
                  </p>
                )}
              </div>

              {/* Class */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Class <span className="text-red-400">*</span>
                </label>
                <select
                  name="studentClass"
                  value={form.studentClass}
                  onChange={handleChange}
                  className={`form-input ${errors.studentClass ? "border-red-500 focus:ring-red-500" : ""}`}
                >
                  <option value="">— Select your class —</option>
                  {CLASS_OPTIONS.map((cls) => (
                    <option key={cls} value={cls}>
                      Class {cls}
                    </option>
                  ))}
                </select>
                {errors.studentClass && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.studentClass}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Amount (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Minimum ₹50"
                    min={50}
                    className={`form-input pl-8 ${errors.amount ? "border-red-500 focus:ring-red-500" : ""}`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.amount}
                  </p>
                )}
              </div>

              {/* API error */}
              {apiError && (
                <div className="bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-3">
                  <p className="text-red-300 text-sm">{apiError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base rounded-xl mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>💳 Pay ₹{form.amount || "—"} Now</>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  🔒 SSL Secured
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500 text-xs">Powered by Razorpay</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  ✅ Instant Receipt
                </span>
              </div>
            </form>
          </div>

          {/* Back link */}
          <p className="text-center mt-6 text-slate-500 text-sm">
            <a href="/" className="hover:text-violet-400 transition-colors">
              ← Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
