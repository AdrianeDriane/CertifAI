import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { getFingerprint } from '../utils/getFingerprint';
import { useAuth } from '../hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const fingerprint = await getFingerprint();
      const res = await axios.post(`${API_BASE}/auth/register`, {
        email,
        password,
        fingerprint,
      });
      
      setToken(res.data.token);
      setMessage('Registration successful!');
      
      navigate('/verify-email', { 
        state: { email },
        replace: true 
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const fingerprint = await getFingerprint();
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
        fingerprint,
      });
      
      setToken(res.data.token);
      setMessage('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || 'Login failed.');
      if(error.response?.status === 403){
        navigate('/verify-email', {state: {email} });
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const fingerprint = await getFingerprint();
      window.location.href = `${API_BASE}/auth/google?fp=${fingerprint}`;
    } catch (err) {
      console.error('Error getting fingerprint:', err);
      setError('Failed to initialize Google login');
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  return {
    handleRegister,
    handleLogin,
    handleGoogleLogin,
    clearMessages,
    isLoading,
    error,
    message,
  };
}