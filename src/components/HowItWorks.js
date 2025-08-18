"use client";
import { useEffect } from "react";
import Image from "next/image";
import { FiDownload, FiCamera, FiShare2, FiArrowRight } from "react-icons/fi";

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
      icon: <FiDownload className="h-6 w-6" />,
      title: "Download SnapLove",
      description: "Get started by downloading SnapLove app from your favorite app store.",
      color: "bg-[#FFE99A]",
      iconColor: "text-gray-700",
      delay: "delay-0"
    },
    {
      icon: <FiCamera className="h-6 w-6" />,
      title: "Capture Your Moments",
      description: "Take beautiful photos or upload existing ones from your gallery.",
      color: "bg-[#FFAAAA]",
      iconColor: "text-gray-700",
      delay: "delay-200"
    },
    {
      icon: <FiShare2 className="h-6 w-6" />,
      title: "Share With Loved Ones",
      description: "Share your special moments with friends and family instantly.",
      color: "bg-[#FF9898]",
      iconColor: "text-white",
      delay: "delay-400"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How <span className="text-[#FF9898]">SnapLove</span> Works
          </h2>
          <p className="text-gray-600 text-lg">
            Getting started with SnapLove is easy. Follow these simple steps to begin sharing your special moments.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FFE99A] via-[#FFAAAA] to-[#FF9898] transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl p-8 shadow-lg border border-gray-100 opacity-0 translate-y-10 transition-all duration-1000 ${step.delay} animate-on-scroll`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 ${step.iconColor}`}>
                    {step.icon}
                  </div>
                  <div className="bg-white text-[#FF9898] text-xl font-bold w-8 h-8 rounded-full border-2 border-[#FF9898] flex items-center justify-center mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center opacity-0 translate-y-10 transition-all duration-1000 delay-600 animate-on-scroll">
          <button className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Get Started Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;