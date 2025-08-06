import '../../App.css';
import { useRef, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from '@syncfusion/ej2-react-documenteditor';

DocumentEditorContainerComponent.Inject(Toolbar);

interface LocationState {
  documentId?: string;
  documentTitle?: string;
}

interface DocEditorProps {
  sfdt: string | null;
}

const DocEditor: React.FC<DocEditorProps> = ({ sfdt }) => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const { documentId } = useParams<{ documentId?: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  const [fileName, setFileName] = useState('Untitled');
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  useEffect(() => {
    if (state?.documentTitle) {
      setFileName(state.documentTitle);
    }

    if (state?.documentId || documentId) {
      setCurrentDocumentId(state?.documentId || documentId || null);
    }
  }, [state, documentId]);

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
      console.log('Saving document:', fileName, currentDocumentId, sfdtContent);
      editorObj.save(fileName.trim() || 'Untitled', 'Docx');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="bg-gray-100 border-b px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="text-lg font-medium px-3 py-2 border border-gray-300 rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {currentDocumentId && (
            <span className="text-sm text-gray-500">
              ID: {currentDocumentId.slice(0, 8)}...
            </span>
          )}
        </div>
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
