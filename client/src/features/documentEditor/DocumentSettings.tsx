import React, { useState } from "react";
import axios from "axios";
import { getFingerprint } from "../../utils/getFingerprint";
import { useToast } from "../../hooks/useToast";

interface DocumentSettingsProps {
  documentId: string;
  currentVisibility: "private" | "public";
  currentStatus?: "draft" | "signed" | "locked"; // Add status prop
  onClose: () => void;
  onDocumentLocked?: () => void; // Callback when document is locked
}

const DocumentSettings: React.FC<DocumentSettingsProps> = ({
  documentId,
  currentVisibility,
  currentStatus, // Default to active if not provided
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

      // Call the callback to notify parent component
      if (onDocumentLocked) {
        onDocumentLocked();
      }

      // Close the modal after successful archiving
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Document Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Document Status Indicator */}
        {isDocumentLocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-600 font-medium">
                🔒 Document Locked
              </span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              This document is archived and cannot be edited or have its
              settings modified.
            </p>
          </div>
        )}

        {/* Visibility Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) =>
              setVisibility(e.target.value as "private" | "public")
            }
            disabled={isDocumentLocked}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <button
            onClick={handleModifyVisibility}
            disabled={loading || isDocumentLocked}
            className="mt-3 w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Modify Visibility"}
          </button>
        </div>

        {/* Add Editor Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Editor by Email
          </label>
          <input
            type="email"
            placeholder="Enter editor's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isDocumentLocked}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddEditor}
            disabled={loading || isDocumentLocked}
            className="mt-3 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Editor"}
          </button>
        </div>

        {/* Archive Document Section */}
        {!isDocumentLocked && (
          <div className="mb-6 border-t pt-4">
            <label className="block text-sm font-medium text-red-700 mb-2">
              Danger Zone
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Archive this document to make it permanently uneditable. This
              action cannot be undone.
            </p>
            <button
              onClick={handleArchiveDocument}
              disabled={archiveLoading}
              className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition disabled:opacity-50 border border-red-600"
            >
              {archiveLoading ? "Archiving..." : "🔒 Archive Document"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSettings;
