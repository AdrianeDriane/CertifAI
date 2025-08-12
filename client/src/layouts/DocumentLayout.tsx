import { useEffect, useState } from "react";
import DocumentGenerator from "../features/documentGenerator/DocumentGenerator";
import DocEditor from "../features/documentEditor/DocEditor";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getFingerprint } from "../utils/getFingerprint";

interface Version {
  version: number;
  sfdt: string;
}

interface DocumentData {
  _id: string;
  title: string;
  versions: Version[];
}

const DocumentLayout = () => {
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [sfdtContent, setSfdtContent] = useState<string>("");
  const { documentId } = useParams<{ documentId: string }>();

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

        if (doc.versions && doc.versions.length > 0) {
          const latestVersion = doc.versions.reduce((prev, curr) =>
            curr.version > prev.version ? curr : prev
          );
          setSfdtContent(latestVersion.sfdt);
        }
      } catch (err) {
        console.error("Error fetching document:", err);
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
        />
      </div>

      {/* Generator Sidebar */}
      <div className="w-full md:w-[320px] max-h-screen overflow-y-auto bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
        <div className="h-full p-4">
          <DocumentGenerator onDocumentGenerated={setSfdtContent} />
        </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
