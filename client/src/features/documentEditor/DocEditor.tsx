import "../../App.css";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";

DocumentEditorContainerComponent.Inject(Toolbar);

interface DocEditorProps {
  sfdt: string | null;
  fileName: string;
}

const DocEditor: React.FC<DocEditorProps> = ({ sfdt, fileName }) => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const { documentId } = useParams<{ documentId?: string }>();

  const [localFileName, setLocalFileName] = useState(fileName);

  useEffect(() => {
    setLocalFileName(fileName); // update when prop changes
  }, [fileName]);

  // Load generated document
  useEffect(() => {
    if (sfdt && editorRef.current) {
      editorRef.current.documentEditor.open(sfdt);
    }
  }, [sfdt]);

  const onSave = () => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      const sfdtContent = editorObj.serialize();
      console.log("Saving document:", localFileName, documentId, sfdtContent);
      editorObj.save(localFileName.trim() || "Untitled", "Docx");
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="bg-gray-100 border-b px-4 py-3 flex justify-between items-center">
        <input
          type="text"
          value={localFileName}
          onChange={(e) => setLocalFileName(e.target.value)}
          placeholder="Enter file name"
          className="text-lg font-medium px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={onSave}
          className="bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>
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
    </div>
  );
};

export default DocEditor;
