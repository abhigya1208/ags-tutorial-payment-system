// ─────────────────────────────────────────────────────────────
//  pages/ReceiptPage.jsx  –  Payment success + downloadable receipt
// ─────────────────────────────────────────────────────────────
import React, { useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { generateReceiptPDF } from "../utils/generatePDF";
import Navbar from "../components/Navbar";

export default function ReceiptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);

  // Payment data passed from PaymentPage via router state
  const payment = location.state?.payment;

  // If user lands here directly without data, redirect home
  if (!payment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-slate-400 text-lg">No receipt data found.</p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    );
  }

  const {
    mobileNumber,
    studentClass,
    amount,
    razorpayPaymentId,
    razorpayOrderId,
    createdAt,
    status,
  } = payment;

  const formattedDate = new Date(createdAt).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const rows = [
    { label: "Mobile Number",  value: mobileNumber,         icon: "📱" },
    { label: "Class",          value: `Class ${studentClass}`, icon: "🎓" },
    { label: "Amount Paid",    value: `₹ ${Number(amount).toLocaleString("en-IN")}`, icon: "💰", highlight: true },
    { label: "Payment ID",     value: razorpayPaymentId,    icon: "🔑" },
    { label: "Order ID",       value: razorpayOrderId,      icon: "📋" },
    { label: "Date & Time",    value: formattedDate,        icon: "📅" },
    { label: "Status",         value: "✅ Payment Successful", icon: "✔", success: true },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-lg animate-fadeInUp">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50
                            flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Payment Successful!</h1>
            <p className="text-slate-400 mt-2">
              Your fee has been received. Here is your receipt.
            </p>
          </div>

          {/* Receipt card */}
          <div
            ref={receiptRef}
            className="glass-card border border-slate-700/50 overflow-hidden"
          >
            {/* Card top bar */}
            <div className="bg-gradient-to-r from-violet-600 to-emerald-600 h-2" />

            <div className="px-8 py-6">
              {/* Institute header inside card */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-700/60">
                <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">AG</span>
                </div>
                <div>
                  <p className="font-display font-bold text-white">AGS Tutorial</p>
                  <p className="text-slate-400 text-xs">Fee Payment Receipt</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30
                                   px-3 py-1 rounded-full font-medium">
                    PAID
                  </span>
                </div>
              </div>

              {/* Receipt rows */}
              <div className="space-y-3">
                {rows.map(({ label, value, icon, highlight, success }) => (
                  <div
                    key={label}
                    className={`flex items-start justify-between gap-4 py-2.5 px-3 rounded-lg
                      ${highlight ? "bg-violet-500/10 border border-violet-500/20" : ""}
                      ${success ? "bg-emerald-500/10 border border-emerald-500/20" : ""}
                    `}
                  >
                    <span className="text-slate-400 text-sm flex items-center gap-2 shrink-0">
                      <span>{icon}</span>
                      {label}
                    </span>
                    <span
                      className={`text-sm font-medium text-right break-all
                        ${highlight ? "text-violet-300 text-base font-bold" : "text-slate-200"}
                        ${success ? "text-emerald-400 font-semibold" : ""}
                      `}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-700 my-6" />

              {/* Address */}
              <p className="text-slate-500 text-xs text-center leading-relaxed">
                A353, Gali No. 8, Part 2, Pusta Number 1<br />
                Sonia Vihar, Delhi – 110094, India
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => generateReceiptPDF(payment)}
              className="btn-primary flex-1 py-3.5"
            >
              ⬇ Download PDF Receipt
            </button>
            <button
              onClick={() => navigate("/pay")}
              className="btn-secondary flex-1 py-3.5"
            >
              Make Another Payment
            </button>
          </div>

          <p className="text-center mt-5 text-slate-500 text-sm">
            <Link to="/" className="hover:text-violet-400 transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
