import "../../App.css";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DocumentEditorContainerComponent,
  DocumentEditorContainer,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { getFingerprint } from "../../utils/getFingerprint";
import axios from "axios";
import SignatureModal from "../signature/SignatureModal";
import DocumentSettings from "./DocumentSettings";
import { useToast } from "../../hooks/useToast";
import {
  AlertTriangle,
  FileSignature,
  Lock,
  Unlock,
  Globe,
  EyeOff,
  Users,
  Settings,
  Pencil,
  Plus,
  Save,
  Download,
  List,
  Clock,
  Hash,
  User,
  FileCode2,
  FileSearch,
  FileCheck,
  CheckCircle,
  Archive,
} from "lucide-react";

import DocumentComparisonModal from "./DocumentComparisonModal";

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
  // Add state for document status
  const [currentDocumentStatus, setCurrentDocumentStatus] = useState<string>(
    documentStatus || "draft"
  );
  const { error } = useToast();
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

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

  // Update document status when prop changes
  useEffect(() => {
    setCurrentDocumentStatus(documentStatus || "draft");
  }, [documentStatus]);

  const handleActivityLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const fingerprint = await getFingerprint();

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-device-fingerprint": fingerprint,
          },
        }
      );

      const versions = response.data.versions;

      setLogs(versions);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const isCreator = currentUserId && createdBy && currentUserId === createdBy;

  // Check if document should be read-only
  const isDocumentSigned = currentDocumentStatus === "signed";
  const isDocumentLocked = currentDocumentStatus === "locked";
  const shouldBeReadOnly =
    (hasSignature || isDocumentSigned || isDocumentLocked) && !forceEditable;

  // Handle document locked callback
  const handleDocumentLocked = () => {
    setCurrentDocumentStatus("locked");
    setForceEditable(false); // Disable force edit when document is locked
  };

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
    // Don't allow signature if document is locked
    if (isDocumentLocked) {
      error("Cannot add signature to a locked document.");
      return;
    }

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
    // Don't allow editing if document is locked
    if (isDocumentLocked && !forceEditable) {
      error("This document is locked and cannot be edited.");
      return;
    }

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
    // Don't allow force edit if document is locked
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
        editorObj.save(localFileName.trim() || "Untitled", "Docx");
      } catch (error) {
        console.error("Error saving document:", error);
      }
    }
  };

  const onSaveCopyFromLog = async (logEntry: any) => {
    try {
      // Hacky way: hidden container element
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

      // Appending to hidden container
      tempEditorContainer.appendTo(hiddenContainer);

      // Parsing of SFDT content
      let sfdtContent;
      if (typeof logEntry.sfdt === "string") {
        try {
          sfdtContent = JSON.parse(logEntry.sfdt);
        } catch (parseError) {
          console.error("Error parsing SFDT string:", parseError);
          alert("Invalid document format. Cannot download this version.");
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
    } catch (error) {
      console.error("Error downloading document version:", error);
      alert("Failed to download document version. Please try again.");
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
      <div className="bg-gray-100 border-b px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* File Name */}
        <input
          type="text"
          value={localFileName}
          onChange={(e) => setLocalFileName(e.target.value)}
          placeholder="Enter file name"
          className="text-lg font-medium px-3 py-2 border border-gray-300 rounded-md flex-1 max-w-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          disabled={shouldBeReadOnly}
        />

        {/* Status + Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isDirty && (
            <span className="flex items-center gap-1 text-sm text-amber-700 px-3 py-1.5 bg-amber-50 rounded-md border border-amber-200">
              <AlertTriangle size={16} /> Unsaved
            </span>
          )}
          {signatureCount > 0 && (
            <span className="flex items-center gap-1 text-sm text-green-700 px-3 py-1.5 bg-green-50 rounded-md border border-green-200">
              <FileSignature size={16} /> {signatureCount}
            </span>
          )}
          {shouldBeReadOnly && (
            <span className="flex items-center gap-1 text-sm text-blue-700 px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <Lock size={16} />
              {isDocumentLocked ? "Locked" : "Read-only"}
            </span>
          )}
          {/* Add locked document indicator */}
          {isDocumentLocked && (
            <span className="flex items-center gap-1 text-sm text-red-700 px-3 py-1.5 bg-red-50 rounded-md border border-red-200">
              <Archive size={16} /> Archived
            </span>
          )}
          {forceEditable &&
            (isDocumentSigned || hasSignature) &&
            !isDocumentLocked && (
              <span className="flex items-center gap-1 text-sm text-orange-700 px-3 py-1.5 bg-orange-50 rounded-md border border-orange-200">
                <Unlock size={16} /> Forced
              </span>
            )}

          {/* Visibility */}
          <span
            className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border ${
              currentVisibility === "public"
                ? "text-green-700 bg-green-50 border-green-200"
                : "text-gray-700 bg-gray-50 border-gray-200"
            }`}
          >
            {currentVisibility === "public" ? (
              <>
                <Globe size={16} /> Public
              </>
            ) : (
              <>
                <EyeOff size={16} /> Private
              </>
            )}
          </span>

          {/* Editors */}
          {currentEditors.length > 0 && (
            <span className="flex items-center gap-1 text-sm text-purple-700 px-3 py-1.5 bg-purple-50 rounded-md border border-purple-200">
              <Users size={16} /> {currentEditors.length}
            </span>
          )}

          {/* Settings - only show if creator and document is not locked */}
          {isCreator && (
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition"
            >
              <Settings size={16} /> Settings
            </button>
          )}

          {/* Force Edit - don't show if document is locked */}
          {shouldBeReadOnly && !isDocumentLocked && (
            <button
              onClick={handleForceEdit}
              className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
            >
              <Pencil size={16} /> Force Edit
            </button>
          )}

          {/* Signature */}
          <button
            onClick={handleAddSignatureClick}
            disabled={shouldBeReadOnly}
            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md transition ${
              shouldBeReadOnly
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Plus size={16} /> Signature
          </button>

          {/* Save - disabled if document is locked */}
          <button
            onClick={saveChanges}
            disabled={!isDirty || isDocumentLocked}
            className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md transition ${
              isDirty && !isDocumentLocked
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Save size={16} /> Save
          </button>

          {/* Export */}
          <button
            onClick={onSave}
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Download size={16} /> Export
          </button>

          {/* Activity Logs */}
          <button
            onClick={async () => {
              await handleActivityLogs();
              setShowLogs(true); // ✅ open modal after fetching
            }}
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <List size={16} /> Logs
          </button>

          {/* Document Comparison */}
          <button
            onClick={() => setShowComparisonModal(true)}
            className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            <FileSearch size={16} /> Compare
          </button>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-auto max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📜 Activity Logs
              </h2>
              <button
                onClick={() => setShowLogs(false)}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex gap-6 overflow-hidden">
              {/* Left - Signatures */}
              <div className="w-64 border-r pr-4 flex-shrink-0 self-start">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <FileCheck size={14} />
                  Signed By:
                </h4>

                {signedBy && signedBy.length > 0 ? (
                  <div className="space-y-1">
                    {signedBy.map((signer, signerIdx) => (
                      <div
                        key={signerIdx}
                        className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded"
                      >
                        <CheckCircle size={12} />
                        <span className="truncate" title={signer}>
                          {signer}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border-l-2 border-orange-200">
                    <div className="flex items-start gap-1">
                      <AlertTriangle
                        size={12}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Any signature isn't valid because file was configured
                        after signature. User can attempt to sign again.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Logs */}
              <div className="flex-1 max-h-[70vh] overflow-y-auto pr-2">
                {logs.length > 0 ? (
                  <ul className="space-y-4">
                    {[...logs].reverse().map((log, idx) => {
                      const { ...displayLog } = log;

                      return (
                        <li
                          key={idx}
                          className="border rounded-xl bg-gray-50 p-4 shadow-sm hover:shadow-md transition"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                {displayLog.action.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={14} />{" "}
                                {new Date(
                                  displayLog.createdAt
                                ).toLocaleString()}
                              </span>
                            </div>

                            <p className="flex items-center gap-2 text-sm text-gray-700">
                              <User size={16} /> Modified By:{" "}
                              <span className="font-medium">
                                {displayLog.emailModifiedBy}
                              </span>
                            </p>
                            <p className="flex items-center gap-2 text-sm text-gray-700">
                              <FileCode2 size={16} /> Version:{" "}
                              <span className="font-medium">
                                {displayLog.version}
                              </span>
                            </p>

                            {displayLog.blockchainTxHash && (
                              <p className="flex items-center gap-2 text-sm text-gray-700">
                                <Hash size={16} /> Blockchain Tx:{" "}
                                <a
                                  href={`https://amoy.polygonscan.com/tx/${displayLog.blockchainTxHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline hover:text-blue-800"
                                >
                                  {displayLog.blockchainTxHash.slice(0, 10)}...
                                </a>
                              </p>
                            )}

                            <p className="flex items-center gap-2 text-sm text-gray-700">
                              <Hash size={16} /> Hash:{" "}
                              <span className="font-mono text-xs text-gray-600">
                                {displayLog.hash}
                              </span>
                            </p>

                            {/* Download Button */}
                            <div className="mt-2 flex justify-start">
                              <button
                                onClick={() => {
                                  onSaveCopyFromLog(log);
                                }}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
                              >
                                <Download size={14} />
                                Download Document
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-6">
                    No activity logs found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
          currentStatus={currentDocumentStatus as "draft" | "signed" | "locked"}
          onDocumentLocked={handleDocumentLocked}
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
      {/* Document Comparison Modal */}
      {showComparisonModal && documentId && (
        <DocumentComparisonModal
          documentId={documentId}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
};

export default DocEditor;
