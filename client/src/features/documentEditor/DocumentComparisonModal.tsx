import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  FileX,
  Loader,
} from "lucide-react";
import axios from "axios";
import * as mammoth from "mammoth";
import { getFingerprint } from "../../utils/getFingerprint";

interface ComparisonResult {
  documentId: string;
  currentVersion: number;
  hasChanges: 0 | 1;
  summary: string;
  comparedAt: string;
}

interface DocumentComparisonModalProps {
  documentId: string;
  onClose: () => void;
}

const DocumentComparisonModal: React.FC<DocumentComparisonModalProps> = ({
  documentId,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
        "text/plain", // .txt
        "application/pdf", // .pdf (if you want to support)
      ];

      const isValidType =
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith(".docx") ||
        file.name.toLowerCase().endsWith(".doc") ||
        file.name.toLowerCase().endsWith(".txt");

      if (isValidType) {
        setSelectedFile(file);
        setError(null);
        setComparisonResult(null);
      } else {
        setError("Please select a valid document file (.docx, .doc, or .txt)");
        setSelectedFile(null);
      }
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    setIsExtracting(true);

    try {
      if (
        file.type === "text/plain" ||
        file.name.toLowerCase().endsWith(".txt")
      ) {
        // Handle plain text files
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setIsExtracting(false);
            resolve(result);
          };
          reader.onerror = () => {
            setIsExtracting(false);
            reject(new Error("Failed to read text file"));
          };
          reader.readAsText(file);
        });
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.toLowerCase().endsWith(".docx")
      ) {
        // Handle .docx files using mammoth
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target?.result as ArrayBuffer;
              const result = await mammoth.extractRawText({ arrayBuffer });

              if (result.messages && result.messages.length > 0) {
                console.warn("Mammoth conversion warnings:", result.messages);
              }

              setIsExtracting(false);
              resolve(result.value);
            } catch {
              setIsExtracting(false);
              reject(new Error("Failed to extract text from .docx file"));
            }
          };
          reader.onerror = () => {
            setIsExtracting(false);
            reject(new Error("Failed to read .docx file"));
          };
          reader.readAsArrayBuffer(file);
        });
      } else if (
        file.type === "application/msword" ||
        file.name.toLowerCase().endsWith(".doc")
      ) {
        // Handle legacy .doc files
        // Note: mammoth has limited support for .doc files
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target?.result as ArrayBuffer;
              const result = await mammoth.extractRawText({ arrayBuffer });

              if (result.messages && result.messages.length > 0) {
                console.warn("Mammoth conversion warnings:", result.messages);
              }

              // Check if extraction was successful
              if (!result.value || result.value.trim().length === 0) {
                throw new Error(
                  "Could not extract text from .doc file. Please convert to .docx or .txt format for better compatibility."
                );
              }

              setIsExtracting(false);
              resolve(result.value);
            } catch {
              setIsExtracting(false);
              reject(
                new Error(
                  "Failed to extract text from .doc file. Please convert to .docx or .txt format for better compatibility."
                )
              );
            }
          };
          reader.onerror = () => {
            setIsExtracting(false);
            reject(new Error("Failed to read .doc file"));
          };
          reader.readAsArrayBuffer(file);
        });
      } else {
        setIsExtracting(false);
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      setIsExtracting(false);
      throw error;
    }
  };

  const handleCompare = async () => {
    if (!selectedFile) {
      setError("Please select a file to compare");
      return;
    }

    setIsComparing(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const fingerprint = await getFingerprint();

      // Extract text content from the uploaded file
      const textContent = await extractTextFromFile(selectedFile);

      // Check if we got valid content
      if (!textContent || textContent.trim().length === 0) {
        throw new Error("No text content could be extracted from the file");
      }

      // Make API call to compare documents
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/documents/compare/${documentId}`,
        { content: textContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-device-fingerprint": fingerprint,
          },
        }
      );

      setComparisonResult(response.data);
    } catch (err: any) {
      console.error("Error comparing documents:", err);
      if (err.response?.status === 403) {
        setError("You are not authorized to compare this document.");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please try again later.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to compare documents. Please try again.");
      }
    } finally {
      setIsComparing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Simulate file input change
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        fileInputRef.current.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    }
  };

  const getFileTypeIcon = (file: File) => {
    if (
      file.name.toLowerCase().endsWith(".docx") ||
      file.name.toLowerCase().endsWith(".doc")
    ) {
      return "📄";
    } else if (file.name.toLowerCase().endsWith(".txt")) {
      return "📝";
    }
    return "📄";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={24} />
            Compare Documents
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              Upload Document to Compare
            </h3>

            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">
                      {getFileTypeIcon(selectedFile)}
                    </span>
                    <p className="text-green-600 font-medium">
                      {selectedFile.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Size: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  {isExtracting && (
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Loader size={16} className="animate-spin" />
                      <span className="text-sm">Extracting text...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    Drop your document here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports .txt, .docx, .doc files
                  </p>
                  <p className="text-xs text-gray-400">
                    Note: .doc files have limited support, .docx recommended
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx,.doc"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Comparison Result */}
          {comparisonResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">
                Comparison Result
              </h3>

              {/* Status Badge */}
              <div className="flex items-center justify-center gap-2">
                {comparisonResult.hasChanges === 0 ? (
                  <>
                    <CheckCircle size={24} className="text-green-500" />
                    <span className="text-lg font-medium text-green-700">
                      No Changes Detected
                    </span>
                  </>
                ) : (
                  <>
                    <FileX size={24} className="text-orange-500" />
                    <span className="text-lg font-medium text-orange-700">
                      Changes Detected
                    </span>
                  </>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-left text-gray-700 mb-2">
                  Summary:
                </h4>
                <div className="text-justify text-gray-600">
                  {comparisonResult.summary
                    .split(/(?=\d+\.\))/) // Split before each number pattern like "1.)"
                    .map((item, index) => (
                      <p key={index} className="mb-2">
                        {item.trim()}
                      </p>
                    ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Current Version:</span> v
                  {comparisonResult.currentVersion}
                </div>
                <div>
                  <span className="font-medium">Compared At:</span>{" "}
                  {new Date(comparisonResult.comparedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleCompare}
              disabled={!selectedFile || isComparing || isExtracting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                !selectedFile || isComparing || isExtracting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isComparing ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Comparing...
                </>
              ) : isExtracting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Compare
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComparisonModal;
