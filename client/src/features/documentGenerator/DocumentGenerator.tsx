import React, { useState } from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import { generateGroqDocument } from '../../services/groqService';

interface DocumentGeneratorProps {
  onDocumentGenerated: (sfdt: string) => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onDocumentGenerated }) => {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sfdtOutput, setSfdtOutput] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!docType || !userPrompt.trim()) return;
    setIsLoading(true);
    setSfdtOutput(null);

    try {
      const response = await generateGroqDocument({ docType, userPrompt });
      const sfdt = response.document;
      setSfdtOutput(JSON.stringify(sfdt, null, 2));
      onDocumentGenerated(sfdt);
    } catch (err) {
      alert('Failed to generate document. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden h-full bg-white shadow-md rounded-xl p-6 space-y-6">
        <header className="border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            📄 Document Composer
          </h1>
          <p className="text-gray-500 text-sm">Generate AI-powered legal documents</p>
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
{/* 
        {sfdtOutput && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 font-medium">SFDT Output (for debugging)</p>
            <pre className="text-xs bg-gray-100 p-4 rounded max-h-[300px] overflow-auto whitespace-pre-wrap">
              {sfdtOutput}
            </pre>
          </div>
        )} */}
      </div>
    </>
  );
};

export default DocumentGenerator;
