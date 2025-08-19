import { Twitter, Facebook, Instagram, Linkedin, Mail } from "lucide-react";
export const Footer = () => {
  return (
    <footer className="bg-[#eeebf0] py-12 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-[#000002] rounded-md flex items-center justify-center">
                <div className="h-4 w-4 bg-[#d0f600] rounded-sm"></div>
              </div>
              <span className="text-[#000002] font-bold text-xl">CertifAI</span>
            </div>
            <p className="text-gray-600 mb-4">
              AI-powered, blockchain-secured document platform that ensures
              authenticity, trust, and efficiency in digital agreements.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-[#aa6bfe]"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#aa6bfe]"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#aa6bfe]"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#aa6bfe]"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#000002]">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Integrations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#000002]">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#000002]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Webinars
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#aa6bfe]">
                  Blockchain
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CertifAI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-[#aa6bfe]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-[#aa6bfe]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-[#aa6bfe]"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
            <Mail size={16} className="text-[#aa6bfe] mr-2" />
            <span className="text-sm text-gray-600">
              Subscribe to our newsletter
            </span>
            <button className="ml-3 bg-[#000002] text-white text-xs px-3 py-1 rounded-full">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
