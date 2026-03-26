// ─────────────────────────────────────────────────────────────
//  components/PrivateRoute.jsx  –  Guards admin routes with JWT
// ─────────────────────────────────────────────────────────────
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps any component that requires admin authentication.
 * If not authenticated, redirects to /admin/login.
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
