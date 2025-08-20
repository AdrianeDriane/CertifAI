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
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-700">
        Select a Document Type
      </h2>

      {/* Predefined Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {predefinedTypes.map((type) => (
          <button
            key={type}
            onClick={() => type !== "Other" && onSelect(type)}
            className="border rounded-lg p-3 hover:bg-blue-50 text-left text-sm font-medium 
                       text-gray-700 transition shadow-sm"
          >
            {type}
          </button>
        ))}
      </div>

      {/* Custom Type Input */}
      <div className="pt-3 border-t">
        <label
          htmlFor="customType"
          className="block text-sm font-medium text-gray-600 mb-2"
        >
          Or type a custom document type
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="customType"
            className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="e.g. Joint Venture Agreement"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
          />
          <button
            onClick={() => customType.trim() && onSelect(customType.trim())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
