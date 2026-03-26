// ─────────────────────────────────────────────────────────────
//  pages/HomePage.jsx  –  Landing page with all sections
// ─────────────────────────────────────────────────────────────
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ── Data ──────────────────────────────────────────────────
const courses = [
  {
    icon: "📚",
    title: "Class 8 – 10",
    subtitle: "Secondary School",
    desc: "All subjects with concept-based teaching. Regular tests and doubt sessions to build a strong foundation.",
    color: "from-violet-600 to-violet-800",
    border: "border-violet-500/30",
  },
  {
    icon: "🧮",
    title: "Class 11 – 12",
    subtitle: "Commerce Batch",
    desc: "Specialised Commerce batches covering Accounts, Economics, Business Studies and Mathematics.",
    color: "from-emerald-600 to-emerald-800",
    border: "border-emerald-500/30",
  },
  {
    icon: "🌉",
    title: "Bridge Course",
    subtitle: "Transition Support",
    desc: "Dedicated bridge courses to help students smoothly transition between academic levels.",
    color: "from-amber-500 to-orange-600",
    border: "border-amber-500/30",
  },
  {
    icon: "📝",
    title: "Test Series",
    subtitle: "Exam Preparation",
    desc: "Structured test series mimicking board exam patterns with detailed analysis and feedback.",
    color: "from-orange-500 to-red-600",
    border: "border-orange-500/30",
  },
];

const features = [
  { icon: "👥", title: "Small Batch Sizes",        desc: "Personalised attention with intentionally small batches so every student gets noticed." },
  { icon: "💡", title: "Concept-Based Teaching",   desc: "We build understanding from scratch, not rote learning. Concepts first, always." },
  { icon: "🙋", title: "Doubt Solving Sessions",   desc: "Dedicated doubt-clearing classes so no question ever goes unanswered." },
  { icon: "📊", title: "Structured Testing",        desc: "Regular tests with detailed performance tracking and parent feedback." },
  { icon: "🤝", title: "Supportive Environment",   desc: "A friendly, encouraging atmosphere where students feel safe to learn and fail forward." },
  { icon: "🏆", title: "Proven Results",            desc: "Consistently high board scores across all our batches year after year." },
];

const stats = [
  { value: "500+", label: "Students Enrolled" },
  { value: "10+",  label: "Years of Excellence" },
  { value: "95%",  label: "Board Success Rate" },
  { value: "5",    label: "Classes Offered" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ━━━━━━━━━━━━━━━  HERO  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30
                          rounded-full px-4 py-2 text-violet-300 text-sm font-medium mb-8
                          animate-pulse-glow">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Admissions Open for 2024-25
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Excellence in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
              Every Student
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            AGS Tutorial — building conceptual foundations and encouraging disciplined learning
            for Class 8 to 12 students in Sonia Vihar, Delhi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/pay")}
              className="btn-primary text-base py-4 px-10 rounded-2xl text-lg"
            >
              💳 Pay Fees Now
            </button>
            <a href="#courses" className="btn-secondary text-base py-4 px-10 rounded-2xl text-lg">
              Explore Courses →
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="glass-card p-4 text-center">
                <div className="font-display text-3xl font-bold text-violet-400">{s.value}</div>
                <div className="text-slate-400 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━  COURSES  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="courses" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="section-title">Our Courses</h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Tailored programmes for every stage of your academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c) => (
            <div
              key={c.title}
              className={`glass-card border ${c.border} p-6 hover:scale-105 transition-transform duration-300 group`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}
              >
                {c.icon}
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-1">{c.title}</h3>
              <p className="text-violet-400 text-xs font-medium mb-3">{c.subtitle}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━  WHY US  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="why-us" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Our Approach
            </p>
            <h2 className="section-title">Why Choose AGS Tutorial?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card p-6 hover:border-violet-500/50 hover:shadow-glow-sm transition-all duration-300"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━  CTA BANNER  ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center glass-card border border-violet-500/30 p-12 rounded-3xl
                        bg-gradient-to-br from-violet-900/40 to-slate-900/60">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to invest in your future?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Pay your course fees securely online in seconds. UPI, Cards & NetBanking accepted.
          </p>
          <button
            onClick={() => navigate("/pay")}
            className="btn-primary text-lg py-4 px-12 rounded-2xl"
          >
            💳 Pay Fees Online
          </button>
          <p className="text-slate-500 text-xs mt-4">
            Minimum ₹400 • Secured by Razorpay • Instant receipt
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
