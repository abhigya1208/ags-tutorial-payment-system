// ─────────────────────────────────────────────────────────────
//  components/Loader.jsx  –  Full-page or inline spinner
// ─────────────────────────────────────────────────────────────
import React from "react";

export default function Loader({ message = "Loading…", fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinning ring */}
      <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin" />
      {message && (
        <p className="text-slate-400 text-sm font-medium">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="flex justify-center py-12">{content}</div>;
}
