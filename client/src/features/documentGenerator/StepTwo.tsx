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
    <div className="space-y-5 relative z-10">
      <label className="block text-sm font-medium text-gray-700">
        Describe the purpose or context:
      </label>
      <textarea
        className="w-full p-3 border border-[#aa6bfe]/20 rounded-xl resize-y bg-[#eeebf0]/50
                 focus:outline-none focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe]"
        placeholder="E.g. I lost my ID last week..."
        rows={5}
        value={userPrompt}
        onChange={(e) => onPromptChange(e.target.value)}
      />
      <div className="flex justify-between items-center pt-4 border-t border-[#aa6bfe]/10">
        <button
          type="button"
          onClick={onBack}
          className="text-[#aa6bfe] hover:text-[#000002] hover:underline text-sm transition flex items-center gap-1"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading || !userPrompt.trim()}
          className={`px-6 py-2 rounded-xl text-sm font-medium shadow
            transition transform active:scale-95 ${
              isLoading || !userPrompt.trim()
                ? "bg-[#aa6bfe]/40 text-white cursor-not-allowed"
                : "bg-[#000002] text-[#d0f600] hover:bg-opacity-90"
            }`}
        >
          {isLoading ? "⏳ Generating..." : "✨ Generate Document"}
        </button>
      </div>
    </div>
  );
};
export default StepTwo;
