"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiHeart, FiShare2 } from "react-icons/fi";

const Hero = () => {
  const heroRef = useRef(null);

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
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-white to-[#FFF8F8]"
    >
      <div className="container-custom py-12 z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Share Your <span className="text-[#FF9898] relative">
                Special Moments
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path 
                    d="M0,5 Q50,15 100,5 V15 H0 Z" 
                    fill="#FFE99A" 
                  />
                </svg>
              </span> With Loved Ones
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              SnapLove helps you capture, share and preserve your most precious memories with the people who matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex items-center justify-center gap-2 group">
                Get Started 
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                href="/explore" 
                className="btn-outline flex items-center justify-center gap-2"
              >
                <FiCamera /> Explore Gallery
              </Link>
            </div>
            
            <div className="mt-12 flex items-center">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <div className={`w-full h-full bg-[#FF${9-i}898]`}></div>
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="font-semibold">Join 10k+ users</p>
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs font-medium">5.0</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 opacity-0 translate-y-10 transition-all duration-1000 delay-300 animate-on-scroll">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FFE99A] rounded-full opacity-50 blur-xl floating"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFAAAA] rounded-full opacity-50 blur-xl floating"></div>
              
              {/* Image */}
              <div className="relative z-10 rounded-xl shadow-2xl overflow-hidden pulsing">
                <Image
                  src="/images/assets/snaplove-banner.png"
                  alt="SnapLove Banner"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                
                {/* Floating action buttons */}
                <div className="absolute top-4 right-4 glass-effect p-2 rounded-full">
                  <FiShare2 className="text-[#FF9898]" />
                </div>
                
                <div className="absolute bottom-4 left-4 glass-effect p-3 rounded-xl flex items-center gap-2">
                  <FiHeart className="text-[#FF9898]" />
                  <span className="text-sm font-semibold">1.2k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background shapes */}
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#FFD586] rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#FF9898] rounded-full opacity-20 blur-2xl"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-80 animate-bounce">
        <span className="text-sm font-medium mb-2">Scroll down</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;