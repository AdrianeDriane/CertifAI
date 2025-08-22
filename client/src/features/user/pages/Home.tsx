import { type JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentTitleModal from "../../../components/modals/DocumentTitleModal";
import { createDocument } from "../../../services/documentService";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { logout } = useAuth();
  const { success, error } = useToast();

  const handleUploadDocument = () => {
    setIsModalOpen(true);
  };

  const handleCreateDocument = async (title: string) => {
    setIsCreating(true);

    try {
      const newDocument = await createDocument({ title });

      navigate(`/document-editor/${newDocument._id}`, {
        replace: true,
        state: {
          documentId: newDocument._id,
          documentTitle: newDocument.title,
        },
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create document:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create document. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate("/", { replace: true });
      success("Logged out successfully.");
    } catch (err) {
      console.error("Logout error:", err);
      error("Error logout.");
      navigate("/", { replace: true });
    }
  };

  const handleCloseModal = () => {
    if (!isCreating) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white px-4 py-20 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-3xl text-center space-y-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">Certifai</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-500">
            Your trusted platform for managing verifiable and secure documents
            using blockchain and AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleUploadDocument}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-200"
            >
              Upload Document
            </button>
            <button
              onClick={() => {
                navigate("/documents");
              }}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
            >
              My Documents
            </button>
          </div>

          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="pt-10 text-sm text-gray-400">
            Secured with Polygon • Stored on IPFS • AI-Powered Validations
          </div>
        </div>
      </div>

      <DocumentTitleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateDocument}
        isLoading={isCreating}
      />
    </>
  );
}
