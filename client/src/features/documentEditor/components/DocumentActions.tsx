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
    <div className="flex items-center gap-3">
      {/* Add Signature Button */}
      <button
        onClick={onAddSignature}
        disabled={shouldBeReadOnly}
        className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm ${
          shouldBeReadOnly
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : "bg-[#d0f600] text-[#000002] hover:bg-[#c5e600] border border-[#d0f600] hover:shadow-md"
        }`}
      >
        <Plus size={16} /> Add Signature
      </button>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={!isDirty || isDocumentLocked}
        className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm ${
          isDirty && !isDocumentLocked
            ? "bg-[#aa6bfe] text-white hover:bg-[#9a5bfe] border border-[#aa6bfe] hover:shadow-md"
            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        }`}
      >
        <Save size={16} /> Save
      </button>

      {/* Actions Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowActionsDropdown(!showActionsDropdown)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-slate-700 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm border border-slate-700 hover:shadow-md"
        >
          <Settings size={16} />
          More
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              showActionsDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {showActionsDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowActionsDropdown(false)}
            />
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="py-2">
                <button
                  onClick={() => {
                    onExport();
                    setShowActionsDropdown(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <Download size={16} className="text-gray-500" />
                  Export Document
                </button>
                <button
                  onClick={() => {
                    onShowLogs();
                    setShowActionsDropdown(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <List size={16} className="text-gray-500" />
                  Activity Logs
                </button>
                <button
                  onClick={() => {
                    onShowComparison();
                    setShowActionsDropdown(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <FileSearch size={16} className="text-gray-500" />
                  Compare Versions
                </button>

                {shouldBeReadOnly && !isDocumentLocked && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        onForceEdit();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors duration-150"
                    >
                      <Pencil size={16} className="text-orange-600" />
                      Force Edit Mode
                    </button>
                  </>
                )}

                {isCreator && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={() => {
                        onShowSettings();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <Settings size={16} className="text-gray-500" />
                      Document Settings
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
