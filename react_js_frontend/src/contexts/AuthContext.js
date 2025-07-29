/**
 * AuthContext provides authentication state and actions.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  user: null,
  token: "",
  isLoading: false,
  login: async (_email, _password) => {},
  register: async (_email, _password) => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setUser(JSON.parse(user));
      setToken(token);
    }
  }, []);

  // PUBLIC_INTERFACE
  async function login(email, password) {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        endpoint: "/auth/login",
        method: "POST",
        data: { email, password },
      });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setIsLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function register(email, password) {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        endpoint: "/auth/register",
        method: "POST",
        data: { email, password },
      });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setIsLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
