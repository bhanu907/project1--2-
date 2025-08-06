import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Set axios baseURL from environment
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api',
  withCredentials: true,
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/user");
      setUser(res.data);
    } catch (err) {
      console.error("Auth fetch failed:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
