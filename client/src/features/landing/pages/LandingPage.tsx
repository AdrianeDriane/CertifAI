import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Benefits } from "../components/Benefits";
import { VerificationProcess } from "../components/VerificationProcess";
import { CallToAction } from "../components/CallToAction";
import { Footer } from "../components/Footer";
export function LandingPage() {
  return (
    <div className="bg-[#eeebf0] min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Benefits />
        <VerificationProcess />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
