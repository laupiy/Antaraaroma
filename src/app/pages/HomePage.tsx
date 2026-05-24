import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Products } from "../components/Products";
import { Catalog } from "../components/Catalog";
import { DistributionArea } from "../components/DistributionArea";
import { Advantages } from "../components/Advantages";
import { Testimonials } from "../components/Testimonials";
import { WhatsAppCTA } from "../components/WhatsAppCTA";
import { Contact } from "../components/Contact";

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Products />
      <Catalog />
      <DistributionArea />
      <Advantages />
      <Testimonials />
      <WhatsAppCTA />
      <Contact />
    </>
  );
}