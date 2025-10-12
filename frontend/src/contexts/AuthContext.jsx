import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || sessionStorage.getItem("token")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token); // True while verifying token

  // On mount, if token exists try to verify and load user
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Try to get user info using token
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data.user || res.data);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  // Call this after login
  const login = (newToken, userData = null, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    setToken(newToken);
    if (userData) setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        setUser, // Optional: to update profile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
