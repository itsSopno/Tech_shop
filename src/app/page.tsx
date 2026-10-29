
// import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
// import CategorySection from "@/components/CategorySection/CategorySection";
import KeycapsSection from "@/components/KeycapsSection/KeycapsSection";
// import TestiMonial from '@/components/Testimonial/Testimonial'
import TechPartners from "@/components/Pertner/Partner";
import TopProducts from "@/components/TopProduct/product";
import AboutPage from "@/components/About/about";
import Footer from "@/components/Footer/Footer";
// import Collection from "@/components/Collection/collection"
import { auth } from "@/auth";
import HeroBento from "@/components/Hero/Hero";

export default async function Home() {
  const session = await auth();
  return (
    <>
    <HeroBento session={session} />
     
      {/* <Collection /> */}
      <KeycapsSection />
      {/* <TopProducts></TopProducts> */}
      {/* <TestiMonial></TestiMonial> */}
      <AboutPage></AboutPage>
      <TechPartners />
      <Footer />
      {/* <TechShowcase /> */}
      {/* <TestimonialSection /> */}
    </>
  );
}
