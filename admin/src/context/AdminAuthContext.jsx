import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem("adminToken"));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-data`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setAdmin(res.data.admin || res.data);
      } catch (error) {
        console.warn("Admin token invalid:", error?.response?.status);
        sessionStorage.removeItem("adminToken");
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, [token]);

  const login = (newToken, adminData = null) => {
    sessionStorage.setItem("adminToken", newToken);
    setToken(newToken);
    if (adminData) setAdmin(adminData);
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        admin,
        loading,
        login,
        logout,
        setAdmin, 
      }}
    >
      {children}      
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);