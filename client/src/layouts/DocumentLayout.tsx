import React, { useState } from 'react';
import DocumentGenerator from '../features/documentGenerator/DocumentGenerator';
import DocEditor from '../features/documentEditor/DocEditor';

const DocumentLayout = () => {
  const [sfdtContent, setSfdtContent] = useState<string | null>(null);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Editor Section */}
      <div className="flex-1 min-h-0 overflow-hidden border-b md:border-b-0 md:border-r border-gray-200">
        <DocEditor sfdt={sfdtContent} />
      </div>

      {/* Generator Sidebar */}
      <div className="w-full md:w-[320px] max-h-screen overflow-y-auto bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
        <div className="h-full p-4">
          <DocumentGenerator onDocumentGenerated={setSfdtContent} />
        </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
