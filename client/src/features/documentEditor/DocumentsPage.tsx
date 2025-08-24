import { useEffect, useState } from "react";
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
  Home,
  FileIcon,
  Settings,
  Bell,
  Users,
  ChevronLeft,
  X,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { getFingerprint } from "../../utils/getFingerprint";
import { useNavigate } from "react-router-dom";
import certifai_logo_no_text from "../../assets/certifai-logo-no-text.svg";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import DocumentTitleModal from "../../components/modals/DocumentTitleModal";
import { createDocument } from "../../services/documentService";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // New Document Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { success, error: errorToast } = useToast();

  // Fetch documents from API
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

  useEffect(() => {
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

  // New Document functionality
  const handleNewDocument = () => {
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
      success("Document created successfully!");

      // Refresh the documents list
      fetchDocuments();
    } catch (error) {
      console.error("Failed to create document:", error);
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to create document. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    if (!isCreating) {
      setIsModalOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate("/", { replace: true });
      success("Logged out successfully.");
    } catch (err) {
      console.error("Logout error:", err);
      errorToast("Error logging out.");
      navigate("/", { replace: true });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-[#d0f600] text-[#000002] border border-[#000002]/10";
      case "signed":
        return "bg-[#aa6bfe]/20 text-[#aa6bfe] border border-[#aa6bfe]/30";
      case "archived":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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
      try {
        const sfdtData =
          typeof currentVersion.sfdt === "string"
            ? JSON.parse(currentVersion.sfdt)
            : currentVersion.sfdt;
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success("Copied to clipboard!");
    } catch {
      errorToast("Failed to copy to clipboard.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-[#eeebf0]">
        <div
          className={`flex-1 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          } transition-all duration-300 p-8`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-[#aa6bfe]/20 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-sm p-6 border border-[#aa6bfe]/10"
                  >
                    <div className="h-4 bg-[#aa6bfe]/20 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-[#d0f600]/30 rounded-full w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-[#eeebf0]">
        <div
          className={`bg-[#000002] text-white h-screen ${
            sidebarCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 fixed`}
        >
          <div className="p-4 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-full flex items-center">
                  <img
                    src={certifai_logo_no_text}
                    alt="Logo Text"
                    className="h-10 w-full object-fill"
                  />
                </div>
                <span className="text-white font-bold text-xl">CertifAI</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-full flex items-center justify-center cursor-pointer">
                <img
                  src={certifai_logo_no_text}
                  alt="Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`flex-1 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          } transition-all duration-300 p-8`}
        >
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-red-100">
              <div className="text-red-500 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-[#000002] mb-2">
                Error Loading Documents
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#aa6bfe] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Navigation items
  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      active: false,
    },
    {
      icon: <FileIcon size={20} />,
      label: "Documents",
      active: true,
    },
    {
      icon: <Users size={20} />,
      label: "Shared",
      active: false,
    },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      active: false,
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      active: false,
    },
  ];

  return (
    <>
      <div className="flex h-screen bg-[#eeebf0]">
        {/* Sidebar */}
        <div
          className={`bg-[#000002] text-white h-screen ${
            sidebarCollapsed ? "w-16" : "w-64"
          } transition-all duration-300 fixed`}
        >
          {/* Sidebar header */}
          <div className="p-4 px-3 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-full flex items-center">
                  <img
                    src={certifai_logo_no_text}
                    alt="Logo Text"
                    className="h-10 w-full object-fill"
                  />
                </div>
                <span className="text-white font-bold text-xl">CertifAI</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div
                className="w-full flex cursor-pointer items-center"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <img
                  src={certifai_logo_no_text}
                  alt="Logo Text"
                  className="h-10 w-10 object-contain"
                />
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-300 hover:text-white"
            >
              {!sidebarCollapsed && <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-8">
            <ul className="space-y-2 px-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      item.active
                        ? "bg-[#aa6bfe] text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          {!sidebarCollapsed && (
            <div
              onClick={handleLogout}
              className="absolute bottom-8 left-0 right-0 px-4"
            >
              <button className="w-full bg-[#d0f600] text-[#000002] font-medium py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                <LogOut size={20} /> Logout
              </button>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="absolute bottom-8 left-0 right-0 px-3">
              <button
                onClick={handleLogout}
                className="w-full h-10 aspect-square bg-[#d0f600] text-[#000002] font-medium rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          className={`flex-1 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          } transition-all duration-300 p-8`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div className="text-left">
                <h1 className="text-3xl font-bold text-[#000002] mb-2">
                  Documents
                </h1>
                <p className="text-gray-600">
                  Manage your documents, track versions, and collaborate
                  securely
                </p>
              </div>
              <button
                onClick={handleNewDocument}
                className="bg-[#aa6bfe] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors flex items-center gap-2 mt-4 sm:mt-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Document
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-[#aa6bfe]/10">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#eeebf0]/50 border border-[#aa6bfe]/10 rounded-xl focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe] focus:outline-none"
                  />
                </div>
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-colors ${
                    showFilters
                      ? "bg-[#aa6bfe] text-white"
                      : "border border-[#aa6bfe]/20 text-[#000002] hover:bg-[#aa6bfe]/10"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {showFilters && <X className="w-4 h-4 ml-2" />}
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#aa6bfe]/10">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-[#eeebf0]/50 border border-[#aa6bfe]/10 rounded-xl focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe] focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="signed">Signed</option>
                    <option value="archived">Archived</option>
                  </select>
                  <select
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value)}
                    className="px-4 py-3 bg-[#eeebf0]/50 border border-[#aa6bfe]/10 rounded-xl focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe] focus:outline-none"
                  >
                    <option value="all">All Visibility</option>
                    <option value="private">Private</option>
                    <option value="org">Organization</option>
                    <option value="public">Public</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-[#eeebf0]/50 border border-[#aa6bfe]/10 rounded-xl focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe] focus:outline-none"
                  >
                    <option value="updatedAt">Last Modified</option>
                    <option value="createdAt">Date Created</option>
                    <option value="title">Title</option>
                    <option value="currentVersion">Version</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "asc" | "desc")
                    }
                    className="px-4 py-3 bg-[#eeebf0]/50 border border-[#aa6bfe]/10 rounded-xl focus:ring-2 focus:ring-[#aa6bfe]/30 focus:border-[#aa6bfe] focus:outline-none"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              )}
            </div>

            {/* Documents Grid */}
            {filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-[#aa6bfe]/10">
                <div className="w-16 h-16 bg-[#eeebf0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-[#aa6bfe]" />
                </div>
                <h3 className="text-xl font-medium text-[#000002] mb-3">
                  {documents.length === 0
                    ? "No documents yet"
                    : "No documents match your filters"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {documents.length === 0
                    ? "Create your first document to get started with CertifAI's secure blockchain verification"
                    : "Try adjusting your search or filter criteria to find what you're looking for"}
                </p>
                {documents.length === 0 && (
                  <button
                    onClick={handleNewDocument}
                    className="bg-[#d0f600] text-[#000002] px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors font-medium shadow-sm"
                  >
                    Create Document
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 group border border-[#aa6bfe]/10 hover:border-[#aa6bfe]/30 relative overflow-hidden"
                  >
                    {/* Geometric accent */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#d0f600]/10 rounded-full"></div>
                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#aa6bfe]/10 rounded-full"></div>

                    {/* Document Header */}
                    <div className="flex items-start justify-between mb-4 relative">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#eeebf0] rounded-xl">
                          <FileText className="w-5 h-5 text-[#aa6bfe]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#000002] group-hover:text-[#aa6bfe] text-left transition-colors cursor-pointer">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-left text-gray-500">
                            Version {doc.currentVersion}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-2 rounded-full hover:bg-[#eeebf0] opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="mb-5">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {getDocumentPreview(doc)}
                      </p>
                    </div>

                    {/* Status and Visibility */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                          doc.status
                        )}`}
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        {getVisibilityIcon(doc.visibility)}
                        <span className="text-xs capitalize">
                          {doc.visibility}
                        </span>
                      </div>
                    </div>

                    {/* Document Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
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
                        className="flex-1 bg-[#aa6bfe] text-white py-2 px-3 rounded-xl text-sm hover:bg-opacity-90 transition-colors flex items-center justify-center gap-1 shadow-sm"
                        onClick={() => {
                          navigate(`/document-editor/${doc._id}`);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                        Open
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/document-editor/${doc._id}`);
                        }}
                        className="p-2 border border-[#aa6bfe]/20 rounded-xl hover:bg-[#eeebf0] transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-[#000002]" />
                      </button>
                      <button
                        className="p-2 border border-[#aa6bfe]/20 rounded-xl hover:bg-[#eeebf0] transition-colors"
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/document/${doc._id}`
                          )
                        }
                      >
                        <Share2 className="w-3 h-3 text-[#000002]" />
                      </button>
                      <button className="p-2 border border-[#aa6bfe]/20 rounded-xl hover:bg-[#eeebf0] transition-colors">
                        <Download className="w-3 h-3 text-[#000002]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Summary */}
            {filteredDocuments.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-600">
                Showing {filteredDocuments.length} of {documents.length}{" "}
                documents
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Title Modal */}
      <DocumentTitleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateDocument}
        isLoading={isCreating}
      />
    </>
  );
}

export default DocumentsPage;
