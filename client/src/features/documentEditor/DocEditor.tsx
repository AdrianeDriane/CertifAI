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
import DocumentSettings from "./DocumentSettings";
import { useToast } from "../../hooks/useToast";

DocumentEditorContainerComponent.Inject(Toolbar);

interface DocEditorProps {
  sfdt: string | null;
  fileName: string;
  documentStatus?: string;
  visibility?: "public" | "private";
  editors?: string[];
  createdBy?: string;
}

interface SignatureOptions {
  dataUrl: string;
  width: number;
  height: number;
}

const DocEditor: React.FC<DocEditorProps> = ({
  sfdt,
  fileName,
  documentStatus,
  visibility = "private",
  editors = [],
  createdBy,
}) => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const { documentId } = useParams<{ documentId?: string }>();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [localFileName, setLocalFileName] = useState(fileName);
  const [signatureCount, setSignatureCount] = useState(0);
  const [hasSignature, setHasSignature] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);
  const [forceEditable, setForceEditable] = useState(false);
  const [currentVisibility, setCurrentVisibility] = useState<
    "public" | "private"
  >(visibility);
  const [currentEditors, setCurrentEditors] = useState<string[]>(editors);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { error } = useToast();

  // Get current user ID on mount
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

  const isCreator = currentUserId && createdBy && currentUserId === createdBy;

  // Check if document should be read-only
  const isDocumentSigned = documentStatus === "signed";
  const shouldBeReadOnly = (hasSignature || isDocumentSigned) && !forceEditable;

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
    // If content changes and we have signatures or document is signed, show confirmation
    if (
      (hasSignature || isDocumentSigned) &&
      !showEditConfirmDialog &&
      !forceEditable
    ) {
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
      setForceEditable(true); // Force editing even if document status is signed
      console.log("Signatures cleared, editing re-enabled");
    }
    setShowEditConfirmDialog(false);
  };

  const handleForceEdit = () => {
    const shouldContinue = window.confirm(
      "This will make the signed document editable. Any signatures will be invalidated. Do you want to continue?"
    );
    if (shouldContinue) {
      setForceEditable(true);
      setHasSignature(false);
      setSignatureCount(0);
      setIsDirty(true);
      console.log("Document forced to editable mode");
    }
  };

  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

  useEffect(() => {
    setCurrentVisibility(visibility);
    setCurrentEditors(editors);
  }, [visibility, editors]);

  // Load generated document
  useEffect(() => {
    if (sfdt && editorRef.current) {
      try {
        editorRef.current.documentEditor.open(sfdt);
        // Reset states when loading new document
        setIsDirty(false);
        setHasSignature(false);
        setSignatureCount(0);
        setForceEditable(false); // Reset forced editing when loading new document
      } catch (error) {
        console.error("Error loading document:", error);
      }
    }
  }, [sfdt]);

  // Handle read-only state changes
  useEffect(() => {
    const editorObj = editorRef.current?.documentEditor;
    const container = editorRef.current as any;
    if (editorObj && container) {
      editorObj.isReadOnly = shouldBeReadOnly;
      container.showToolbar = !shouldBeReadOnly; // hide/show toolbar safely
    }
  }, [shouldBeReadOnly]);

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
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        error("You are not authorized to edit the document.");
      } else {
        console.error("Unexpected error fetching document:", err);
      }
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
          disabled={shouldBeReadOnly}
        />
        <div className="flex gap-2 items-center">
          {/* Document Status Indicators */}
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
          {shouldBeReadOnly && (
            <span className="text-sm text-blue-700 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
              Read-only (Signed)
            </span>
          )}
          {forceEditable && (isDocumentSigned || hasSignature) && (
            <span className="text-sm text-orange-700 px-3 py-2 bg-orange-50 rounded-md border border-orange-200">
              Forced Edit Mode
            </span>
          )}

          {/* Visibility Indicator */}
          <span
            className={`text-sm px-3 py-2 rounded-md border ${
              currentVisibility === "public"
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-gray-700 bg-gray-50 border-gray-200"
            }`}
          >
            {currentVisibility === "public" ? "🌐 Public" : "🔒 Private"}
          </span>

          {/* Editors Count */}
          {currentEditors.length > 0 && (
            <span className="text-sm text-purple-700 px-3 py-2 bg-purple-50 rounded-md border border-purple-200">
              👥 {currentEditors.length} Editor
              {currentEditors.length > 1 ? "s" : ""}
            </span>
          )}

          {/* Settings Button - Only show for creator */}
          {isCreator && (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-sm px-4 py-2 rounded-md transition whitespace-nowrap flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
              title="Document Settings"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          )}

          {/* Force Edit Button - only show when document is signed or has signatures */}
          {shouldBeReadOnly && (
            <button
              onClick={handleForceEdit}
              className="text-sm px-4 py-2 rounded-md transition whitespace-nowrap flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Force Edit
            </button>
          )}

          <button
            onClick={handleAddSignatureClick}
            disabled={shouldBeReadOnly}
            className={`text-sm px-5 py-2 rounded-md transition whitespace-nowrap flex items-center gap-2 ${
              shouldBeReadOnly
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
          enableToolbar={true}
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

      {/* Document Settings Modal */}
      {showSettingsModal && documentId && (
        <DocumentSettings
          documentId={documentId}
          currentVisibility={currentVisibility}
          onClose={() => setShowSettingsModal(false)}
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
              This document contains signatures or is marked as signed. Editing
              will remove all existing signatures and make the document editable
              again. Do you want to continue?
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
