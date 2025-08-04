import { useContext, useEffect, useCallback} from "react";
import { AuthContext } from "../context/AuthContext";
import { setLogoutFunction } from "../api/authApi";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Memoize logout and login functions to prevent unnecessary re-renders
  const logout = useCallback(() => {
    context.setToken(null);
    localStorage.removeItem("token");
  }, [context]);

  const login = useCallback((token: string) => {
    context.setToken(token);
  }, [context]);

  // Register logout function with API interceptor
  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);


  return {
    token: context.token,
    setToken: context.setToken,
    login,
    logout,
    isAuthenticated: !!context.token
  };
};