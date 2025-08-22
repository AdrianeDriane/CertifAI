import axios from "axios";
import { getFingerprint } from "../utils/getFingerprint"; // ✅ Use fingerprint util

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface GenerateGroqRequest {
  docType: string;
  userPrompt: string;
}

export interface GroqDocumentResponse {
  success: boolean;
  document: any; // Replace with precise SFDT type if available
}

interface ChangeDetectionResult {
  hasChanges: 0 | 1;
  summary: string;
  confidence: number;
}

interface CompareDocumentRequest {
  documentId: string;
  uploadedText: string;
  documentType?: string;
}

export const generateGroqDocument = async (
  payload: GenerateGroqRequest
): Promise<GroqDocumentResponse> => {
  try {
    const token = localStorage.getItem("token");
    const fingerprint = await getFingerprint(); // ✅ Get device fingerprint

    const response = await axios.post(`${API_BASE_URL}/groq`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-device-fingerprint": fingerprint, // ✅ Set fingerprint in header
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to generate Groq document"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const compareDocumentWithUpload = async (
  request: CompareDocumentRequest
): Promise<ChangeDetectionResult> => {
  try {
    const token = localStorage.getItem("token");
    const fingerprint = await getFingerprint();

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/documents/${
        request.documentId
      }/compare`,
      {
        uploadedText: request.uploadedText,
        documentType: request.documentType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-device-fingerprint": fingerprint,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error comparing documents:", error);
    throw error;
  }
};
