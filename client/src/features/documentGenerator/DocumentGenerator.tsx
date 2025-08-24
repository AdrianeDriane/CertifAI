import React, { useState } from "react";
import { Wand, ChevronLeft, ChevronRight } from "lucide-react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { generateGroqDocument } from "../../services/groqService";
interface DocumentGeneratorProps {
  onDocumentGenerated?: (sfdt: string) => void;
}
const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  onDocumentGenerated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerate = async () => {
    if (!docType || !userPrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await generateGroqDocument({
        docType,
        userPrompt,
      });
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
      className={`relative flex flex-col h-screen max-h-screen overflow-hidden bg-[#eeebf0] border-l border-[#aa6bfe]/20
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-80" : "w-16"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-[#aa6bfe]/10 bg-gradient-to-r from-[#aa6bfe]/10 to-[#d0f600]/10 relative">
        <div
          className={`p-2 rounded-lg shadow transition ${
            isOpen
              ? "bg-[#000002] text-[#d0f600]"
              : "bg-[#eeebf0] text-[#aa6bfe]"
          }`}
        >
          <Wand size={20} />
        </div>
        <h1
          className={`${
            isOpen ? "block" : "hidden"
          } text-lg font-semibold text-[#000002] flex items-center gap-2`}
        >
          CertifAI's Document Wizard
        </h1>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center
                     w-8 h-8 rounded-full bg-white border border-[#aa6bfe]/20 shadow-md hover:bg-[#eeebf0] transition"
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 h-16 w-16 bg-[#d0f600] rounded-full opacity-5"></div>
        <div className="absolute bottom-1/3 left-1/3 h-24 w-24 bg-[#aa6bfe] rounded-full opacity-5"></div>
        {isOpen ? (
          <div className="overflow-hidden h-full bg-white shadow-md rounded-2xl px-6 pt-4 pb-6 space-y-4 animate-fadeIn relative">
            {/* Geometric accents */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#d0f600]/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#aa6bfe]/10 rounded-full"></div>

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

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#aa6bfe] to-[#d0f600]"></div>
          </div>
        ) : (
          // When collapsed → no clickable wand, just leave it empty
          <div className="flex flex-col items-center justify-center h-full text-[#aa6bfe]/50 text-xs">
            {/* Could show a tooltip/hint here if you want */}
          </div>
        )}
      </div>
    </div>
  );
};
export default DocumentGenerator;
