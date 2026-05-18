import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Products } from "../components/Products";
import { Catalog } from "../components/Catalog";
import { Advantages } from "../components/Advantages";
import { DistributionArea } from "../components/DistributionArea";
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
      <Advantages />
      <DistributionArea />
      <Testimonials />
      <WhatsAppCTA />
      <Contact />
    </>
  );
}
