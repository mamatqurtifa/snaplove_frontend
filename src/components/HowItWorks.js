"use client";
import { useEffect } from "react";
import Image from "next/image";
import { FiUpload, FiCamera, FiShare2, FiDownload, FiArrowRight } from "react-icons/fi";

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
      icon: <FiUpload className="h-6 w-6" />,
      title: "Upload or Create Frame",
      description: "Create a new photo frame or upload your design to share with others.",
      color: "bg-[#FFE99A]",
      iconColor: "text-gray-700",
      delay: "delay-0",
      image: "/images/steps/upload-frame.jpg",
      alt: "Uploading a frame"
    },
    {
      icon: <FiCamera className="h-6 w-6" />,
      title: "Take a Photo",
      description: "Use your camera or upload a photo to use with the frame.",
      color: "bg-[#C9A7FF]",
      iconColor: "text-gray-700",
      delay: "delay-200",
      image: "/images/steps/take-photo.jpg",
      alt: "Taking a photo"
    },
    {
      icon: <FiShare2 className="h-6 w-6" />,
      title: "Share Your Creation",
      description: "Share your framed photo on social media or save it to your device.",
      color: "bg-[#FF9898]",
      iconColor: "text-white",
      delay: "delay-400",
      image: "/images/steps/share-creation.jpg",
      alt: "Sharing creation"
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
            How <span className="text-[#FF9898] relative">
              SnapLove
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,5 Q50,15 100,5 V15 H0 Z" fill="#FFE99A" opacity="0.5" />
              </svg>
            </span> Works
          </h2>
          <p className="text-gray-600 text-lg">
            Getting started with SnapLove is easy. Follow these simple steps to create and share beautiful framed photos.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FFE99A] via-[#C9A7FF] to-[#FF9898] transform -translate-y-1/2 z-0 rounded-full"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`glass-effect p-8 opacity-0 translate-y-10 transition-all duration-1000 ${step.delay} animate-on-scroll hover:shadow-xl hover:-translate-y-3 group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 overflow-hidden rounded-2xl w-full h-48">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 ${step.iconColor} group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF9898] transition-colors">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {index === steps.length - 1 ? (
                    <button className="mt-6 btn-primary flex items-center justify-center gap-2 w-full group">
                      Try Now
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="mt-6 h-10 flex items-center justify-center">
                      <FiArrowRight className="h-5 w-5 text-gray-400 md:rotate-0 rotate-90" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 flex justify-center opacity-0 translate-y-10 transition-all duration-1000 delay-500 animate-on-scroll">
          <div className="relative max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE99A] to-[#FF9898] rounded-3xl blur-xl opacity-20"></div>
            <div className="relative glass-effect p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="photo-frame w-32 floating">
                  <Image
                    src="/images/popular-frames-preview.jpg"
                    alt="Popular Frames Preview"
                    width={150}
                    height={300}
                    className="rounded-2xl shadow-lg"
                  />
                  <div className="absolute top-0 right-0 bg-[#FF9898] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Popular Frames</h3>
                  <p className="text-gray-600 mb-4">Check out our most popular frames created by the community this week.</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="tag bg-[#FFE99A] text-gray-700">Birthday</span>
                    <span className="tag bg-[#C9A7FF] text-white">Wedding</span>
                    <span className="tag bg-[#A8EECC] text-gray-700">Holiday</span>
                    <span className="tag bg-[#FF9898] text-white">Graduation</span>
                  </div>
                  <button className="mt-4 btn-secondary w-full">
                    Explore Popular Frames
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;