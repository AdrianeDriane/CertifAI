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

const DocEditor = () => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const { documentId } = useParams<{ documentId?: string }>();
  const location = useLocation();
  const state = location.state as LocationState;

  const [fileName, setFileName] = useState('Untitled');
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (state?.documentTitle) {
      setFileName(state.documentTitle);
    }

    if (state?.documentId || documentId) {
      setCurrentDocumentId(state?.documentId || documentId || null);
    }
  }, [state, documentId]);

  const onSave = () => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      // Get current SFDT content
      const sfdtContent = editorObj.serialize();

      if (currentDocumentId) {
        // TODO: Update existing document with new content
        // You'll need to implement an update document API endpoint
        console.log(
          'Updating document:',
          currentDocumentId,
          'with content:',
          sfdtContent
        );

        // For now, just download the file
        editorObj.save(fileName.trim() || 'Untitled', 'Docx');
      } else {
        // Fallback to local save
        editorObj.save(fileName.trim() || 'Untitled', 'Docx');
      }
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="p-4 bg-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="border px-2 py-1 rounded w-80 font-semibold"
          />
          {currentDocumentId && (
            <span className="text-sm text-gray-600">
              Document ID: {currentDocumentId.slice(0, 8)}...
            </span>
          )}
        </div>
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Save
        </button>
      </div>
      <DocumentEditorContainerComponent
        id="container"
        ref={editorRef}
        height="100%"
        serviceUrl="https://services.syncfusion.com/react/production/api/documenteditor/"
        enableToolbar={true}
      />
    </div>
  );
};

export default DocEditor;
