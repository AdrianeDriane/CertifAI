import React, { useState } from "react";
interface StepOneProps {
  onSelect: (id: string) => void;
}
const predefinedTypes = [
  "Affidavit of Loss",
  "Certificate of Employment",
  "Non-Disclosure Agreement",
  "Contract of Lease",
  "Authorization Letter",
  "Other",
];
const StepOne: React.FC<StepOneProps> = ({ onSelect }) => {
  const [customType, setCustomType] = useState("");
  return (
    <div className="space-y-5 relative z-10">
      <h2 className="text-lg font-semibold text-[#000002]">
        Select a Document Type
      </h2>
      {/* Predefined Options */}
      <div className="grid grid-cols-1 gap-3">
        {predefinedTypes.map((type) => (
          <button
            key={type}
            onClick={() => type !== "Other" && onSelect(type)}
            className="border border-[#aa6bfe]/20 rounded-xl p-3 hover:bg-[#eeebf0] text-left text-sm font-medium
                     text-[#000002] transition shadow-sm flex justify-between items-center group"
          >
            <span>{type}</span>
            {type !== "Other" && (
              <span className="h-5 w-5 rounded-full bg-[#eeebf0] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="h-2 w-2 bg-[#aa6bfe] rounded-full"></span>
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Custom Type Input */}
      <div className="pt-4 border-t border-[#aa6bfe]/10">
        <label
          htmlFor="customType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Or type a custom document type
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="customType"
            className="flex-1 border border-[#aa6bfe]/20 rounded-xl p-2 text-sm 
                     focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe] focus:outline-none
                     bg-[#eeebf0]/50"
            placeholder="e.g. Joint Venture Agreement"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
          />
          <button
            onClick={() => customType.trim() && onSelect(customType.trim())}
            disabled={!customType.trim()}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              !customType.trim()
                ? "bg-[#aa6bfe]/40 text-white cursor-not-allowed"
                : "bg-[#aa6bfe] text-white hover:bg-[#aa6bfe]/90"
            }`}
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
};
export default StepOne;
