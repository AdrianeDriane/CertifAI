import { useCallback } from "react";
import axios from "axios";
import { getFingerprint } from "../../../utils/getFingerprint";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";
import { useToast } from "../../../hooks/useToast";

interface UseDocumentActionsProps {
  documentId?: string;
  editorRef: React.RefObject<DocumentEditorContainerComponent | null>;
  setIsDirty: (dirty: boolean) => void;
  onError: (message: string) => void;
}

export const useDocumentActions = ({
  documentId,
  editorRef,
  setIsDirty,
  onError,
}: UseDocumentActionsProps) => {
  const { success, error } = useToast();
  const saveChangesWithAction = useCallback(
    async (action: "edited" | "signed") => {
      const token = localStorage.getItem("token");
      const fingerprint = await getFingerprint();
      const editorObj = editorRef.current?.documentEditor;

      if (!editorObj) {
        console.error("Editor not available");
        return;
      }

      try {
        const sfdtContent = editorObj.serialize();
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}`,
          { sfdt: sfdtContent, action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-device-fingerprint": fingerprint,
            },
          }
        );
        setIsDirty(false);
        console.log(`Document saved successfully with action: ${action}`);
        success("Document saved successfully!");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          onError("You are not authorized to edit the document.");
        } else {
          console.error("Error saving document:", err);
        }
        error("Saving document has failed.");
      }
    },
    [documentId, editorRef, setIsDirty, onError]
  );

  const exportDocument = useCallback(
    (fileName: string) => {
      const editorObj = editorRef.current?.documentEditor;
      if (editorObj) {
        try {
          editorObj.save(fileName.trim() || "Untitled", "Docx");
        } catch (error) {
          console.error("Error saving document:", error);
        }
      }
    },
    [editorRef]
  );

  return {
    saveChangesWithAction,
    exportDocument,
    saveChanges: () => saveChangesWithAction("edited"),
  };
};
