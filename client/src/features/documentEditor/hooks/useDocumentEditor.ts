import { useRef, useState, useEffect } from "react";
import { DocumentEditorContainerComponent } from "@syncfusion/ej2-react-documenteditor";

interface UseDocumentEditorReturn {
  editorRef: React.RefObject<DocumentEditorContainerComponent | null>;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  hasSignature: boolean;
  setHasSignature: (has: boolean) => void;
  signatureCount: number;
  setSignatureCount: React.Dispatch<React.SetStateAction<number>>;
  forceEditable: boolean;
  setForceEditable: (force: boolean) => void;
}

export const useDocumentEditor = (
  sfdt: string | null,
  shouldBeReadOnly: boolean
): UseDocumentEditorReturn => {
  const editorRef = useRef<DocumentEditorContainerComponent | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureCount, setSignatureCount] = useState(0);
  const [forceEditable, setForceEditable] = useState(false);

  // Load document
  useEffect(() => {
    if (sfdt && editorRef.current) {
      try {
        editorRef.current.documentEditor.open(sfdt);
        setIsDirty(false);
        setHasSignature(false);
        setSignatureCount(0);
        setForceEditable(false);
      } catch (error) {
        console.error("Error loading document:", error);
      }
    }
  }, [sfdt]);

  // Handle read-only state
  useEffect(() => {
    const editorObj = editorRef.current?.documentEditor;
    const container = editorRef.current as any;
    if (editorObj && container) {
      editorObj.isReadOnly = shouldBeReadOnly;
      container.showToolbar = !shouldBeReadOnly;
    }
  }, [shouldBeReadOnly]);

  return {
    editorRef,
    isDirty,
    setIsDirty,
    hasSignature,
    setHasSignature,
    signatureCount,
    setSignatureCount,
    forceEditable,
    setForceEditable,
  };
};
