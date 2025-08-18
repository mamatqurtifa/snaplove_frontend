"use client";
import { useEffect } from "react";
import Image from "next/image";
import { FiLayout, FiUpload, FiDownload, FiShare2, FiEdit } from "react-icons/fi";

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
      icon: <FiLayout className="h-6 w-6" />,
      title: "Create Photo Frames",
      description: "Design your own beautiful photo frames with our easy-to-use editor.",
      color: "bg-[#FFE99A]",
      delay: "delay-0",
      image: "/images/features/create-frames.jpg",
      alt: "Creating photo frames"
    },
    {
      icon: <FiShare2 className="h-6 w-6" />,
      title: "Share Your Creations",
      description: "Share your frames with the community and let others enjoy them.",
      color: "bg-[#C9A7FF]",
      delay: "delay-150",
      image: "/images/features/share-frames.jpg",
      alt: "Sharing photo frames"
    },
    {
      icon: <FiDownload className="h-6 w-6" />,
      title: "Use Community Frames",
      description: "Browse and use thousands of frames created by talented designers.",
      color: "bg-[#A8EECC]",
      delay: "delay-300",
      image: "/images/features/use-frames.jpg",
      alt: "Using community frames"
    },
    {
      icon: <FiEdit className="h-6 w-6" />,
      title: "Customize Photos",
      description: "Add filters, stickers, and text to personalize your photos even more.",
      color: "bg-[#FF9898]",
      delay: "delay-450",
      image: "/images/features/customize-photos.jpg",
      alt: "Customizing photos"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose <span className="text-[#FF9898] relative">
              SnapLove
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,5 Q50,15 100,5 V15 H0 Z" fill="#FFE99A" opacity="0.5" />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            SnapLove offers an easy way to create, share and use beautiful photo frames for all your special moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`frame-card opacity-0 translate-y-10 ${feature.delay} animate-on-scroll group`}
            >
              <div className="mb-6 overflow-hidden rounded-2xl">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 text-gray-700 cute-icon group-hover:rotate-6 mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF9898] transition-colors text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;