import axios from "axios";
import { getFingerprint } from "../../../utils/getFingerprint";

export class DocumentService {
  private static async getAuthHeaders() {
    const token = localStorage.getItem("token");
    const fingerprint = await getFingerprint();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-device-fingerprint": fingerprint,
    };
  }

  static async saveDocument(
    documentId: string,
    sfdt: any,
    action: "edited" | "signed"
  ) {
    const headers = await this.getAuthHeaders();
    return axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}`,
      { sfdt, action },
      { headers }
    );
  }

  static async getDocument(documentId: string) {
    const headers = await this.getAuthHeaders();
    return axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}`,
      { headers }
    );
  }
}
