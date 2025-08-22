import React, { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

// Toast interface definitions
interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
  title?: string;
  duration?: number; // milliseconds, 0 = persistent
  action?: ToastAction;
}

interface ToastOptions {
  title?: string;
  duration?: number;
  action?: ToastAction;
}

// Toast type configurations with CertifAI colors
const toastTypes = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-white",
    borderColor: "border-[#d0f600]",
    iconColor: "text-[#d0f600]",
    textColor: "text-[#000002]",
    accentColor: "bg-[#d0f600]",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-white",
    borderColor: "border-red-400",
    iconColor: "text-red-500",
    textColor: "text-[#000002]",
    accentColor: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-white",
    borderColor: "border-yellow-400",
    iconColor: "text-yellow-500",
    textColor: "text-[#000002]",
    accentColor: "bg-yellow-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-white",
    borderColor: "border-[#aa6bfe]",
    iconColor: "text-[#aa6bfe]",
    textColor: "text-[#000002]",
    accentColor: "bg-[#aa6bfe]",
  },
};

// Individual Toast Component
interface ToastComponentProps {
  toast: Toast;
  onClose: (id: number) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const config = toastTypes[toast.type] || toastTypes.info;
  const IconComponent = config.icon;

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // Match animation duration
  }, [onClose, toast.id]);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Auto-dismiss timer
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  return (
    <>
      {/* Global CSS for progress bar animation */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div
        className={`
          relative overflow-hidden rounded-xl shadow-lg border-2 max-w-sm w-full
          transform transition-all duration-300 ease-out z-50
          ${config.bgColor} ${config.borderColor}
          ${
            isVisible && !isExiting
              ? "translate-x-0 opacity-100 scale-100"
              : "translate-x-full opacity-0 scale-95"
          }
        `}
      >
        {/* Color accent bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentColor}`}
        ></div>

        <div className="p-4 pl-5">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4
                  className={`font-semibold text-sm mb-1 ${config.textColor}`}
                >
                  {toast.title}
                </h4>
              )}
              <p className={`text-sm ${config.textColor} opacity-90`}>
                {toast.message}
              </p>

              {/* Action button if provided */}
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className={`mt-2 text-xs font-medium ${config.iconColor} hover:opacity-80 transition-opacity`}
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress bar for timed toasts */}
        {toast.duration && toast.duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
            <div
              className={`h-full ${config.accentColor}`}
              style={{
                animation: `shrinkWidth ${toast.duration}ms linear forwards`,
              }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

// Toast Container Component - Place this in your App component
interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
};

// Export types for use in other files
export type { Toast, ToastOptions, ToastAction };

/**
 * EXAMPLE USAGE IN YOUR COMPONENTS:
 *
 * import { useToast } from './Toast';
 *
 * function MyComponent() {
 *   const { success, error, warning, info } = useToast();
 *
 *   const handleDocumentVerification = () => {
 *     try {
 *       // Your verification logic here
 *       success("Document successfully verified and secured!", {
 *         title: "Verification Complete",
 *         duration: 6000
 *       });
 *     } catch (err) {
 *       error("Failed to verify document. Please try again.", {
 *         title: "Verification Failed",
 *         action: {
 *           label: "Retry",
 *           onClick: () => handleDocumentVerification()
 *         }
 *       });
 *     }
 *   };
 *
 *   const handleSignatureWarning = () => {
 *     warning("Your document signature will expire in 24 hours.", {
 *       title: "Signature Expiring Soon",
 *       duration: 8000,
 *       action: {
 *         label: "Renew Now",
 *         onClick: () => renewSignature()
 *       }
 *     });
 *   };
 *
 *   const handleProcessingInfo = () => {
 *     info("Your document is being processed on the blockchain.", {
 *       title: "Processing Document",
 *       duration: 0 // This will persist until manually closed
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleDocumentVerification}>Verify Document</button>
 *       <button onClick={handleSignatureWarning}>Check Signature</button>
 *       <button onClick={handleProcessingInfo}>Process Document</button>
 *     </div>
 *   );
 * }
 *
 * RECOMMENDED: For better React Fast Refresh support, create a separate file 'useToast.ts':
 *
 * // useToast.ts
 * import { useState, useEffect, useCallback } from 'react';
 * import type { Toast, ToastOptions } from './Toast';
 *
 * // Move all the hook logic here
 * export const useToast = () => {
 *   // ... hook implementation
 * };
 *
 * Then in Toast.tsx, only export the components:
 * export { ToastContainer };
 * export type { Toast, ToastOptions, ToastAction };
 */
