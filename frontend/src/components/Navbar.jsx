// ─────────────────────────────────────────────────────────────
//  components/Navbar.jsx  –  Top navigation bar
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center
                            shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-display font-bold text-sm">AG</span>
            </div>
            <div className="leading-none">
              <span className="font-display font-bold text-white text-lg block">AGS Tutorial</span>
              <span className="text-xs text-violet-400 tracking-wide">Quality Education</span>
            </div>
          </Link>

          {/* ── Desktop nav links ─────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#courses" className="text-slate-300 hover:text-violet-400 text-sm font-medium transition-colors">
              Courses
            </a>
            <a href="#why-us" className="text-slate-300 hover:text-violet-400 text-sm font-medium transition-colors">
              Why Us
            </a>
            <a href="#contact" className="text-slate-300 hover:text-violet-400 text-sm font-medium transition-colors">
              Contact
            </a>
            <button
              onClick={() => navigate("/pay")}
              className="btn-primary text-sm py-2 px-5"
            >
              Pay Fees
            </button>
          </nav>

          {/* ── Mobile hamburger ─────────────────────────── */}
          <button
            className="md:hidden text-slate-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile menu ───────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-800 mt-2 pt-4">
            <a href="#courses" onClick={() => setMenuOpen(false)}
               className="block px-4 py-2 text-slate-300 hover:text-violet-400 hover:bg-slate-800/50 rounded-lg text-sm">
              Courses
            </a>
            <a href="#why-us" onClick={() => setMenuOpen(false)}
               className="block px-4 py-2 text-slate-300 hover:text-violet-400 hover:bg-slate-800/50 rounded-lg text-sm">
              Why Us
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}
               className="block px-4 py-2 text-slate-300 hover:text-violet-400 hover:bg-slate-800/50 rounded-lg text-sm">
              Contact
            </a>
            <div className="px-4 pt-2">
              <button
                onClick={() => { navigate("/pay"); setMenuOpen(false); }}
                className="btn-primary w-full text-sm py-2.5"
              >
                Pay Fees
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
