import React from "react";

interface Props {
  userPrompt: string;
  onPromptChange: (val: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const StepTwo: React.FC<Props> = ({
  userPrompt,
  onPromptChange,
  onBack,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="space-y-5">
      <label className="block text-sm font-medium text-gray-700">
        Describe the purpose or context:
      </label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg resize-y 
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="E.g. I lost my ID last week..."
        rows={5}
        value={userPrompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />

      <div className="flex justify-between items-center pt-3 border-t">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 hover:underline text-sm transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !userPrompt.trim()}
          className={`px-6 py-2 rounded-lg text-white font-medium text-sm shadow 
            transition transform active:scale-95
            ${
              isLoading || !userPrompt.trim()
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isLoading ? "⏳ Generating..." : "✨ Generate Document"}
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
