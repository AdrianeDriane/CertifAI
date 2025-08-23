import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  LayoutTemplate,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoIcon from "../../assets/logoIcon.svg";
import logoText from "../../assets/logoText.svg";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

interface SidebarProps {
  active: string;
  setActive: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      navigate("/", { replace: true });
      success("Logged out successfully.");
    } catch (err) {
      console.error("Logout error:", err);
      error("Error logging out.");
      navigate("/", { replace: true });
    }
  };

  // Config-driven menu items
  const menuItems = [
    {
      key: "documents",
      label: "Documents",
      icon: <FileText size={20} />,
      activeColor: "text-[#aa6bfe]",
      bg: "bg-[#aa6bfe]/10",
      hover: "hover:bg-[#aa6bfe]/10 hover:text-[#aa6bfe]",
    },
    {
      key: "templates",
      label: "Templates",
      icon: <LayoutTemplate size={20} />,
      activeColor: "text-[#7a9300]",
      bg: "bg-[#d0f600]/10",
      hover: "hover:bg-[#d0f600]/10 hover:text-[#7a9300]",
    },
  ];

  return (
    <div
      className={`relative flex flex-col h-screen max-h-screen overflow-hidden 
        border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isOpen ? "w-72" : "w-20"}`}
    >
      {/* Header with logo */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#aa6bfe]/20 to-[#d0f600]/20 relative rounded-br-2xl shadow">
        {isOpen ? (
          <div className="w-full flex items-center">
            <img
              src={logoText}
              alt="Logo Text"
              className="h-16 w-full object-fill"
            />
          </div>
        ) : (
          <img
            src={logoIcon}
            alt="Logo Icon"
            className="h-16 w-16 object-cover mx-auto"
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
          {menuItems.map(({ key, label, icon, activeColor, bg, hover }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all
                ${
                  active === key
                    ? `${bg} ${activeColor} font-semibold`
                    : `text-gray-700 ${hover}`
                }
                ${isOpen ? "justify-start" : "justify-center"}`}
            >
              {icon}
              {isOpen && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-gray-200">
          {isOpen ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-[#000002] text-white 
                         px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg"
            >
              <LogOut size={20} /> Logout
            </button>
          ) : (
            <button
              onClick={handleLogout}
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
  );
};

export default Sidebar;
