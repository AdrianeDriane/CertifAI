import { ShieldX, ArrowLeft, Home, Mail } from "lucide-react";

export default function Error403Page() {
  return (
    <div className="min-h-screen bg-[#eeebf0] relative overflow-hidden">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#000002] rounded-md flex items-center justify-center">
              <div className="h-4 w-4 bg-[#d0f600] rounded-sm"></div>
            </div>
            <span className="text-[#000002] font-bold text-xl">CertifAI</span>
          </div>
        </div>
      </header>

      {/* Main Error Content */}
      <section className="py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Error Illustration */}
            <div className="lg:w-1/2 relative">
              <div className="bg-[#000002] rounded-2xl p-8 max-w-lg mx-auto relative z-10">
                {/* Mock Document with Lock Icon */}
                <div className="bg-white bg-opacity-10 p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-[#aa6bfe] rounded-lg flex items-center justify-center">
                      <ShieldX className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ACCESS DENIED
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-white bg-opacity-20 rounded-full w-full"></div>
                    <div className="h-3 bg-white bg-opacity-20 rounded-full w-3/4"></div>
                    <div className="h-3 bg-white bg-opacity-20 rounded-full w-5/6"></div>
                    <div className="h-3 bg-white bg-opacity-20 rounded-full w-1/2"></div>
                  </div>
                </div>

                {/* Error Code Display */}
                <div className="bg-[#aa6bfe] bg-opacity-20 p-6 rounded-xl text-center">
                  <div className="text-6xl font-bold text-[#d0f600] mb-2">
                    403
                  </div>
                  <div className="text-white text-sm opacity-80">
                    ERROR CODE
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/4 -left-8 h-20 w-20 bg-[#d0f600] rounded-full opacity-70 z-0"></div>
              <div className="absolute -bottom-10 right-1/4 h-24 w-24 bg-[#aa6bfe] rounded-full opacity-50 z-0"></div>
              <div className="absolute top-1/2 -right-6 h-16 w-16 bg-red-400 rounded-md opacity-60 z-0"></div>
            </div>

            {/* Right Side - Error Message */}
            <div className="lg:w-1/2">
              <div className="max-w-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-[#000002] mb-6">
                  Access <span className="text-red-500">Denied</span>
                </h1>

                <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-red-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 rounded-full p-3">
                      <ShieldX className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#000002] mb-2">
                        You are not authorized to access this document
                      </h2>
                      <p className="text-gray-700 mb-4">
                        This document is protected and requires proper
                        authentication or permissions. You may not have the
                        necessary access rights to view this content.
                      </p>
                      <div className="bg-[#eeebf0] rounded-lg p-4">
                        <p className="text-sm text-gray-600">
                          <strong>Error Code:</strong> 403 - Forbidden
                          <br />
                          <strong>Document Status:</strong> Access Restricted
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-[#aa6bfe] rounded-full mt-2"></div>
                    <p className="text-gray-700">
                      Contact the document owner to request access permissions
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-[#aa6bfe] rounded-full mt-2"></div>
                    <p className="text-gray-700">
                      Verify you're logged in with the correct account
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-[#aa6bfe] rounded-full mt-2"></div>
                    <p className="text-gray-700">
                      Check if your account has the required verification level
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-[#000002] text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center justify-center">
                    <ArrowLeft size={18} className="mr-2" />
                    Go Back
                  </button>
                  <button className="border-2 border-[#000002] text-[#000002] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center justify-center">
                    <Home size={18} className="mr-2" />
                    Home Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 h-40 w-40 bg-[#aa6bfe] rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 h-60 w-60 bg-[#d0f600] rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-red-400 rounded-full filter blur-3xl opacity-5"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle, #aa6bfe 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#000002] mb-4">
              Need Help Getting Access?
            </h2>
            <p className="text-gray-600 mb-8">
              If you believe this is an error or need assistance accessing this
              document, our support team is here to help you resolve the issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#d0f600] text-[#000002] px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center justify-center">
                <Mail size={18} className="mr-2" />
                Contact Support
              </button>
              <button className="border-2 border-[#aa6bfe] text-[#aa6bfe] px-8 py-3 rounded-full font-medium hover:bg-[#aa6bfe] hover:bg-opacity-10 transition-all">
                Request Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#eeebf0] py-8 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-6 w-6 bg-[#000002] rounded-md flex items-center justify-center">
                <div className="h-3 w-3 bg-[#d0f600] rounded-sm"></div>
              </div>
              <span className="text-[#000002] font-bold text-lg">CertifAI</span>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CertifAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
