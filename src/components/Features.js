"use client";
import { useEffect } from "react";
import { FiCamera, FiShare2, FiHeart, FiLock } from "react-icons/fi";

const Features = () => {
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

  const features = [
    {
      icon: <FiCamera className="h-6 w-6" />,
      title: "Capture Moments",
      description: "Take stunning photos with our advanced camera features and filters.",
      color: "bg-[#FFE99A]",
      delay: "delay-0"
    },
    {
      icon: <FiShare2 className="h-6 w-6" />,
      title: "Share Instantly",
      description: "Share your moments with friends and family in just one tap.",
      color: "bg-[#FFD586]",
      delay: "delay-150"
    },
    {
      icon: <FiHeart className="h-6 w-6" />,
      title: "Connect with Loved Ones",
      description: "Stay connected with the people who matter most to you.",
      color: "bg-[#FFAAAA]",
      delay: "delay-300"
    },
    {
      icon: <FiLock className="h-6 w-6" />,
      title: "Private & Secure",
      description: "Your memories are kept private and secure with our advanced encryption.",
      color: "bg-[#FF9898]",
      delay: "delay-450"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose <span className="text-[#FF9898]">SnapLove</span>
          </h2>
          <p className="text-gray-600 text-lg">
            SnapLove offers a unique way to capture and share your special moments with the people who matter most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-1000 border border-gray-100 hover:-translate-y-2 opacity-0 translate-y-10 ${feature.delay} animate-on-scroll`}
            >
              <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-gray-700`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;