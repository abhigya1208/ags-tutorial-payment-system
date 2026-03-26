// ─────────────────────────────────────────────────────────────
//  context/AuthContext.jsx  –  Admin authentication state
// ─────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore token from localStorage on first load
  const [token, setToken] = useState(() => localStorage.getItem("ags_admin_token") || null);
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("ags_admin_info");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage whenever they change
  useEffect(() => {
    if (token) {
      localStorage.setItem("ags_admin_token", token);
    } else {
      localStorage.removeItem("ags_admin_token");
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem("ags_admin_info", JSON.stringify(admin));
    } else {
      localStorage.removeItem("ags_admin_info");
    }
  }, [admin]);

  const login = (tokenValue, adminInfo) => {
    setToken(tokenValue);
    setAdmin(adminInfo);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy consumption
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
