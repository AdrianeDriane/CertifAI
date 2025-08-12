import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Calendar,
  User,
  Eye,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Share2,
  Lock,
  Edit3,
} from "lucide-react";
import axios from "axios";
import { getFingerprint } from "../../utils/getFingerprint";
import { useNavigate } from "react-router-dom";

interface IVersion {
  version: number;
  action: "uploaded" | "edited" | "signed" | "locked";
  sfdt: any;
  hash: string;
  blockchainTxHash: string;
  createdAt: string;
  modifiedBy: string;
}

interface IDocument {
  _id: string;
  title: string;
  type?: string;
  createdBy: string;
  currentVersion: number;
  status: "draft" | "signed" | "archived";
  visibility: "private" | "org" | "public";
  versions: IVersion[];
  createdAt: string;
  updatedAt: string;
}

function DocumentsPage() {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        const fingerprint = await getFingerprint();

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-device-fingerprint": fingerprint,
            },
          }
        );

        setDocuments(response.data.documents);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch documents"
          );
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filter and sort documents
  useEffect(() => {
    const filtered = documents.filter((doc) => {
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || doc.status === statusFilter;
      const matchesVisibility =
        visibilityFilter === "all" || doc.visibility === visibilityFilter;

      return matchesSearch && matchesStatus && matchesVisibility;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof IDocument];
      let bValue: any = b[sortBy as keyof IDocument];

      if (sortBy === "updatedAt" || sortBy === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDocuments(filtered);
  }, [
    documents,
    searchTerm,
    statusFilter,
    visibilityFilter,
    sortBy,
    sortOrder,
  ]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "signed":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "private":
        return <Lock className="w-4 h-4" />;
      case "org":
        return <User className="w-4 h-4" />;
      case "public":
        return <Eye className="w-4 h-4" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDocumentPreview = (doc: IDocument) => {
    const currentVersion = doc.versions.find(
      (v) => v.version === doc.currentVersion
    );
    if (currentVersion?.sfdt) {
      // Extract text content from SFDT (Syncfusion Document Format)
      // This is a simplified extraction - you might need more sophisticated parsing
      try {
        const sfdtData =
          typeof currentVersion.sfdt === "string"
            ? JSON.parse(currentVersion.sfdt)
            : currentVersion.sfdt;

        // Extract text from SFDT structure (simplified)
        let textContent = "";
        if (sfdtData.sections) {
          sfdtData.sections.forEach((section: any) => {
            if (section.blocks) {
              section.blocks.forEach((block: any) => {
                if (block.inlines) {
                  block.inlines.forEach((inline: any) => {
                    if (inline.text) {
                      textContent += inline.text + " ";
                    }
                  });
                }
              });
            }
          });
        }
        return (
          textContent.substring(0, 150) +
          (textContent.length > 150 ? "..." : "")
        );
      } catch (e) {
        console.log(e);
        return "No preview available";
      }
    }
    return "No content available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Documents
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
            <p className="text-gray-600">
              Manage your documents, track versions, and collaborate securely
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mt-4 sm:mt-0">
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="signed">Signed</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Visibility</option>
                <option value="private">Private</option>
                <option value="org">Organization</option>
                <option value="public">Public</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="updatedAt">Last Modified</option>
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="currentVersion">Version</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          )}
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documents.length === 0
                ? "No documents yet"
                : "No documents match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {documents.length === 0
                ? "Create your first document to get started"
                : "Try adjusting your search or filter criteria"}
            </p>
            {documents.length === 0 && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 group"
              >
                {/* Document Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Version {doc.currentVersion}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {getDocumentPreview(doc)}
                  </p>
                </div>

                {/* Status and Visibility */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                      doc.status
                    )}`}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>

                  <div className="flex items-center gap-1 text-gray-500">
                    {getVisibilityIcon(doc.visibility)}
                    <span className="text-xs capitalize">{doc.visibility}</span>
                  </div>
                </div>

                {/* Document Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(doc.updatedAt)}</span>
                  </div>
                  <div className="text-xs">
                    {doc.versions.length} version
                    {doc.versions.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                    onClick={() => {
                      navigate(`/document-editor/${doc._id}`);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                    Open
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <Edit3 className="w-3 h-3 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <Share2 className="w-3 h-3 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <Download className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredDocuments.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {filteredDocuments.length} of {documents.length} documents
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsPage;
