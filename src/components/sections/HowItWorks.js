"use client";
import { useEffect } from "react";
import Image from "next/image";
import { FiImage, FiCamera, FiShare2, FiDownload, FiArrowRight } from "react-icons/fi";

const HowItWorks = () => {
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

  const steps = [
    {
      icon: <FiImage className="h-8 w-8" />,
      title: "Choose Your Frame",
      description: "Browse and select from hundreds of beautiful frames created by our community.",
      color: "bg-[#FFE99A]",
      gradient: "from-[#FFE99A] via-[#FFD586] to-[#FFC947]",
      iconColor: "text-gray-700",
      delay: "delay-0",
      image: "/images/placeholder.svg",
      alt: "Choosing a frame",
      number: "01"
    },
    {
      icon: <FiCamera className="h-8 w-8" />,
      title: "Take a Photo",
      description: "Capture your perfect moment using our photobooth-style camera with real-time frame preview.",
      color: "bg-[#C9A7FF]",
      gradient: "from-[#C9A7FF] via-[#B794F6] to-[#9F7AEA]",
      iconColor: "text-gray-700",
      delay: "delay-200",
      image: "/images/placeholder.svg",
      alt: "Taking a photo",
      number: "02"
    },
    {
      icon: <FiShare2 className="h-8 w-8" />,
      title: "Share Your Best Pictures",
      description: "Download your framed photos and share your beautiful memories with friends and family.",
      color: "bg-[#FF9898]",
      gradient: "from-[#FF9898] via-[#FFAAAA] to-[#FF7979]",
      iconColor: "text-white",
      delay: "delay-400",
      image: "/images/placeholder.svg",
      alt: "Sharing pictures",
      number: "03"
    }
  ];

  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FFE99A]/30 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-[#C9A7FF]/20 rounded-full blur-3xl"></div>
      
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How <span className="text-[#FF9898] relative z-10">
              SnapLove
              <svg className="absolute bottom-1 left-0 w-full -z-10" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,5 Q50,15 100,5 V15 H0 Z" fill="rgba(255, 233, 154, 0.3)"/>
              </svg>
            </span> Works
          </h2>
          <p className="text-gray-600 text-lg">
            Getting started with SnapLove is easy. Follow these simple steps to create and share beautiful framed photos.
          </p>
        </div>

        <div className="relative">
          {/* Enhanced Connection line with animated gradient */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-2 transform -translate-y-1/2 z-0">
            <div className="w-full h-full bg-gradient-to-r from-[#FFE99A] via-[#C9A7FF] to-[#FF9898] rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 opacity-0 translate-y-10 transition-all duration-1000 ${step.delay} animate-on-scroll hover:shadow-2xl hover:-translate-y-4 group border border-white/50 overflow-hidden`}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-3xl`}></div>
                
                {/* Decorative corner elements */}
                <div className="absolute top-4 left-4 w-8 h-8 opacity-20">
                  <div className={`w-2 h-2 bg-gradient-to-r ${step.gradient} rounded-full animate-ping`}></div>
                  <div className={`w-1 h-1 bg-gradient-to-r ${step.gradient} rounded-full absolute top-1 left-1`}></div>
                </div>

                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Enhanced image container with better effects */}
                  <div className="mb-8 overflow-hidden rounded-2xl w-full h-48 relative group-hover:scale-105 transition-transform duration-500 shadow-lg">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay with gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  </div>

                  {/* Enhanced icon with multiple animation layers */}
                  <div className={`relative bg-gradient-to-br ${step.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${step.iconColor} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl`}>
                    {step.icon}
                    {/* Animated ring around icon */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white opacity-0 group-hover:opacity-50 scale-110 group-hover:scale-125 transition-all duration-500"></div>
                    {/* Pulse effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-30 animate-ping`}></div>
                  </div>

                  {/* Enhanced title with gradient text effect */}
                  <h3 className={`text-xl font-bold mb-4 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:${step.gradient} group-hover:bg-clip-text group-hover:text-transparent group-hover:scale-105`}>
                    {step.title}
                  </h3>

                  {/* Enhanced description */}
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Enhanced bottom elements */}
                  {index === steps.length - 1 ? (
                    <button className={`mt-8 bg-gradient-to-r ${step.gradient} text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 w-full group-hover:scale-105`}>
                      Try Now
                      <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                  ) : (
                    <div className="mt-8 h-12 flex items-center justify-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <FiArrowRight className="h-5 w-5 text-gray-700 md:rotate-0 rotate-90 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  )}

                  {/* Decorative bottom bar with animation */}
                  <div className={`w-16 h-1 bg-gradient-to-r ${step.gradient} rounded-full mx-auto mt-4 group-hover:w-24 transition-all duration-500 shadow-sm`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;