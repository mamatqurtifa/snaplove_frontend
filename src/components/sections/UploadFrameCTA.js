"use client";
import { useEffect } from "react";
import Image from "next/image";
import { FiUpload, FiLayout, FiShare2, FiAward } from "react-icons/fi";

const UploadFrameCTA = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <section className="section-padding bg-gradient-to-br from-[#FFF8F8] to-white relative overflow-hidden">
      {/* Decorative elements - lower z-index */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-[#FFE99A]/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-[#C9A7FF]/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container-custom relative z-10">
        <div className="glass-effect relative">
          {/* Background decorative elements - behind content */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#FFE99A] rounded-full opacity-70 floating -z-10"></div>
          <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-[#FF9898] rounded-full opacity-70 pulsing -z-10"></div>
          
          <div className="flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 relative z-20">
            <div className="w-full md:w-1/2 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Become a <span className="text-[#FF9898]">Frame Creator</span> Today
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Share your creativity with the world! Upload your own frame designs and earn rewards when others use them.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-[#FFE99A] p-3 rounded-full">
                    <FiUpload className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Easy Upload</h3>
                    <p className="text-gray-600">Upload your design in just a few clicks</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#C9A7FF] p-3 rounded-full">
                    <FiShare2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Share Globally</h3>
                    <p className="text-gray-600">Reach users from around the world</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#A8EECC] p-3 rounded-full">
                    <FiLayout className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Creator Tools</h3>
                    <p className="text-gray-600">Access to design templates and tools</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#FF9898] p-3 rounded-full">
                    <FiAward className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Earn Rewards</h3>
                    <p className="text-gray-600">Get rewards when your frames are used</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary flex items-center justify-center gap-2">
                  <FiUpload className="h-5 w-5" /> Upload Your Frame
                </button>
                <button className="btn-outline flex items-center justify-center gap-2">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 opacity-0 translate-y-10 transition-all duration-1000 delay-300 animate-on-scroll">
              <div className="relative min-h-[400px]">
                {/* Main illustration with proper z-index */}
                <div className="relative z-30 floating">
                  <Image
                    src="/images/frame-creator-illustration.png"
                    alt="Frame creator illustration"
                    width={500}
                    height={400}
                    className="rounded-3xl w-full h-auto"
                  />
                </div>
                
                {/* Floating cards with higher z-index to appear above the image */}
                <div className="absolute top-4 -right-4 transform z-40 wobbling">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src="/images/avatars/avatar-7.jpg"
                          alt="Creator avatar"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold">@designlover</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="text-xs text-yellow-500">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">5,000+ frames downloaded</p>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 transform z-40 floating" style={{animationDelay: '0.5s'}}>
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <p className="text-sm font-bold mb-1">Top Creator Award 🏆</p>
                    <p className="text-xs text-gray-600">Congratulations!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadFrameCTA;