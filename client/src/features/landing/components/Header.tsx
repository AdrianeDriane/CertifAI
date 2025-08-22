import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="bg-[#eeebf0] py-4 px-6 md:px-12 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#000002] rounded-md flex items-center justify-center">
              <div className="h-4 w-4 bg-[#d0f600] rounded-sm"></div>
            </div>
            <span className="text-[#000002] font-bold text-xl">CertifAI</span>
          </div>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-[#000002] font-medium hover:text-[#aa6bfe] transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-[#000002] font-medium hover:text-[#aa6bfe] transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-[#000002] font-medium hover:text-[#aa6bfe] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#"
            className="text-[#000002] font-medium hover:text-[#aa6bfe] transition-colors"
          >
            About
          </a>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search size={20} className="text-[#000002]" />
          </button>
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-[#000002] text-white px-6 py-2 rounded-full hover:bg-opacity-80 transition-all"
          >
            Sign In
          </button>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#eeebf0] shadow-md p-4">
          <nav className="flex flex-col space-y-4">
            <a
              href="#"
              className="text-[#000002] font-medium p-2 hover:bg-gray-100 rounded"
            >
              Home
            </a>
            <a
              href="#"
              className="text-[#000002] font-medium p-2 hover:bg-gray-100 rounded"
            >
              Features
            </a>
            <a
              href="#"
              className="text-[#000002] font-medium p-2 hover:bg-gray-100 rounded"
            >
              How It Works
            </a>
            <a
              href="#"
              className="text-[#000002] font-medium p-2 hover:bg-gray-100 rounded"
            >
              About
            </a>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-[#000002] text-white p-2 rounded-full hover:bg-opacity-80 transition-all"
            >
              Sign In
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
