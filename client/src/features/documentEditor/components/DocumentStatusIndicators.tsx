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
        <span className="flex items-center gap-1.5 text-sm font-medium text-amber-700 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
          <AlertTriangle size={14} /> Unsaved
        </span>
      )}
      {signatureCount > 0 && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
          <FileSignature size={14} /> {signatureCount} Signature
          {signatureCount !== 1 ? "s" : ""}
        </span>
      )}
      {shouldBeReadOnly && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <Lock size={14} />
          {isDocumentLocked ? "Locked" : "Read-only"}
        </span>
      )}
      {isDocumentLocked && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-red-700 px-3 py-2 bg-red-50 rounded-lg border border-red-200 shadow-sm">
          <Archive size={14} /> Archived
        </span>
      )}
      {forceEditable && !isDocumentLocked && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-orange-700 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
          <Unlock size={14} /> Force Edit
        </span>
      )}
      <span
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border shadow-sm ${
          currentVisibility === "public"
            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
            : "text-slate-700 bg-slate-50 border-slate-200"
        }`}
      >
        {currentVisibility === "public" ? (
          <>
            <Globe size={14} /> Public
          </>
        ) : (
          <>
            <EyeOff size={14} /> Private
          </>
        )}
      </span>
      {currentEditors.length > 0 && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-[#aa6bfe] px-3 py-2 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
          <Users size={14} /> {currentEditors.length} Editor
          {currentEditors.length !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
};
