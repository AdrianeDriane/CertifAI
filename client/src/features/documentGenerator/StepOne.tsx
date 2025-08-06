import React, { useState } from 'react';

interface StepOneProps {
  onSelect: (id: string) => void;
}

const predefinedTypes = [
  'Affidavit of Loss',
  'Certificate of Employment',
  'Non-Disclosure Agreement',
  'Contract of Lease',
  'Authorization Letter',
  'Other', // <- Add this
];

const StepOne: React.FC<StepOneProps> = ({ onSelect }) => {
  const [customType, setCustomType] = useState('');

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Select a Document Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {predefinedTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              if (type === 'Other') return; // Skip and show input instead
              onSelect(type);
            }}
            className="border rounded p-2 hover:bg-gray-100 text-left"
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label htmlFor="customType" className="block text-sm font-medium text-gray-700">
          Or type a custom document type
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="customType"
            className="w-full border rounded p-2 text-sm"
            placeholder="e.g. Joint Venture Agreement"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
          />
          <button
            onClick={() => {
              if (customType.trim()) {
                onSelect(customType.trim());
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
