import { CheckCircle } from "lucide-react";
export const Benefits = () => {
  return (
    <section
      id="about"
      className="py-20 px-6 md:px-12 bg-[#eeebf0] relative overflow-hidden"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="bg-[#000002] rounded-2xl p-8 max-w-lg relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#aa6bfe] bg-opacity-20 p-6 rounded-xl">
                  <div className="h-12 w-12 bg-[#aa6bfe] rounded-lg mb-4 flex items-center justify-center">
                    <div className="h-6 w-6 bg-white rounded-sm"></div>
                  </div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full mb-2"></div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full w-3/4"></div>
                </div>
                <div className="bg-[#d0f600] bg-opacity-20 p-6 rounded-xl">
                  <div className="h-12 w-12 bg-[#d0f600] rounded-lg mb-4 flex items-center justify-center">
                    <div className="h-6 w-6 bg-[#000002] rounded-sm"></div>
                  </div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full mb-2"></div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full w-3/4"></div>
                </div>
                <div className="bg-white bg-opacity-10 p-6 rounded-xl col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-[#d0f600] rounded-full w-1/4"></div>
                    <div className="h-8 w-8 bg-[#aa6bfe] rounded-full"></div>
                  </div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full mb-2"></div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full mb-2"></div>
                  <div className="h-3 bg-white bg-opacity-30 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-8 h-20 w-20 bg-[#d0f600] rounded-full opacity-70 z-0"></div>
            <div className="absolute -bottom-10 right-1/4 h-24 w-24 bg-[#aa6bfe] rounded-full opacity-50 z-0"></div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000002] mb-6">
              Why <span className="text-[#aa6bfe]">CertifAI</span> Matters
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              CertifAI closes the trust loop by combining AI for efficiency and
              blockchain for immutable proof, making it easy for MSMEs,
              freelancers, and professionals to create, sign, and verify
              documents with confidence.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#d0f600] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-[#000002]">
                    Enhanced Trust
                  </h3>
                  <p className="text-gray-600">
                    Blockchain verification ensures documents cannot be tampered
                    with or forged.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#d0f600] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-[#000002]">
                    Increased Efficiency
                  </h3>
                  <p className="text-gray-600">
                    AI-powered drafting and templates save time and reduce
                    errors.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#d0f600] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-[#000002]">
                    Simplified Compliance
                  </h3>
                  <p className="text-gray-600">
                    Complete audit trails and verification processes ensure
                    regulatory compliance.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-[#d0f600] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-[#000002]">
                    Universal Accessibility
                  </h3>
                  <p className="text-gray-600">
                    Perfect for businesses of all sizes, from freelancers to
                    established enterprises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
