// components/ActivityLogsModal.tsx
import React from "react";
import {
  Clock,
  User,
  FileCode2,
  Hash,
  Download,
  FileCheck,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ActivityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: any[];
  signedBy?: string[];
  fileName: string;
  onDownloadVersion: (log: any) => void;
}

export const ActivityLogsModal: React.FC<ActivityLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  signedBy,
  onDownloadVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-auto max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            📜 Activity Logs
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-6 overflow-hidden">
          <div className="w-64 border-r pr-4 flex-shrink-0 self-start">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <FileCheck size={14} />
              Signed By:
            </h4>

            {signedBy && signedBy.length > 0 ? (
              <div className="space-y-1">
                {signedBy.map((signer, signerIdx) => (
                  <div
                    key={signerIdx}
                    className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded"
                  >
                    <CheckCircle size={12} />
                    <span className="truncate" title={signer}>
                      {signer}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border-l-2 border-orange-200">
                <div className="flex items-start gap-1">
                  <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Any signature isn't valid because file was configured after
                    signature. User can attempt to sign again.
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 max-h-[70vh] overflow-y-auto pr-2">
            {logs.length > 0 ? (
              <ul className="space-y-4">
                {[...logs].reverse().map((log, idx) => (
                  <li
                    key={idx}
                    className="border rounded-xl bg-gray-50 p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
                          {log.action.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={14} />{" "}
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <User size={16} /> Modified By:{" "}
                        <span className="font-medium">
                          {log.emailModifiedBy}
                        </span>
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <FileCode2 size={16} /> Version:{" "}
                        <span className="font-medium">{log.version}</span>
                      </p>

                      {log.blockchainTxHash && (
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                          <Hash size={16} /> Blockchain Tx:{" "}
                          <a
                            href={`https://amoy.polygonscan.com/tx/${log.blockchainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {log.blockchainTxHash.slice(0, 10)}...
                          </a>
                        </p>
                      )}

                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <Hash size={16} /> Hash:{" "}
                        <span className="font-mono text-xs text-gray-600">
                          {log.hash}
                        </span>
                      </p>

                      <div className="mt-2 flex justify-start">
                        <button
                          onClick={() => onDownloadVersion(log)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
                        >
                          <Download size={14} />
                          Download Document
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No activity logs found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
