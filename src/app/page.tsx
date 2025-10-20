import { Navbar } from "@/components/navbar";
import ContactSection from "@/components/sections/contact";
import FooterSection from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero";
import ServicesSection from "@/components/sections/services";
import TestimonialsSection from "@/components/sections/testimonials";
import ValuesSection from "@/components/sections/values";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <HeroSection />

      <section id="servizi">
        <ServicesSection />
      </section>

      <section id="valori">
        <ValuesSection />
      </section>

      <TestimonialsSection />

      <ContactSection />

      <FooterSection />
    </div>
  );
}
