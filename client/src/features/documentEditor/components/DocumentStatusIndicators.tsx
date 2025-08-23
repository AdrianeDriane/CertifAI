import React from "react";
import {
  AlertTriangle,
  FileSignature,
  Lock,
  Archive,
  Unlock,
  Globe,
  EyeOff,
  Users,
} from "lucide-react";

interface DocumentStatusIndicatorsProps {
  isDirty: boolean;
  signatureCount: number;
  shouldBeReadOnly: boolean;
  isDocumentLocked: boolean;
  forceEditable: boolean;
  currentVisibility: "public" | "private";
  currentEditors: string[];
}

export const DocumentStatusIndicators: React.FC<
  DocumentStatusIndicatorsProps
> = ({
  isDirty,
  signatureCount,
  shouldBeReadOnly,
  isDocumentLocked,
  forceEditable,
  currentVisibility,
  currentEditors,
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isDirty && (
        <span
          title="Unsaved Changes"
          className="p-2 bg-amber-50 rounded-lg border border-amber-200 shadow-sm text-amber-700"
        >
          <AlertTriangle size={16} />
        </span>
      )}

      {signatureCount > 0 && (
        <span
          title={`${signatureCount} Signature${signatureCount !== 1 ? "s" : ""}`}
          className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm text-emerald-700"
        >
          <FileSignature size={16} />
        </span>
      )}

      {shouldBeReadOnly && (
        <span
          title={isDocumentLocked ? "Locked" : "Read-only"}
          className="p-2 bg-blue-50 rounded-lg border border-blue-200 shadow-sm text-blue-700"
        >
          <Lock size={16} />
        </span>
      )}

      {isDocumentLocked && (
        <span
          title="Archived"
          className="p-2 bg-red-50 rounded-lg border border-red-200 shadow-sm text-red-700"
        >
          <Archive size={16} />
        </span>
      )}

      {forceEditable && !isDocumentLocked && (
        <span
          title="Force Edit Enabled"
          className="p-2 bg-orange-50 rounded-lg border border-orange-200 shadow-sm text-orange-700"
        >
          <Unlock size={16} />
        </span>
      )}

      <span
        title={currentVisibility === "public" ? "Public" : "Private"}
        className={`p-2 rounded-lg border shadow-sm ${
          currentVisibility === "public"
            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
            : "text-slate-700 bg-slate-50 border-slate-200"
        }`}
      >
        {currentVisibility === "public" ? (
          <Globe size={16} />
        ) : (
          <EyeOff size={16} />
        )}
      </span>

      {currentEditors.length > 0 && (
        <span
          title={`${currentEditors.length} Editor${
            currentEditors.length !== 1 ? "s" : ""
          }`}
          className="p-2 bg-purple-50 rounded-lg border border-purple-200 shadow-sm text-[#aa6bfe]"
        >
          <Users size={16} />
        </span>
      )}
    </div>
  );
};
