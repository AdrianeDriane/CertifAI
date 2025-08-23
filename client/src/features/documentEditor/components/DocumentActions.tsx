// components/DocumentActions.tsx
import React, { useState } from "react";
import {
  Plus,
  Save,
  Settings,
  ChevronDown,
  Download,
  List,
  FileSearch,
  Pencil,
} from "lucide-react";

interface DocumentActionsProps {
  shouldBeReadOnly: boolean;
  isDirty: boolean;
  isDocumentLocked: boolean;
  isCreator: boolean;
  onSave: () => void;
  onAddSignature: () => void;
  onExport: () => void;
  onShowLogs: () => void;
  onShowComparison: () => void;
  onForceEdit: () => void;
  onShowSettings: () => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  shouldBeReadOnly,
  isDirty,
  isDocumentLocked,
  isCreator,
  onSave,
  onAddSignature,
  onExport,
  onShowLogs,
  onShowComparison,
  onForceEdit,
  onShowSettings,
}) => {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Add Signature */}
      <button
        onClick={onAddSignature}
        disabled={shouldBeReadOnly}
        className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md transition ${
          shouldBeReadOnly
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        <Plus size={16} /> Signature
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={!isDirty || isDocumentLocked}
        className={`flex items-center gap-1 text-sm px-3 py-2 rounded-md transition ${
          isDirty && !isDocumentLocked
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <Save size={16} /> Save
      </button>

      {/* Actions Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowActionsDropdown(!showActionsDropdown)}
          className="flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition"
        >
          <Settings size={16} />
          More
          <ChevronDown size={14} />
        </button>

        {showActionsDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowActionsDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    onExport();
                    setShowActionsDropdown(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download size={16} /> Export Document
                </button>

                <button
                  onClick={() => {
                    onShowLogs();
                    setShowActionsDropdown(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <List size={16} /> Activity Logs
                </button>

                <button
                  onClick={() => {
                    onShowComparison();
                    setShowActionsDropdown(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileSearch size={16} /> Compare Versions
                </button>

                {shouldBeReadOnly && !isDocumentLocked && (
                  <>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onForceEdit();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50"
                    >
                      <Pencil size={16} /> Force Edit
                    </button>
                  </>
                )}

                {isCreator && (
                  <>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onShowSettings();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} /> Document Settings
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
