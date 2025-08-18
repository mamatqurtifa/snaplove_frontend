import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import TrendingFrames from "@/components/TrendingFrames";
import UploadFrameCTA from "@/components/UploadFrameCTA";

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