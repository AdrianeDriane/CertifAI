import React, { useState } from "react";
import { X, FileText, Loader2 } from "lucide-react";
interface DocumentTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isLoading?: boolean;
}
const DocumentTitleModal: React.FC<DocumentTitleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Document title is required");
      return;
    }
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters long");
      return;
    }
    setError("");
    onSubmit(title.trim());
  };
  const handleClose = () => {
    if (!isLoading) {
      setTitle("");
      setError("");
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#000002]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto relative overflow-hidden animate-fadeIn"
        style={{
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        {/* Geometric accents */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#d0f600]/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#aa6bfe]/10 rounded-full"></div>
        {/* Modal content */}
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#eeebf0] rounded-xl">
                <FileText className="w-5 h-5 text-[#aa6bfe]" />
              </div>
              <h2 className="text-xl font-bold text-[#000002]">
                Create New Document
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-[#000002] disabled:opacity-50 p-2 hover:bg-[#eeebf0] rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="document-title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Document Title
              </label>
              <div className="relative">
                <input
                  id="document-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter document title..."
                  className={`w-full px-4 py-3 bg-[#eeebf0]/50 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${
                    error
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#aa6bfe]/10 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe]"
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-500">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Your document will be securely stored and verified on the
                blockchain.
              </div>
            </div>
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-[#000002] bg-[#eeebf0] rounded-xl hover:bg-[#eeebf0]/70 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim()}
                className={`px-5 py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 min-w-[140px] transition-colors ${
                  isLoading || !title.trim()
                    ? "bg-[#aa6bfe]/50 text-white cursor-not-allowed"
                    : "bg-[#aa6bfe] text-white hover:bg-[#aa6bfe]/90"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Document</span>
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Bottom accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#aa6bfe] to-[#d0f600]"></div>
      </div>
    </div>
  );
};
export default DocumentTitleModal;
