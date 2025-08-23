import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  LayoutTemplate,
} from "lucide-react";
import DocumentsPage from "../features/documentEditor/DocumentsPage";
import logoIcon from "../assets/logoIcon.svg";
import logoText from "../assets/logoText.svg";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("documents");

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div
        className={`relative flex flex-col h-screen max-h-screen overflow-hidden 
          border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isOpen ? "w-72" : "w-20"}`}
      >
        {/* Header with logo */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#aa6bfe]/20 to-[#d0f600]/20 relative rounded-br-2xl shadow">
          {/* Only show text logo when open */}
          {isOpen ? (
            <div className="w-full flex items-center">
              <img
                src={logoText}
                alt="Logo Text"
                className="h-16 w-full  object-fill" // ✅ preserves aspect ratio
              />
            </div>
          ) : (
            <img
              src={logoIcon}
              alt="Logo Icon"
              className="h-16 w-16 object-cover mx-auto" // ✅ clean square fit
            />
          )}

          {/* Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center 
                       w-8 h-8 rounded-full bg-white border shadow-md hover:bg-gray-100 transition"
            title={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 flex flex-col justify-between p-4 relative">
          {/* Menu */}
          <nav className="space-y-3">
            {/* Documents */}
            <button
              onClick={() => setActive("documents")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all
                ${
                  active === "documents"
                    ? "bg-[#aa6bfe]/10 text-[#aa6bfe] font-semibold"
                    : "text-gray-700 hover:bg-[#aa6bfe]/10 hover:text-[#aa6bfe]"
                } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <FileText size={20} />
              {isOpen && <span className="text-sm">Documents</span>}
            </button>

            {/* Templates */}
            <button
              onClick={() => setActive("templates")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all
                ${
                  active === "templates"
                    ? "bg-[#d0f600]/10 text-[#7a9300] font-semibold"
                    : "text-gray-700 hover:bg-[#d0f600]/10 hover:text-[#7a9300]"
                } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              <LayoutTemplate size={20} />
              {isOpen && <span className="text-sm">Templates</span>}
            </button>
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            {isOpen ? (
              <button
                onClick={() => alert("Logging out...")}
                className="w-full flex items-center justify-center gap-2 bg-[#000002] text-white 
                           px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg"
              >
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <button
                onClick={() => alert("Logging out...")}
                className="p-3 rounded-full bg-[#000002] text-white hover:bg-opacity-90 transition shadow-lg"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>

          {/* Decorative accents */}
          <div className="absolute bottom-24 left-4 h-16 w-16 bg-[#aa6bfe] rounded-full opacity-10 blur-2xl animate-pulse"></div>
          <div className="absolute top-20 right-2 h-12 w-12 bg-[#d0f600] rounded-md opacity-10 blur-2xl"></div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto relative">
        {active === "documents" && <DocumentsPage />}
        {active === "templates" && (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p className="text-lg">📑 Templates Section (Coming soon)</p>
          </div>
        )}

        {/* Background accents */}
        <div className="absolute top-10 right-10 h-40 w-40 bg-[#aa6bfe] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-10 left-20 h-32 w-32 bg-[#d0f600] rounded-full blur-3xl opacity-10"></div>
      </div>
    </div>
  );
};

export default MainLayout;
