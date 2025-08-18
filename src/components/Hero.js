import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiDownload, FiShare2, FiHeart } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-br from-white via-[#FFF8F8] to-white relative">
      {/* Decorative elements */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#FFE99A] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-[#FFAAAA] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-[#FFD586] rounded-full opacity-20 blur-3xl"></div>
      
      {/* Small decorative circles */}
      <div className="absolute top-32 left-1/4 w-6 h-6 bg-[#FFE99A] rounded-full floating"></div>
      <div className="absolute top-64 right-1/4 w-8 h-8 bg-[#FF9898] rounded-full floating" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/3 w-10 h-10 bg-[#FFD586] rounded-full floating" style={{animationDelay: '2s'}}></div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-8 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6">
          <div className="w-full md:w-1/2 fade-in" style={{animationDelay: '0.2s'}}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create Beautiful <span className="text-[#FF9898]">Photo Frames</span> to Share Moments
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              SnapLove helps you design, share and use stunning photo frames for your special moments, just like a personalized photobooth.
            </p>
            
            {/* Features preview */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="bg-[#FFE99A] p-2 rounded-full">
                  <FiCamera className="text-xl" />
                </div>
                <span>Create Frames</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="bg-[#FFAAAA] p-2 rounded-full">
                  <FiShare2 className="text-xl" />
                </div>
                <span>Share Designs</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="bg-[#FFD586] p-2 rounded-full">
                  <FiDownload className="text-xl" />
                </div>
                <span>Download Photos</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex items-center justify-center gap-2 group">
                Get Started <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline flex items-center justify-center gap-2">
                Explore Frames
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 fade-in" style={{animationDelay: '0.4s'}}>
            <div className="relative">
              {/* Main image with decorative elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#FFE99A] rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#FFAAAA] rounded-full opacity-50 blur-xl"></div>
              
              <div className="relative p-2 bg-white rounded-3xl shadow-lg pulse">
                <Image
                  src="/images/assets/snaplove-banner.png"
                  alt="SnapLove Banner"
                  width={600}
                  height={400}
                  className="relative z-10 rounded-2xl"
                />
                
                {/* Floating elements around the image */}
                <div className="absolute -top-8 right-12 p-2 bg-white rounded-xl shadow-md floating z-20">
                  <div className="bg-[#FF9898]/20 p-3 rounded-lg">
                    <FiHeart className="text-xl text-[#FF9898]" />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-10 p-2 bg-white rounded-xl shadow-md floating z-20" style={{animationDelay: '1s'}}>
                  <div className="bg-[#FFE99A]/20 p-3 rounded-lg">
                    <FiCamera className="text-xl text-[#FFD586]" />
                  </div>
                </div>
              </div>
              
              {/* Stats floating element */}
              <div className="absolute -right-4 bottom-20 bg-white p-4 rounded-2xl shadow-lg floating z-20" style={{animationDelay: '1.5s'}}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-[#FF9898]">500+</span>
                  <span className="text-xs text-gray-600">Frame Templates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;