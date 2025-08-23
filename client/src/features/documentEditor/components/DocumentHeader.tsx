// components/DocumentHeader.tsx
import React from "react";
import { DocumentStatusIndicators } from "./DocumentStatusIndicators";
import { DocumentActions } from "./DocumentActions";

interface DocumentHeaderProps {
  fileName: string;
  setFileName: (name: string) => void;
  isDirty: boolean;
  signatureCount: number;
  shouldBeReadOnly: boolean;
  isDocumentLocked: boolean;
  forceEditable: boolean;
  currentVisibility: "public" | "private";
  currentEditors: string[];
  onSave: () => void;
  onAddSignature: () => void;
  onExport: () => void;
  onShowLogs: () => void;
  onShowComparison: () => void;
  onForceEdit: () => void;
  onShowSettings: () => void;
  isCreator: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  fileName,
  setFileName,
  isDirty,
  signatureCount,
  shouldBeReadOnly,
  isDocumentLocked,
  forceEditable,
  currentVisibility,
  currentEditors,
  onSave,
  onAddSignature,
  onExport,
  onShowLogs,
  onShowComparison,
  onForceEdit,
  onShowSettings,
  isCreator,
}) => {
  return (
    <div className="bg-gray-100 border-b px-4 py-3 flex flex-wrap justify-between items-center gap-3">
      {/* File Name Input */}
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Enter file name"
        className="text-lg font-medium px-3 py-2 border border-gray-300 rounded-md flex-1 max-w-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
        disabled={shouldBeReadOnly}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <DocumentStatusIndicators
          isDirty={isDirty}
          signatureCount={signatureCount}
          shouldBeReadOnly={shouldBeReadOnly}
          isDocumentLocked={isDocumentLocked}
          forceEditable={forceEditable}
          currentVisibility={currentVisibility}
          currentEditors={currentEditors}
        />

        <DocumentActions
          shouldBeReadOnly={shouldBeReadOnly}
          isDirty={isDirty}
          isDocumentLocked={isDocumentLocked}
          isCreator={isCreator}
          onSave={onSave}
          onAddSignature={onAddSignature}
          onExport={onExport}
          onShowLogs={onShowLogs}
          onShowComparison={onShowComparison}
          onForceEdit={onForceEdit}
          onShowSettings={onShowSettings}
        />
      </div>
    </div>
  );
};
