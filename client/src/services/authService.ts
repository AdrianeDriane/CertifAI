import axios from 'axios';
import { getFingerprint } from '../utils/getFingerprint';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Store logout function reference
let logoutFunction: (() => void) | null = null;

// Function to set logout function from auth context
export const setLogoutFunction = (logout: () => void) => {
  logoutFunction = logout;
};

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  const fingerprint = await getFingerprint();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (fingerprint) {
    config.headers['x-device-fingerprint'] = fingerprint;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (logoutFunction) {
        logoutFunction();
      } else {
        localStorage.removeItem('token');
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
