import { useCallback, useState } from "react";
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
  const [isSaving, setIsSaving] = useState(false);
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

      // Start saving state
      setIsSaving(true);

      try {
        console.log(`Starting save with action: ${action}`);
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
        success("Document saved successfully.");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          onError("You are not authorized to edit the document.");
        } else {
          console.error("Error saving document:", err);
          onError("Failed to save document. Please try again.");
        }
        error("Document saving has failed.");
        throw err;
      } finally {
        // Always stop saving state
        setIsSaving(false);
      }
    },
    [documentId, editorRef, setIsDirty, onError]
  );

  const exportDocument = useCallback(
    (fileName: string) => {
      const editorObj = editorRef.current?.documentEditor;
      if (editorObj) {
        try {
          // Set saving state for export as well
          setIsSaving(true);

          editorObj.save(fileName.trim() || "Untitled", "Docx");
          console.log(`Document exported as: ${fileName}`);

          // Reset saving state after a short delay for export
          setTimeout(() => {
            setIsSaving(false);
          }, 1000);
        } catch (error) {
          console.error("Error saving document:", error);
          onError("Failed to export document.");
          setIsSaving(false);
        }
      }
    },
    [editorRef, onError]
  );

  const saveChanges = useCallback(() => {
    return saveChangesWithAction("edited");
  }, [saveChangesWithAction]);

  return {
    saveChangesWithAction,
    exportDocument,
    saveChanges,
    isSaving, // Return isSaving state
  };
};
