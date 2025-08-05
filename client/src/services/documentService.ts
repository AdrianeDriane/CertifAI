import axios from 'axios';
import { getFingerprint } from '../utils/getFingerprint';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface CreateDocumentRequest {
  title: string;
  sfdt?: string; // Optional initial SFDT content
}

export interface DocumentResponse {
  _id: string;
  title: string;
  createdBy: string;
  currentVersion: number;
  status: string;
  visibility: string;
  versions: Array<{
    version: number;
    action: string;
    sfdt: string;
    hash: string;
    blockchainTxHash: string;
    createdAt: Date;
    modifiedBy: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const createDocument = async (
  documentData: CreateDocumentRequest
): Promise<DocumentResponse> => {
  try {
    const token = localStorage.getItem('token');
    const fingerprint = await getFingerprint();
    const response = await axios.post(
      `${API_BASE_URL}/documents`,
      {
        title: documentData.title,
        sfdt: documentData.sfdt || '', // Empty SFDT for new document
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-device-fingerprint': fingerprint,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'Failed to create document'
      );
    }
    throw new Error('An unexpected error occurred');
  }
};
