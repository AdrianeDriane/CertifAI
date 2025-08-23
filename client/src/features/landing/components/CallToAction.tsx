import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 md:px-12 bg-[#000002] relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Documents with{" "}
            <span className="text-[#d0f600]">CertifAI</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            CertifAI makes document security and verification simple, reliable,
            and trusted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                navigate("/register");
              }}
              className="bg-[#d0f600] text-[#000002] px-8 py-4 rounded-full font-medium hover:bg-opacity-90 transition-all flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight size={18} className="ml-2" />
            </button>
            <button
              onClick={() => {
                navigate("/register");
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 h-40 w-40 bg-[#aa6bfe] rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-10 right-10 h-60 w-60 bg-[#d0f600] rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-[#aa6bfe] rounded-full filter blur-3xl opacity-10"></div>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, #aa6bfe 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>
    </section>
  );
};
