"use client";
import { useEffect } from "react";
import Image from "next/image";
import { FiImage, FiCamera, FiShare2, FiArrowDown, FiPlay, FiCheck } from "react-icons/fi";

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
      icon: <FiImage className="h-6 w-6" />,
      title: "Choose Your Frame",
      description: "Browse and select from hundreds of beautiful frames created by our community.",
      gradient: "from-[#FFE99A] via-[#FFD586] to-[#FFC947]",
      shadowColor: "shadow-[#FFE99A]/30",
      delay: "delay-0",
      image: "/images/how-it-works/step-1.png",
      alt: "Choosing a frame",
      number: "01",
      accentColor: "#FFE99A"
    },
    {
      icon: <FiCamera className="h-6 w-6" />,
      title: "Take a Photo",
      description: "Capture your perfect moment using our photobooth-style camera with real-time frame preview.",
      gradient: "from-[#C9A7FF] via-[#B794F6] to-[#9F7AEA]",
      shadowColor: "shadow-[#C9A7FF]/30",
      delay: "delay-200",
      image: "/images/how-it-works/step-2.png",
      alt: "Taking a photo",
      number: "02",
      accentColor: "#C9A7FF"
    },
    {
      icon: <FiShare2 className="h-6 w-6" />,
      title: "Share Your Best Pictures",
      description: "Download your framed photos and share your beautiful memories with friends and family.",
      gradient: "from-[#FF9898] via-[#FFAAAA] to-[#FF7979]",
      shadowColor: "shadow-[#FF9898]/30",
      delay: "delay-400",
      image: "/images/how-it-works/step-3.png",
      alt: "Sharing pictures",
      number: "03",
      accentColor: "#FF9898"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-[#F5F7FA] via-white to-[#F8F9FF] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#FFE99A]/50 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#C9A7FF]/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-[#FF9898]/60 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#A8EECC]/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 -left-8 w-16 h-16 border border-[#FFE99A]/20 rounded-2xl rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
      <div className="absolute bottom-1/4 -right-8 w-12 h-12 border border-[#C9A7FF]/20 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
      
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-20 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            How <span className="text-[#FF9898] relative">
              SnapLove
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0,8 Q100,18 200,8 V20 H0 Z" fill="#FFE99A" opacity="0.5" />
              </svg>
            </span> Works
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Getting started with SnapLove is easy. Follow these simple steps to create and share beautiful framed photos.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative">
          {/* Flowing connection path */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg viewBox="0 0 1200 800" className="w-full h-full">
              {/* Main flow path */}
              <path 
                d="M200,200 Q400,150 600,200 T1000,200" 
                stroke="url(#gradient1)" 
                strokeWidth="3" 
                fill="none" 
                strokeDasharray="10,5"
                className="animate-pulse"
              />
              
              {/* Branch paths for visual interest */}
              <path 
                d="M200,200 Q250,250 300,200" 
                stroke="url(#gradient2)" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.5"
              />
              <path 
                d="M600,200 Q650,150 700,200" 
                stroke="url(#gradient3)" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.5"
              />
              
              {/* Flowing dots */}
              <circle r="4" fill="#FFE99A" className="animate-pulse">
                <animateMotion dur="8s" repeatCount="indefinite">
                  <mpath xlinkHref="#mainPath"/>
                </animateMotion>
              </circle>
              <circle r="3" fill="#C9A7FF" className="animate-pulse">
                <animateMotion dur="8s" begin="2s" repeatCount="indefinite">
                  <mpath xlinkHref="#mainPath"/>
                </animateMotion>
              </circle>
              <circle r="3" fill="#FF9898" className="animate-pulse">
                <animateMotion dur="8s" begin="4s" repeatCount="indefinite">
                  <mpath xlinkHref="#mainPath"/>
                </animateMotion>
              </circle>
              
              {/* Hidden path for animation */}
              <path id="mainPath" d="M200,200 Q400,150 600,200 T1000,200" opacity="0"/>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFE99A" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#C9A7FF" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#FF9898" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFE99A" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#FFD586" stopOpacity="0.4"/>
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A7FF" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#FF9898" stopOpacity="0.4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative opacity-0 translate-y-10 transition-all duration-1000 ${step.delay} animate-on-scroll group`}
              >
                {/* Step connector */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className={`w-8 h-8 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg ${step.shadowColor} group-hover:scale-125 transition-all duration-300 rotate-180`}>
                      <FiArrowDown className="h-4 w-4 text-white transform rotate-90" />
                    </div>
                  </div>
                )}

                {/* Main card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border border-white/60 group">
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>

                  {/* Image section */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <Image
                      src={step.image}
                      alt={step.alt}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Floating play button */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                        <FiPlay className="h-5 w-5 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="p-6 relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-gray-900">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700">
                      {step.description}
                    </p>

                    {/* Action indicator */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className={`w-2 h-2 bg-gradient-to-r ${step.gradient} rounded-full animate-ping`}></div>
                      <span className="text-xs text-gray-500 font-medium">Step {step.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={index} className={`relative opacity-0 translate-y-10 transition-all duration-1000 ${step.delay} animate-on-scroll`}>
              {/* Connector line for mobile */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 bottom-0 w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent z-0 transform translate-y-full"></div>
              )}
              
              <div className="flex items-start gap-4 relative z-10">
                {/* Step indicator circle */}
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                  {step.icon}
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
                  {/* Title and description */}
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  
                  {/* Simple progress indicator */}
                  <div className="mt-4">
                    <div className={`w-16 h-1 bg-gradient-to-r ${step.gradient} rounded-full`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 opacity-0 translate-y-10 transition-all duration-1000 delay-600 animate-on-scroll">
          <button className="bg-gradient-to-r from-[#FF9898] via-[#FFAAAA] to-[#FF7979] hover:from-[#FF7979] hover:to-[#FF9898] text-white font-semibold py-4 px-12 rounded-full shadow-lg shadow-[#FF9898]/30 hover:shadow-xl hover:shadow-[#FF9898]/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
            <FiPlay className="h-5 w-5" />
            Start Creating Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;