import "../../App.css";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { getFingerprint } from "../../utils/getFingerprint";
import axios from "axios";
import SignatureModal from "../signature/SignatureModal";

DocumentEditorContainerComponent.Inject(Toolbar);

interface DocEditorProps {
  sfdt: string | null;
  fileName: string;
}

interface SignatureOptions {
  dataUrl: string;
  width: number;
  height: number;
}

const DocEditor: React.FC<DocEditorProps> = ({ sfdt, fileName }) => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const { documentId } = useParams<{ documentId?: string }>();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [localFileName, setLocalFileName] = useState(fileName);
  const [signatureCount, setSignatureCount] = useState(0);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);

  const insertSignature = (signatureOptions: SignatureOptions) => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      try {
        // Ensure the editor is focused and ready
        editorObj.focusIn();

        // Insert the image with specified dimensions - using default placement
        editorObj.editor.insertImage(
          signatureOptions.dataUrl,
          signatureOptions.width,
          signatureOptions.height
        );

        // Increment signature counter and set signature state
        setSignatureCount((prev) => prev + 1);
        setHasSignature(true);
        setIsDirty(true);

        console.log(
          `Signature ${signatureCount + 1} inserted successfully (${
            signatureOptions.width
          }x${signatureOptions.height})`
        );

        // Auto-save with "signed" action after signature insertion
        setTimeout(() => {
          saveChangesWithAction("signed");
        }, 100);
      } catch (error) {
        console.error("Error inserting signature:", error);

        // Fallback: try basic insertion without dimensions
        try {
          editorObj.editor.insertImage(signatureOptions.dataUrl);
          setSignatureCount((prev) => prev + 1);
          setHasSignature(true);
          setIsDirty(true);

          console.log("Signature inserted with basic method");

          // Auto-save with "signed" action
          setTimeout(() => {
            saveChangesWithAction("signed");
          }, 100);
        } catch (fallbackError) {
          console.error("Fallback insertion also failed:", fallbackError);
          alert("Error inserting signature. Please try again.");
        }
      }
    }
    setShowSignatureModal(false);
  };

  const handleAddSignatureClick = () => {
    if (isDirty) {
      const shouldSave = window.confirm(
        "You must save your changes before adding a signature. Save now?"
      );
      if (shouldSave) {
        saveChangesWithAction("edited").then(() => {
          setShowSignatureModal(true);
        });
      }
      return;
    }

    // If no unsaved changes, allow signature modal to open
    setShowSignatureModal(true);
  };

  const handleContentChange = () => {
    // If content changes and we have signatures, show confirmation
    if (hasSignature && !showEditConfirmDialog) {
      setShowEditConfirmDialog(true);
      return;
    }

    // Otherwise, just mark as dirty
    setIsDirty(true);
  };

  const handleEditConfirmation = (shouldContinue: boolean) => {
    if (shouldContinue) {
      // Clear signature state and re-enable editing
      setHasSignature(false);
      setSignatureCount(0);
      setIsDirty(true);

      console.log("Signatures cleared, editing re-enabled");
    }

    setShowEditConfirmDialog(false);
  };

  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

  // Load generated document
  useEffect(() => {
    if (sfdt && editorRef.current) {
      try {
        editorRef.current.documentEditor.open(sfdt);
        // Reset states when loading new document
        setIsDirty(false);
        setHasSignature(false);
        setSignatureCount(0);
      } catch (error) {
        console.error("Error loading document:", error);
      }
    }
  }, [sfdt]);

  // Handle read-only state changes
  useEffect(() => {
    if (editorRef.current?.documentEditor) {
      editorRef.current.documentEditor.isReadOnly = hasSignature;
    }
  }, [hasSignature]);

  const onSave = () => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      try {
        const sfdtContent = editorObj.serialize();
        console.log("Saving document:", localFileName, documentId, sfdtContent);
        editorObj.save(localFileName.trim() || "Untitled", "Docx");
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }
  };

  const saveChanges = async () => {
    return saveChangesWithAction("edited");
  };

  const saveChangesWithAction = async (action: "edited" | "signed") => {
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

      // Clear dirty flag after successful save
      setIsDirty(false);

      console.log(`Document saved successfully with action: ${action}`);
    } catch (err) {
      console.error("Error saving document:", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="bg-gray-100 border-b px-4 py-3 flex justify-between items-center gap-3">
        <input
          type="text"
          value={localFileName}
          onChange={(e) => setLocalFileName(e.target.value)}
          placeholder="Enter file name"
          className="text-lg font-medium px-3 py-2 border border-gray-300 rounded-md flex-1 max-w-xs"
          disabled={hasSignature}
        />

        <div className="flex gap-2 items-center">
          {isDirty && (
            <span className="text-sm text-amber-600 px-3 py-2 bg-amber-50 rounded-md border border-amber-200">
              Unsaved changes
            </span>
          )}

          {signatureCount > 0 && (
            <span className="text-sm text-green-700 px-3 py-2 bg-green-50 rounded-md border border-green-200">
              Signatures: {signatureCount}
            </span>
          )}

          {hasSignature && (
            <span className="text-sm text-blue-700 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
              Read-only (Signed)
            </span>
          )}

          <button
            onClick={handleAddSignatureClick}
            disabled={hasSignature}
            className={`text-sm px-5 py-2 rounded-md transition whitespace-nowrap flex items-center gap-2 ${
              hasSignature
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Signature
          </button>

          <button
            onClick={saveChanges}
            disabled={!isDirty}
            className={`text-sm px-5 py-2 rounded-md transition whitespace-nowrap ${
              isDirty
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>

          <button
            onClick={onSave}
            className="bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
          >
            Export
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <DocumentEditorContainerComponent
          id="container"
          ref={editorRef}
          height="100%"
          serviceUrl="https://services.syncfusion.com/react/production/api/documenteditor/"
          enableToolbar={!hasSignature}
          contentChange={handleContentChange}
        />
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <SignatureModal
          onConfirm={insertSignature}
          onCancel={() => setShowSignatureModal(false)}
        />
      )}

      {/* Edit Confirmation Dialog */}
      {showEditConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[450px] max-w-[95vw]">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Edit Signed Document?
            </h3>
            <p className="text-gray-600 mb-6">
              This document contains signatures. Editing will remove all
              existing signatures and make the document editable again. Do you
              want to continue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleEditConfirmation(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditConfirmation(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Remove Signatures & Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocEditor;
