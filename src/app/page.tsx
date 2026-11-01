
import KeycapsSection from "@/components/KeycapsSection/KeycapsSection";
import AboutPage from "@/components/About/about";
import { auth } from "@/auth";
import HeroBento from "@/components/Hero/Hero";
import ProductShowcase from "@/components/GraphicsCard/ProductShowcase";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <HeroBento session={session} />
      <KeycapsSection />
      <ProductShowcase />
      <AboutPage></AboutPage>
      {/* <TechPartners /> */}
    
    </>
  );
}
