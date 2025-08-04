import '../../App.css';
import { useRef } from 'react';
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from '@syncfusion/ej2-react-documenteditor';

DocumentEditorContainerComponent.Inject(Toolbar);

const DocEditor = () => {
  const editorRef = useRef<DocumentEditorContainerComponent>(null);

  const onSave = async () => {
    const editorObj = editorRef.current?.documentEditor;
    if (editorObj) {
      const blob = await editorObj.saveAsBlob('Docx');
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="p-4 bg-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Certifai Document Editor</h2>
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
        height={'100%'}
        serviceUrl="https://services.syncfusion.com/react/production/api/documenteditor/"
        enableToolbar={true}
      />
    </div>
  );
};

export default DocEditor;
