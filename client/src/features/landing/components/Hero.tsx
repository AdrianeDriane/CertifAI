import { ArrowRight } from "lucide-react";
export const Hero = () => {
  return (
    <section className="relative py-20 px-6 md:px-12 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 z-10 text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#000002] leading-tight mb-6">
              AI-Powered Document{" "}
              <span className="text-[#aa6bfe]">Security</span> &{" "}
              <span className="text-[#d0f600]">Authentication</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
              CertifAI ensures authenticity, trust, and efficiency in digital
              agreements using blockchain technology and artificial
              intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#000002] text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center justify-center">
                Get Started
                <ArrowRight size={18} className="ml-2" />
              </button>
              <button className="border-2 border-[#000002] text-[#000002] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
            <div className="relative z-10">
              <div className="bg-[#000002] p-6 rounded-2xl shadow-xl max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#d0f600]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#aa6bfe]"></div>
                    <div className="h-3 w-3 rounded-full bg-white opacity-50"></div>
                  </div>
                  <div className="text-white text-xs">VERIFIED DOCUMENT</div>
                </div>
                <div className="bg-white bg-opacity-10 p-4 rounded-lg mb-4">
                  <div className="h-12 w-12 bg-[#aa6bfe] rounded-md mb-3 flex items-center justify-center">
                    <div className="h-6 w-6 bg-[#d0f600] rounded-sm"></div>
                  </div>
                  <div className="h-2 bg-white bg-opacity-20 rounded-full w-3/4 mb-2"></div>
                  <div className="h-2 bg-white bg-opacity-20 rounded-full w-1/2 mb-2"></div>
                  <div className="h-2 bg-white bg-opacity-20 rounded-full w-5/6"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-[#aa6bfe] rounded-full"></div>
                    <div>
                      <div className="h-2 bg-white bg-opacity-20 rounded-full w-16 mb-1"></div>
                      <div className="h-2 bg-white bg-opacity-20 rounded-full w-12"></div>
                    </div>
                  </div>
                  <div className="bg-[#d0f600] text-[#000002] px-3 py-1 rounded-full text-xs font-bold">
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-1/4 right-1/4 h-16 w-16 bg-[#d0f600] rounded-md opacity-70 animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/3 h-10 w-10 bg-[#aa6bfe] rounded-full opacity-60"></div>
            <div className="absolute top-1/2 right-1/2 h-8 w-8 bg-[#aa6bfe] rounded-md opacity-40"></div>
            <div className="absolute bottom-1/4 right-1/3 h-12 w-12 bg-[#d0f600] rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 h-64 w-64 bg-[#aa6bfe] rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-10 left-10 h-40 w-40 bg-[#d0f600] rounded-full filter blur-3xl opacity-10"></div>
    </section>
  );
};
