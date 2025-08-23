import React from "react";
import { DocumentStatusIndicators } from "./DocumentStatusIndicators";
import { DocumentActions } from "./DocumentActions";
import certifai_logo_no_text from "../../../assets/certifai-logo-no-text.svg";

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
  const handleBackHome = () => {
    // Navigate back to home/dashboard
    window.location.href = "/home"; // or use your router navigation
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Back Button, Logo, and File Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Back to Home Button */}
          <button
            onClick={handleBackHome}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            title="Back to Dashboard"
          >
            <div className="flex items-center gap-2">
              <img
                src={certifai_logo_no_text}
                alt="Logo Icon"
                className="h-12"
              />
            </div>
          </button>

          {/* File Name Input */}
          <div className="flex max-w-md">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter document name"
              className="w-auto text-md text-gray-700 font-semibold px-2 py-1 border-2 border-transparent rounded-xl hover:border-gray-300 focus:border-[#aa6bfe] focus:ring-4 focus:ring-[#aa6bfe] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:hover:border-transparent"
              disabled={shouldBeReadOnly}
            />
          </div>
        </div>

        {/* Right Section - Status Indicators and Actions */}
        <div className="flex items-center gap-3">
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
    </div>
  );
};
