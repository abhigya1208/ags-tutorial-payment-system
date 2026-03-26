// ─────────────────────────────────────────────────────────────
//  components/Footer.jsx
// ─────────────────────────────────────────────────────────────
import React from "react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-800/60 bg-slate-950/80 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ── Brand ───────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">AG</span>
              </div>
              <span className="font-display font-bold text-white text-lg">AGS Tutorial</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Quality education and strong academic support for secondary and senior secondary students.
              Building conceptual foundations since day one.
            </p>
          </div>

          {/* ── Quick links ─────────────────────────────── */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#courses" className="hover:text-violet-400 transition-colors">Our Courses</a></li>
              <li><a href="#why-us" className="hover:text-violet-400 transition-colors">Why Choose Us</a></li>
              <li><a href="/pay" className="hover:text-violet-400 transition-colors">Pay Fees</a></li>
              <li><a href="/admin/login" className="hover:text-violet-400 transition-colors">Admin Login</a></li>
            </ul>
          </div>

          {/* ── Address ─────────────────────────────────── */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact & Address
            </h4>
            <address className="not-italic text-slate-400 text-sm leading-relaxed">
              <p>A353, Gali No. 8, Part 2</p>
              <p>Pusta Number 1, Sonia Vihar</p>
              <p>Delhi – 110094, India</p>
            </address>
          </div>
        </div>

        {/* ── Bottom strip ──────────────────────────────── */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AGS Tutorial. All rights reserved.</p>
          <p>Payments secured by <span className="text-violet-400 font-medium">Razorpay</span></p>
        </div>
      </div>
    </footer>
  );
}
