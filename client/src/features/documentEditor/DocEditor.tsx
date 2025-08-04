import '../../App.css';
import { useRef, useState } from 'react';
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from '@syncfusion/ej2-react-documenteditor';

DocumentEditorContainerComponent.Inject(Toolbar);

const DocEditor = () => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);
  const [fileName, setFileName] = useState('Untitled');

  const onSave = () => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      editorObj.save(fileName.trim() || 'Untitled', 'Docx');
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="p-4 bg-gray-200 flex justify-between items-center">
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          className="border px-2 py-1 rounded w-1/3 font-semibold"
        />
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
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
