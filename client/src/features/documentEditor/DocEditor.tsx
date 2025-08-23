// DocEditor.tsx
import "../../App.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DocumentEditorContainer,
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { useToast } from "../../hooks/useToast";

// Custom hooks
import { useDocumentAuth } from "./hooks/useDocumentAuth";
import { useDocumentEditor } from "./hooks/useDocumentEditor";
import { useDocumentActions } from "./hooks/useDocumentActions";

// Components
import { DocumentHeader } from "./components/DocumentHeader";
import { ActivityLogsModal } from "./components/ActivityLogsModal";
import SignatureModal from "../signature/SignatureModal";
import DocumentSettings from "./DocumentSettings";
import DocumentComparisonModal from "./DocumentComparisonModal";

// Services
import { DocumentService } from "./services/documentService";

DocumentEditorContainerComponent.Inject(Toolbar);

interface DocEditorProps {
  sfdt: string | null;
  fileName: string;
  documentStatus?: string;
  visibility?: "public" | "private";
  editors?: string[];
  createdBy?: string;
  signedBy?: string[];
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
  signedBy,
}) => {
  const { documentId } = useParams<{ documentId?: string }>();
  const { error } = useToast();

  // State
  const [localFileName, setLocalFileName] = useState(fileName);
  const [currentVisibility, setCurrentVisibility] = useState<
    "public" | "private"
  >(visibility);
  const [currentEditors, setCurrentEditors] = useState<string[]>(editors);
  const [currentDocumentStatus, setCurrentDocumentStatus] = useState<string>(
    documentStatus || "draft"
  );
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const {
    editorRef,
    isDirty,
    setIsDirty,
    hasSignature,
    setHasSignature,
    signatureCount,
    setSignatureCount,
    forceEditable,
    setForceEditable,
  } = useDocumentEditor(sfdt, false);

  const { isCreator, shouldBeReadOnly } = useDocumentAuth(
    createdBy,
    currentDocumentStatus,
    hasSignature,
    forceEditable
  );

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.documentEditor.isReadOnly = shouldBeReadOnly;
    }
  }, [shouldBeReadOnly, editorRef]);

  const { saveChangesWithAction, exportDocument, saveChanges, isSaving } =
    useDocumentActions({
      documentId,
      editorRef,
      setIsDirty,
      onError: error,
    });

  // Derived state
  const isDocumentLocked = currentDocumentStatus === "locked";

  // Effects
  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

  useEffect(() => {
    setCurrentVisibility(visibility);
    setCurrentEditors(editors);
  }, [visibility, editors]);

  useEffect(() => {
    setCurrentDocumentStatus(documentStatus || "draft");
  }, [documentStatus]);

  // Event handlers
  const handleContentChange = () => {
    if (isDocumentLocked && !forceEditable) {
      error("This document is locked and cannot be edited.");
      return;
    }

    if (
      (hasSignature || currentDocumentStatus === "signed") &&
      !showEditConfirmDialog &&
      !forceEditable
    ) {
      setShowEditConfirmDialog(true);
      return;
    }
    setIsDirty(true);
  };

  const handleAddSignatureClick = async () => {
    if (isDocumentLocked) {
      error("Cannot add signature to a locked document.");
      return;
    }

    if (isDirty) {
      const shouldSave = window.confirm(
        "You must save your changes before adding a signature. Save now?"
      );
      if (shouldSave) {
        try {
          await saveChangesWithAction("edited");
          setShowSignatureModal(true);
        } catch (err) {
          console.error("Error saving before signature:", err);
        }
      }
      return;
    }
    setShowSignatureModal(true);
  };

  const insertSignature = async (signatureOptions: SignatureOptions) => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      try {
        editorObj.focusIn();
        editorObj.editor.insertImage(
          signatureOptions.dataUrl,
          signatureOptions.width,
          signatureOptions.height
        );
        setSignatureCount((prev) => prev + 1);
        setHasSignature(true);
        setIsDirty(true);
        console.log(`Signature ${signatureCount + 1} inserted successfully`);

        // Save with async/await for better error handling
        setTimeout(async () => {
          try {
            await saveChangesWithAction("signed");
          } catch (err) {
            console.error("Error saving after signature insertion:", err);
          }
        }, 100);
      } catch (insertError) {
        console.error("Error inserting signature:", insertError);
        // Fallback method
        try {
          editorObj.editor.insertImage(signatureOptions.dataUrl);
          setSignatureCount((prev) => prev + 1);
          setHasSignature(true);
          setIsDirty(true);
          console.log("Signature inserted with basic method");

          setTimeout(async () => {
            try {
              await saveChangesWithAction("signed");
            } catch (err) {
              console.error("Error saving after fallback signature:", err);
            }
          }, 100);
        } catch (fallbackError) {
          console.error("Fallback insertion also failed:", fallbackError);
          error("Error inserting signature. Please try again.");
        }
      }
    }
    setShowSignatureModal(false);
  };

  const handleEditConfirmation = (shouldContinue: boolean) => {
    if (shouldContinue) {
      setHasSignature(false);
      setSignatureCount(0);
      setIsDirty(true);
      setForceEditable(true);
      console.log("Signatures cleared, editing re-enabled");
    }
    setShowEditConfirmDialog(false);
  };

  const handleForceEdit = () => {
    if (isDocumentLocked) {
      error(
        "Cannot edit a locked document. The document is permanently archived."
      );
      return;
    }

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

  const handleActivityLogs = async () => {
    try {
      const response = await DocumentService.getDocument(documentId!);
      const versions = response.data.versions;
      setLogs(versions);
      setShowLogsModal(true);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const handleDownloadVersion = async (logEntry: any) => {
    try {
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "absolute";
      hiddenContainer.style.left = "-9999px";
      hiddenContainer.style.width = "100px";
      hiddenContainer.style.height = "100px";
      hiddenContainer.id = "temp-editor-" + Date.now();
      document.body.appendChild(hiddenContainer);

      const tempEditorContainer = new DocumentEditorContainer({
        enableToolbar: false,
        height: "100px",
      });

      DocumentEditorContainer.Inject(Toolbar);
      tempEditorContainer.appendTo(hiddenContainer);

      let sfdtContent;
      if (typeof logEntry.sfdt === "string") {
        try {
          sfdtContent = JSON.parse(logEntry.sfdt);
        } catch (parseError) {
          console.error("Error parsing SFDT string:", parseError);
          error("Invalid document format. Cannot download this version.");
          return;
        }
      } else {
        sfdtContent = logEntry.sfdt;
      }

      tempEditorContainer.documentEditor.open(sfdtContent);

      const timestamp = new Date(logEntry.createdAt).toISOString().slice(0, 10);
      const versionFileName = `${localFileName}_v${logEntry.version}_${timestamp}_${logEntry.action}`;

      tempEditorContainer.documentEditor.save(versionFileName, "Docx");

      console.log(`Downloaded version ${logEntry.version} successfully`);

      setTimeout(() => {
        tempEditorContainer.destroy();
        document.body.removeChild(hiddenContainer);
      }, 1000);
    } catch (err) {
      console.error("Error downloading document version:", err);
      error("Failed to download document version. Please try again.");
    }
  };

  const handleDocumentLocked = () => {
    setCurrentDocumentStatus("locked");
    setForceEditable(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <DocumentHeader
        fileName={localFileName}
        setFileName={setLocalFileName}
        isDirty={isDirty}
        signatureCount={signatureCount}
        shouldBeReadOnly={shouldBeReadOnly}
        isDocumentLocked={isDocumentLocked}
        forceEditable={forceEditable}
        currentVisibility={currentVisibility}
        currentEditors={currentEditors}
        isSaving={isSaving}
        onSave={saveChanges}
        onAddSignature={handleAddSignatureClick}
        onExport={() => exportDocument(localFileName)}
        onShowLogs={handleActivityLogs}
        onShowComparison={() => setShowComparisonModal(true)}
        onForceEdit={handleForceEdit}
        onShowSettings={() => setShowSettingsModal(true)}
        isCreator={isCreator}
      />

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <DocumentEditorContainerComponent
          id="container"
          ref={editorRef}
          width="100%"
          height="100%"
          serviceUrl="https://services.syncfusion.com/react/production/api/documenteditor/"
          enableToolbar={true}
          contentChange={handleContentChange}
        />
      </div>

      {/* Modals */}
      {showSignatureModal && (
        <SignatureModal
          onConfirm={insertSignature}
          onCancel={() => setShowSignatureModal(false)}
        />
      )}

      {showSettingsModal && documentId && (
        <DocumentSettings
          documentId={documentId}
          currentVisibility={currentVisibility}
          currentStatus={currentDocumentStatus as "draft" | "signed" | "locked"}
          onDocumentLocked={handleDocumentLocked}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showComparisonModal && documentId && (
        <DocumentComparisonModal
          documentId={documentId}
          onClose={() => setShowComparisonModal(false)}
        />
      )}

      <ActivityLogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        logs={logs}
        signedBy={signedBy}
        fileName={localFileName}
        onDownloadVersion={handleDownloadVersion}
      />

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
