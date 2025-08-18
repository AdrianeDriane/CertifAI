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

        // Increment signature counter
        setSignatureCount((prev) => prev + 1);

        console.log(
          `Signature ${signatureCount + 1} inserted successfully (${
            signatureOptions.width
          }x${signatureOptions.height})`
        );
      } catch (error) {
        console.error("Error inserting signature:", error);

        // Fallback: try basic insertion without dimensions
        try {
          editorObj.editor.insertImage(signatureOptions.dataUrl);
          setSignatureCount((prev) => prev + 1);
          console.log("Signature inserted with basic method");
        } catch (fallbackError) {
          console.error("Fallback insertion also failed:", fallbackError);
          alert("Error inserting signature. Please try again.");
        }
      }
    }
    setShowSignatureModal(false);
  };

  useEffect(() => {
    setLocalFileName(fileName);
  }, [fileName]);

  // Load generated document
  useEffect(() => {
    if (sfdt && editorRef.current) {
      try {
        editorRef.current.documentEditor.open(sfdt);
      } catch (error) {
        console.error("Error loading document:", error);
      }
    }
  }, [sfdt]);

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
        { sfdt: sfdtContent, action: "edited" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-device-fingerprint": fingerprint,
          },
        }
      );
      console.log("Document saved successfully");
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
        />

        <div className="flex gap-2 items-center">
          {signatureCount > 0 && (
            <span className="text-sm text-gray-600 px-3 py-2 bg-gray-50 rounded-md">
              Signatures: {signatureCount}
            </span>
          )}

          <button
            onClick={() => setShowSignatureModal(true)}
            className="bg-green-600 text-white text-sm px-5 py-2 rounded-md hover:bg-green-700 transition whitespace-nowrap flex items-center gap-2"
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
            className="bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 transition whitespace-nowrap"
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
        />
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <SignatureModal
          onConfirm={insertSignature}
          onCancel={() => setShowSignatureModal(false)}
        />
      )}
    </div>
  );
};

export default DocEditor;
