import {
  FileUp,
  PenTool,
  Shield,
  Users,
  Cpu,
  ClipboardList,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <FileUp className="h-8 w-8 text-[#aa6bfe]" />,
      title: "Upload & Manage Documents",
      description:
        "Store files with metadata, version history, and immutable hashes for integrity.",
    },
    {
      icon: <PenTool className="h-8 w-8 text-[#aa6bfe]" />,
      title: "Digitally Sign Documents",
      description:
        "Securely add signatures, with every action logged and stored on the blockchain.",
    },
    {
      icon: <Shield className="h-8 w-8 text-[#aa6bfe]" />,
      title: "Blockchain Hash Recording",
      description:
        "Each document and signature generates a hash, permanently stored on Polygon.",
    },
    {
      icon: <Users className="h-8 w-8 text-[#aa6bfe]" />,
      title: "Access Control & Permissions",
      description:
        "Secure user management with customizable role-based access and permission controls.",
    },
    {
      icon: <Cpu className="h-8 w-8 text-[#aa6bfe]" />,
      title: "AI-Assisted Drafting",
      description:
        "AI-generated drafts, clauses, and templates for legally-sound documents.",
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-[#aa6bfe]" />,
      title: "Activity Log / Audit Trail",
      description:
        "Transparent timeline showing all document actions with blockchain proofs.",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-white" id="features">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#000002] mb-4">
            Powerful Features for{" "}
            <span className="text-[#aa6bfe]">Document Security</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            CertifAI combines the power of artificial intelligence and
            blockchain technology to provide a comprehensive document management
            solution.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#eeebf0] text-left p-8 rounded-2xl hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] border border-transparent hover:border-[#aa6bfe] hover:border-opacity-20"
            >
              <div className="bg-white rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#000002] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
