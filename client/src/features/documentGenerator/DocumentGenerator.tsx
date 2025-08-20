import { Wand, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { generateGroqDocument } from "../../services/groqService";

interface DocumentGeneratorProps {
  onDocumentGenerated?: (sfdt: string) => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onDocumentGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!docType || !userPrompt.trim()) return;
    setIsLoading(true);

    try {
      const response = await generateGroqDocument({ docType, userPrompt });
      const sfdt = response.document;
      onDocumentGenerated?.(sfdt);
    } catch (err) {
      alert("⚠️ Failed to generate document. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col h-screen max-h-screen overflow-hidden bg-gray-50 border-l border-gray-200
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-80" : "w-16"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 relative">
        <div
          className={`p-2 rounded-lg shadow transition ${
            isOpen ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          <Wand size={20} />
        </div>
        {isOpen && (
          <h2 className="font-semibold text-gray-800 tracking-wide">Generator</h2>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center 
                     w-8 h-8 rounded-full bg-white border shadow-md hover:bg-gray-100 transition"
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {isOpen ? (
          <div className="overflow-hidden h-full bg-white shadow-md rounded-xl p-6 space-y-6 animate-fadeIn">
            <header className="border-b pb-4">
              <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                📄 Document Composer
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Generate AI-powered legal documents in just a few steps.
              </p>
            </header>

            {step === 1 && (
              <StepOne
                onSelect={(id) => {
                  setDocType(id);
                  setStep(2);
                }}
              />
            )}

            {step === 2 && (
              <StepTwo
                userPrompt={userPrompt}
                onPromptChange={setUserPrompt}
                onBack={() => setStep(1)}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            )}
          </div>
        ) : (
          // When collapsed → no clickable wand, just leave it empty
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs">
            {/* Could show a tooltip/hint here if you want */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator;
