import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureModalProps {
  onConfirm: (signatureOptions: {
    dataUrl: string;
    width: number;
    height: number;
  }) => void;
  onCancel: () => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [signatureWidth, setSignatureWidth] = useState(120);
  const [signatureHeight, setSignatureHeight] = useState(60);

  const handleClear = () => {
    sigRef.current?.clear();
    setIsEmpty(true);
  };

  const handleConfirm = () => {
    if (sigRef.current && !isEmpty) {
      try {
        // Use the most reliable method to get canvas data
        const dataUrl = sigRef.current.toDataURL("image/png");

        if (dataUrl && dataUrl !== "data:," && !sigRef.current.isEmpty()) {
          const signatureOptions = {
            dataUrl,
            width: signatureWidth,
            height: signatureHeight,
          };
          onConfirm(signatureOptions);
        } else {
          alert("Please draw your signature before confirming.");
        }
      } catch (error) {
        console.error("Error processing signature:", error);
        alert("Error processing signature. Please try again.");
      }
    } else {
      alert("Please draw your signature before confirming.");
    }
  };

  const handleSignatureStart = () => {
    setIsEmpty(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    } else if (e.key === "Enter" && !isEmpty) {
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] max-w-[95vw] flex flex-col max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add Your Signature
        </h2>

        {/* Signature Canvas */}
        <div className="border-2 border-gray-300 rounded-md mb-4 p-2">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            backgroundColor="white"
            onBegin={handleSignatureStart}
            canvasProps={{
              width: 468,
              height: 180,
              style: {
                width: "100%",
                height: "180px",
              },
              className: "w-full cursor-crosshair rounded-md",
            }}
          />
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Draw your signature in the box above using your mouse or touch screen.
          Signatures will be placed behind text automatically.
        </p>

        {/* Size Controls */}
        <div className="space-y-4 mb-6">
          <h3 className="text-md font-medium text-gray-800">Signature Size</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (pixels)
              </label>
              <input
                type="number"
                value={signatureWidth}
                onChange={(e) =>
                  setSignatureWidth(
                    Math.max(50, parseInt(e.target.value) || 120)
                  )
                }
                min="50"
                max="400"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (pixels)
              </label>
              <input
                type="number"
                value={signatureHeight}
                onChange={(e) =>
                  setSignatureHeight(
                    Math.max(25, parseInt(e.target.value) || 60)
                  )
                }
                min="25"
                max="200"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Size Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Size Presets
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setSignatureWidth(80);
                  setSignatureHeight(40);
                }}
                className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Small (80×40)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignatureWidth(120);
                  setSignatureHeight(60);
                }}
                className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Medium (120×60)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignatureWidth(160);
                  setSignatureHeight(80);
                }}
                className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Large (160×80)
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isEmpty}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isEmpty
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Add Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
