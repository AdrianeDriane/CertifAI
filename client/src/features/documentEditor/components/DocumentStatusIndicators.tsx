// components/DocumentStatusIndicators.tsx
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
    <>
      {isDirty && (
        <span className="flex items-center gap-1 text-sm text-amber-700 px-3 py-1.5 bg-amber-50 rounded-md border border-amber-200">
          <AlertTriangle size={16} /> Unsaved
        </span>
      )}

      {signatureCount > 0 && (
        <span className="flex items-center gap-1 text-sm text-green-700 px-3 py-1.5 bg-green-50 rounded-md border border-green-200">
          <FileSignature size={16} /> {signatureCount}
        </span>
      )}

      {shouldBeReadOnly && (
        <span className="flex items-center gap-1 text-sm text-blue-700 px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
          <Lock size={16} />
          {isDocumentLocked ? "Locked" : "Read-only"}
        </span>
      )}

      {isDocumentLocked && (
        <span className="flex items-center gap-1 text-sm text-red-700 px-3 py-1.5 bg-red-50 rounded-md border border-red-200">
          <Archive size={16} /> Archived
        </span>
      )}

      {forceEditable && !isDocumentLocked && (
        <span className="flex items-center gap-1 text-sm text-orange-700 px-3 py-1.5 bg-orange-50 rounded-md border border-orange-200">
          <Unlock size={16} /> Forced
        </span>
      )}

      <span
        className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border ${
          currentVisibility === "public"
            ? "text-green-700 bg-green-50 border-green-200"
            : "text-gray-700 bg-gray-50 border-gray-200"
        }`}
      >
        {currentVisibility === "public" ? (
          <>
            <Globe size={16} /> Public
          </>
        ) : (
          <>
            <EyeOff size={16} /> Private
          </>
        )}
      </span>

      {currentEditors.length > 0 && (
        <span className="flex items-center gap-1 text-sm text-purple-700 px-3 py-1.5 bg-purple-50 rounded-md border border-purple-200">
          <Users size={16} /> {currentEditors.length}
        </span>
      )}
    </>
  );
};
