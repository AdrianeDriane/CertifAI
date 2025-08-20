import { useEffect, useState } from "react";
import DocumentGenerator from "../features/documentGenerator/DocumentGenerator";
import DocEditor from "../features/documentEditor/DocEditor";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getFingerprint } from "../utils/getFingerprint";
import { getLatestSfdt } from "../utils/getLatestSfdt";

interface Version {
  version: number;
  sfdt: string;
}

export interface DocumentData {
  _id: string;
  title: string;
  status?: string;
  visibility?: "public" | "private";
  editors?: string[];
  createdBy?: string;
  versions: Version[];
}

const DocumentLayout = () => {
  document.getElementById('root')?.style.setProperty("max-width", "100%");
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [sfdtContent, setSfdtContent] = useState<string>("");
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      const token = localStorage.getItem("token");
      const fingerprint = await getFingerprint();
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/documents/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-device-fingerprint": fingerprint,
            },
          }
        );
        const doc: DocumentData = res.data;
        setDocumentData(doc);

        const latestSfdt = getLatestSfdt(doc);
        if (latestSfdt) {
          setSfdtContent(latestSfdt);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          navigate("/403");
        } else if (axios.isAxiosError(err) && err.response?.status === 404) {
          navigate("/404");
        } else {
          console.error("Unexpected error fetching document:", err);
        }
      }
    };

    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Editor Section */}
      <div className="flex-1 min-h-0 overflow-hidden border-b md:border-b-0 md:border-r border-gray-200">
        <DocEditor
          sfdt={sfdtContent}
          fileName={documentData?.title || "Untitled"}
          documentStatus={documentData?.status}
          visibility={documentData?.visibility || "private"}
          editors={documentData?.editors || []}
          createdBy={documentData?.createdBy}
        />
      </div>

      {/* Generator Sidebar */}
      <DocumentGenerator onDocumentGenerated={setSfdtContent} />
    </div>
  );
};

export default DocumentLayout;
