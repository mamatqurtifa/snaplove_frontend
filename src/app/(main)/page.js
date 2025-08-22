import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import TrendingFrames from "@/components/sections/TrendingFrames";
import UploadFrameCTA from "@/components/sections/UploadFrameCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <TrendingFrames />
      <UploadFrameCTA />
    </>
  );
}