// We create this so only logged-in admins with a valid token can see /admin/dashboard;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function ProtectedRoutes({ children }) {
  const { admin } = useAdminAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace/>
  }

  return children;
} 

export default ProtectedRoutes;