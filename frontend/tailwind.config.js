/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── AGS Tutorial brand palette ─────────────────────
        violet: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",   // primary
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",   // green
          600: "#059669",
        },
        amber: {
          400: "#fbbf24",   // peach
          500: "#f59e0b",
        },
        orange: {
          400: "#fb923c",
          500: "#f97316",   // saffron
          600: "#ea580c",
        },
      },
      fontFamily: {
        sans:    ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Sora'", "sans-serif"],
      },
      boxShadow: {
        glow:    "0 0 30px rgba(139,92,246,0.35)",
        "glow-sm": "0 0 15px rgba(139,92,246,0.20)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(16,185,129,0.08) 100%)",
      },
    },
  },
  plugins: [],
};
