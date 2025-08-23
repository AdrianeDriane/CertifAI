import { useState, useEffect } from "react";

interface UseDocumentAuthReturn {
  currentUserId: string;
  isCreator: boolean;
  shouldBeReadOnly: boolean;
}

export const useDocumentAuth = (
  createdBy?: string,
  documentStatus?: string,
  hasSignature?: boolean,
  forceEditable?: boolean
): UseDocumentAuthReturn => {
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.id || payload.userId);
      } catch (err) {
        console.error("Error parsing token:", err);
      }
    }
  }, []);

  const isCreator = currentUserId === createdBy;
  const isDocumentSigned = documentStatus === "signed";
  const isDocumentLocked = documentStatus === "locked";
  const shouldBeReadOnly =
    (hasSignature || isDocumentSigned || isDocumentLocked) && !forceEditable;

  return {
    currentUserId,
    isCreator,
    shouldBeReadOnly,
  };
};
