"use client";
import { useEffect, useState, useRef } from "react";
import { FiCamera, FiUpload, FiDownload, FiShare2, FiEdit } from "react-icons/fi";

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

  const features = [
    {
      icon: <FiCamera className="h-8 w-8" />,
      title: "Capture Your Cute Photos",
      description: "Take beautiful photos with various frames and filters to make every moment special.",
      color: "bg-[#FFE99A]",
      gradient: "from-[#FFE99A] to-[#FFD586]",
      delay: "delay-0",
      pattern: "dots"
    },
    {
      icon: <FiShare2 className="h-8 w-8" />,
      title: "Share Your Creations",
      description: "Share your frames with the community and let others enjoy them.",
      color: "bg-[#C9A7FF]",
      gradient: "from-[#C9A7FF] to-[#B794F6]",
      delay: "delay-150",
      pattern: "waves"
    },
    {
      icon: <FiDownload className="h-8 w-8" />,
      title: "Use Community Frames",
      description: "Browse and use thousands of frames created by talented designers.",
      color: "bg-[#A8EECC]",
      gradient: "from-[#A8EECC] to-[#81E6D9]",
      delay: "delay-300",
      pattern: "circles"
    },
    {
      icon: <FiEdit className="h-8 w-8" />,
      title: "Customize Photos",
      description: "Add filters, stickers, and text to personalize your photos even more.",
      color: "bg-[#FF9898]",
      gradient: "from-[#FF9898] to-[#FFAAAA]",
      delay: "delay-450",
      pattern: "triangles"
    }
  ];

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

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchEnd(0); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < features.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
    
    // Reset touch values
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 7000); // Increased to 7 seconds to give more time for manual swiping

    return () => clearInterval(timer);
  }, [features.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Because Every Photo Deserves a <br></br><span className="text-[#FF9898] relative z-10">
              Touch of Love
              <svg className="absolute bottom-1 left-0 w-full -z-10" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,5 Q50,15 100,5 V15 H0 Z" fill="rgba(255, 233, 154, 0.3)"/>
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Snaplove offers an easy way to create, share and use beautiful photo frames for all your special moments.
          </p>
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl opacity-0 translate-y-10 ${feature.delay} animate-on-scroll group transition-all duration-500 hover:-translate-y-2 border border-gray-100`}
            >
              {/* Decorative Pattern Background */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {feature.pattern === 'dots' && (
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                    <div className="grid grid-cols-4 gap-1 h-full">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`${feature.color} rounded-full`}></div>
                      ))}
                    </div>
                  </div>
                )}
                {feature.pattern === 'waves' && (
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path d="M20,20 Q40,10 60,20 T100,20" stroke={feature.color.replace('bg-', '')} strokeWidth="3" fill="none"/>
                      <path d="M20,40 Q40,30 60,40 T100,40" stroke={feature.color.replace('bg-', '')} strokeWidth="3" fill="none"/>
                      <path d="M20,60 Q40,50 60,60 T100,60" stroke={feature.color.replace('bg-', '')} strokeWidth="3" fill="none"/>
                    </svg>
                  </div>
                )}
                {feature.pattern === 'circles' && (
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                    <div className={`w-8 h-8 ${feature.color} rounded-full absolute top-2 right-2`}></div>
                    <div className={`w-12 h-12 ${feature.color} rounded-full absolute bottom-2 left-2`}></div>
                    <div className={`w-6 h-6 ${feature.color} rounded-full absolute top-8 left-8`}></div>
                  </div>
                )}
                {feature.pattern === 'triangles' && (
                  <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                    <div className="relative w-full h-full">
                      <div className={`w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-[#FF9898] absolute top-2 right-4`}></div>
                      <div className={`w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-[#FF9898] absolute bottom-2 left-2`}></div>
                      <div className={`w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-[#FF9898] absolute top-8 left-8`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with animated background */}
                <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-gray-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 mx-auto shadow-lg`}>
                  {feature.icon}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
                </div>

                {/* Title with gradient text on hover */}
                <h3 className="text-xl font-bold mb-4 group-hover:bg-gradient-to-r group-hover:from-[#FF9898] group-hover:to-[#FFAAAA] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-center">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative bottom element */}
                <div className={`w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mt-6 group-hover:w-16 transition-all duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel - Visible only on Mobile */}
        <div className="md:hidden relative">
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-hidden rounded-3xl touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-x' }}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mx-2">
                    {/* Decorative Pattern Background */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      {feature.pattern === 'dots' && (
                        <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                          <div className="grid grid-cols-4 gap-1 h-full">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`${feature.color} rounded-full`}></div>
                            ))}
                          </div>
                        </div>
                      )}
                      {feature.pattern === 'waves' && (
                        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path d="M20,20 Q40,10 60,20 T100,20" stroke={feature.color.replace('bg-', '')} strokeWidth="3" fill="none"/>
                            <path d="M20,40 Q40,30 60,40 T100,40" stroke={feature.color.replace('bg-', '')} strokeWidth="3" fill="none"/>
                            <path d="M20,60 Q40,50 60,60 T100,60" stroke={feature.color.replace('bg-', '')} strokeWidth="3" fill="none"/>
                          </svg>
                        </div>
                      )}
                      {feature.pattern === 'circles' && (
                        <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                          <div className={`w-8 h-8 ${feature.color} rounded-full absolute top-2 right-2`}></div>
                          <div className={`w-12 h-12 ${feature.color} rounded-full absolute bottom-2 left-2`}></div>
                          <div className={`w-6 h-6 ${feature.color} rounded-full absolute top-8 left-8`}></div>
                        </div>
                      )}
                      {feature.pattern === 'triangles' && (
                        <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                          <div className="relative w-full h-full">
                            <div className={`w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-[#FF9898] absolute top-2 right-4`}></div>
                            <div className={`w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-[#FF9898] absolute bottom-2 left-2`}></div>
                            <div className={`w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-[#FF9898] absolute top-8 left-8`}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-gray-700 mx-auto shadow-lg`}>
                        {feature.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-4 text-center">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-center leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Decorative bottom element */}
                      <div className={`w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mt-6`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-[#FF9898] scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;