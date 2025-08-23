import React, { useState } from "react";
import axios from "axios";
import { getFingerprint } from "../../utils/getFingerprint";
import { useToast } from "../../hooks/useToast";
import {
  X,
  Globe,
  EyeOff,
  UserPlus,
  Archive,
  Lock,
  AlertTriangle,
  Settings,
  Mail,
} from "lucide-react";

interface DocumentSettingsProps {
  documentId: string;
  currentVisibility: "private" | "public";
  currentStatus?: "draft" | "signed" | "locked";
  onClose: () => void;
  onDocumentLocked?: () => void;
}

const DocumentSettings: React.FC<DocumentSettingsProps> = ({
  documentId,
  currentVisibility,
  currentStatus,
  onClose,
  onDocumentLocked,
}) => {
  const [visibility, setVisibility] = useState<"private" | "public">(
    currentVisibility
  );
  const [loading, setLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { success, error } = useToast();

  const isDocumentLocked = currentStatus === "locked";

  const getAuthHeaders = async () => {
    const token = localStorage.getItem("token");
    const fingerprint = await getFingerprint();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-device-fingerprint": fingerprint,
    };
  };

  const handleModifyVisibility = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/documents/modify-visibility/${documentId}`,
        { visibility },
        { headers }
      );
      success(res.data.message || "Visibility updated.");
    } catch (err: any) {
      error(err.response?.data?.message || "Error updating visibility.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEditor = async () => {
    if (!email) {
      error("Please enter an email.");
      return;
    }
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/documents/${documentId}/add-editor-by-email`,
        { email },
        { headers }
      );
      success(res.data.message || "Editor added.");
      setEmail("");
    } catch (err: any) {
      error(err.response?.data?.message || "Error adding editor.");
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveDocument = async () => {
    if (
      !window.confirm(
        "Are you sure you want to archive this document? This action cannot be undone and will make the document permanently uneditable."
      )
    ) {
      return;
    }

    try {
      setArchiveLoading(true);
      const headers = await getAuthHeaders();
      const res = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/documents/archive-document/${documentId}`,
        {},
        { headers }
      );
      success(res.data.message || "Document archived successfully.");

      if (onDocumentLocked) {
        onDocumentLocked();
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      error(err.response?.data?.message || "Error archiving document.");
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className=" px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-700">
                  Document Settings
                </h2>
                <p className="text-gray-700 text-xs">
                  Manage visibility and access
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Document Status Indicator */}
          {isDocumentLocked && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-900 text-sm">
                  Document Locked
                </span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                This document is archived and cannot be edited or have its
                settings modified.
              </p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visibility Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Visibility
                </h3>
              </div>

              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) =>
                    setVisibility(e.target.value as "private" | "public")
                  }
                  disabled={isDocumentLocked}
                  className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:border-[#aa6bfe] focus:ring-2 focus:ring-[#aa6bfe] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="private">🔒 Private</option>
                  <option value="public">🌐 Public</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {visibility === "public" ? (
                    <Globe className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              <button
                onClick={handleModifyVisibility}
                disabled={loading || isDocumentLocked}
                className="w-full bg-[#aa6bfe] text-white font-medium rounded-lg py-2 px-3 hover:bg-[#9a5bfe] focus:ring-2 focus:ring-[#aa6bfe] focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  "Update Visibility"
                )}
              </button>
            </div>

            {/* Add Editor Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Add Collaborator
                </h3>
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="collaborator@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isDocumentLocked}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-9 focus:border-[#aa6bfe] focus:ring-2 focus:ring-[#aa6bfe] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
              </div>

              <button
                onClick={handleAddEditor}
                disabled={loading || isDocumentLocked || !email.trim()}
                className="w-full bg-[#d0f600] text-[#000002] font-medium rounded-lg py-2 px-3 hover:bg-[#c5e600] focus:ring-2 focus:ring-[#d0f600] focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border border-gray-500/30 border-t-gray-700 rounded-full animate-spin"></div>
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Editor
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Archive Document Section */}
          {!isDocumentLocked && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-900">
                  Danger Zone
                </h3>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2 flex-1">
                    <Archive className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-left text-red-900 text-sm">
                        Archive Document
                      </h4>
                      <p className="text-xs text-red-700 mt-0.5">
                        Make document permanently uneditable. This action cannot
                        be undone.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleArchiveDocument}
                    disabled={archiveLoading}
                    className="bg-red-600 text-white font-medium rounded-lg py-2 px-4 hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-opacity-20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    {archiveLoading ? (
                      <>
                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                        Archiving...
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Archive
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
