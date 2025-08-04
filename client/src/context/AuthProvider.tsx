import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
