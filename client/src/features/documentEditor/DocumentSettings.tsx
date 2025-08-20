import React, { useState } from "react";
import axios from "axios";
import { getFingerprint } from "../../utils/getFingerprint";
import { useToast } from "../../hooks/useToast";

interface DocumentSettingsProps {
  documentId: string;
  currentVisibility: "private" | "public";
  onClose: () => void;
}

const DocumentSettings: React.FC<DocumentSettingsProps> = ({
  documentId,
  currentVisibility,
  onClose,
}) => {
  const [visibility, setVisibility] = useState<"private" | "public">(
    currentVisibility
  );
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const { success, error } = useToast();

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
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <button
            onClick={handleModifyVisibility}
            disabled={loading}
            className="mt-3 w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition disabled:opacity-50"
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
            className="w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
          />
          <button
            onClick={handleAddEditor}
            disabled={loading}
            className="mt-3 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Editor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
