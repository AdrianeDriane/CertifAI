import { useState, useEffect, useCallback } from "react";
import type { Toast, ToastOptions } from "../components/Toast";

// Create a separate file for the hook to avoid React Fast Refresh warnings
// For now, including it here but you should move this to a separate file like 'useToast.ts'
let toastState: Toast[] = [];
let toastListeners: ((toasts: Toast[]) => void)[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener(toastState));
};

const addToastToGlobalState = (toastData: Omit<Toast, "id">) => {
  const id = Date.now() + Math.random();
  const newToast: Toast = {
    id,
    duration: 5000,
    ...toastData,
    type: toastData.type || "info",
  };

  toastState = [...toastState, newToast];
  notifyListeners();
  return id;
};

const removeToastFromGlobalState = (id: number) => {
  toastState = toastState.filter((toast) => toast.id !== id);
  notifyListeners();
};

const clearAllToastsFromGlobalState = () => {
  toastState = [];
  notifyListeners();
};

// Toast Hook - Main hook to use throughout your app
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastState);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const addToast = useCallback((toastData: Omit<Toast, "id">) => {
    return addToastToGlobalState(toastData);
  }, []);

  const removeToast = useCallback((id: number) => {
    removeToastFromGlobalState(id);
  }, []);

  const clearAllToasts = useCallback(() => {
    clearAllToastsFromGlobalState();
  }, []);

  const success = useCallback(
    (message: string, options: ToastOptions = {}) => {
      return addToast({ ...options, type: "success", message });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, options: ToastOptions = {}) => {
      return addToast({ ...options, type: "error", message });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, options: ToastOptions = {}) => {
      return addToast({ ...options, type: "warning", message });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, options: ToastOptions = {}) => {
      return addToast({ ...options, type: "info", message });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };
};
