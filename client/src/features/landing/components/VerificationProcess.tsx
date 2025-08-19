import { FileUp, CheckCircle, Shield } from "lucide-react";
export const VerificationProcess = () => {
  const steps = [
    {
      icon: <FileUp className="h-8 w-8 text-white" />,
      title: "Upload Document",
      description:
        "Upload any document to the CertifAI platform for verification.",
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Blockchain Verification",
      description: "Our system checks the document against blockchain records.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Instant Results",
      description: "Receive immediate confirmation of document authenticity.",
    },
  ];
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#000002] mb-4">
            Document <span className="text-[#aa6bfe]">Verification</span>{" "}
            Process
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Verify the authenticity of any document in just three simple steps.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 max-w-xs mx-auto">
              <div className="flex flex-col items-center">
                <div className="bg-[#000002] rounded-full p-5 w-20 h-20 flex items-center justify-center mb-6 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#d0f600] flex items-center justify-center text-[#000002] font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#000002] mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block h-0.5 w-12 bg-gray-300 absolute top-1/2 transform translate-x-full"></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-16 bg-[#eeebf0] rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-[#000002] p-4 rounded-xl">
              <FileUp className="h-10 w-10 text-[#d0f600]" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-[#000002] mb-2">
                Try Document Verification Now
              </h3>
              <p className="text-gray-600">
                Drop your document here or click to upload
              </p>
            </div>
            <button className="bg-[#aa6bfe] text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all whitespace-nowrap">
              Upload File
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
