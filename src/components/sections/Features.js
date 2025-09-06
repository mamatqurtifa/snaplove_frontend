"use client";
import { useEffect, useState, useRef } from "react";
import { FiCamera, FiUpload, FiDownload, FiShare2, FiEdit, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Features = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const features = [
    {
      icon: <FiCamera className="h-8 w-8" />,
      title: "Capture Your Cute Photos",
      description: "Take beautiful photos with various frames and filters to make every moment special and memorable.",
      color: "bg-[#FFE99A]",
      gradient: "from-[#FFE99A] via-[#FFD586] to-[#FFC947]",
      delay: "delay-0",
      pattern: "camera",
      bgShape: "camera-bg"
    },
    {
      icon: <FiShare2 className="h-8 w-8" />,
      title: "Share Your Creations",
      description: "Share your frames with the community and let others enjoy your creative masterpieces.",
      color: "bg-[#C9A7FF]",
      gradient: "from-[#C9A7FF] via-[#B794F6] to-[#9F7AEA]",
      delay: "delay-150",
      pattern: "share",
      bgShape: "share-bg"
    },
    {
      icon: <FiDownload className="h-8 w-8" />,
      title: "Use Community Frames",
      description: "Browse and use thousands of frames created by talented designers from around the world.",
      color: "bg-[#A8EECC]",
      gradient: "from-[#A8EECC] via-[#81E6D9] to-[#4FD1C7]",
      delay: "delay-300",
      pattern: "download",
      bgShape: "download-bg"
    },
    {
      icon: <FiEdit className="h-8 w-8" />,
      title: "Customize Photos",
      description: "Add filters, stickers, and text to personalize your photos and make them uniquely yours.",
      color: "bg-[#FF9898]",
      gradient: "from-[#FF9898] via-[#FFAAAA] to-[#FF7979]",
      delay: "delay-450",
      pattern: "edit",
      bgShape: "edit-bg"
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

  // Auto-advance carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % features.length);
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [features.length, isAutoPlaying]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
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
    
    setTouchStart(0);
    setTouchEnd(0);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const renderBackgroundPattern = (pattern, gradient) => {
    switch (pattern) {
      case 'camera':
        return (
          <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10">
            <div className="grid grid-cols-3 gap-1 p-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 bg-gradient-to-br ${gradient} rounded-full animate-pulse`} style={{animationDelay: `${i * 0.1}s`}}></div>
              ))}
            </div>
          </div>
        );
      case 'share':
        return (
          <div className="absolute -top-2 -right-2 w-20 h-20 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="20" cy="30" r="8" className="fill-current text-[#C9A7FF]" />
              <circle cx="80" cy="20" r="6" className="fill-current text-[#B794F6]" />
              <circle cx="70" cy="80" r="10" className="fill-current text-[#9F7AEA]" />
              <line x1="28" y1="35" x2="65" y2="75" stroke="#C9A7FF" strokeWidth="2" />
              <line x1="28" y1="25" x2="72" y2="25" stroke="#B794F6" strokeWidth="2" />
            </svg>
          </div>
        );
      case 'download':
        return (
          <div className="absolute -top-2 -right-2 w-20 h-20 opacity-15">
            <div className="relative w-full h-full">
              <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-[#A8EECC] to-[#81E6D9] transform rotate-45"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-[#81E6D9] to-[#4FD1C7] rounded-full"></div>
              <div className="absolute top-8 left-8 w-3 h-8 bg-gradient-to-b from-[#A8EECC] to-[#4FD1C7] rounded-full"></div>
            </div>
          </div>
        );
      case 'edit':
        return (
          <div className="absolute -top-2 -right-2 w-20 h-20 opacity-10">
            <div className="relative w-full h-full">
              <div className="absolute top-2 right-4 w-0 h-0 border-l-3 border-r-3 border-b-6 border-transparent border-b-[#FF9898]"></div>
              <div className="absolute bottom-2 left-2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-[#FFAAAA]"></div>
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#FF7979] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="section-padding bg-gradient-to-br from-[#FAFBFF] via-white to-[#F5F7FA] relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-[#FFE99A]/20 to-[#FFD586]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-16 w-48 h-48 bg-gradient-to-l from-[#C9A7FF]/15 to-[#B794F6]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-[#FF9898]/10 to-[#FFAAAA]/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Because Every Photo Deserves a<br className="hidden sm:block" />
            <span className="text-[#FF9898] relative inline-block mt-2">
              Touch of Love
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0,8 Q100,18 200,8 V20 H0 Z" fill="#FFE99A" opacity="0.4" />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            SnapLove offers an easy way to create, share and use beautiful photo frames for all your special moments.
          </p>
        </div>

        {/* Desktop Grid - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 xl:p-8 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-black/10 opacity-0 translate-y-10 ${feature.delay} animate-on-scroll group transition-all duration-700 hover:-translate-y-3 border border-white/60 overflow-hidden`}
            >
              {/* Enhanced background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`}></div>
              
              {/* Glowing border effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>
              
              {/* Background pattern */}
              {renderBackgroundPattern(feature.pattern, feature.gradient)}

              {/* Content */}
              <div className="relative z-10">
                {/* Enhanced icon with multiple layers */}
                <div className={`relative bg-gradient-to-br ${feature.gradient} w-16 h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-6 text-gray-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mx-auto shadow-lg shadow-black/10`}>
                  {feature.icon}
                  {/* Inner glow */}
                  <div className="absolute inset-1 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Outer pulse */}
                  <div className={`absolute -inset-2 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-20 animate-ping`}></div>
                </div>

                {/* Enhanced title */}
                <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-all duration-300 text-center leading-snug">
                  {feature.title}
                </h3>

                {/* Enhanced description */}
                <p className="text-gray-600 text-center leading-relaxed text-sm xl:text-base group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Enhanced decorative bottom element */}
                <div className={`w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mt-6 group-hover:w-20 group-hover:h-1.5 transition-all duration-500 shadow-sm`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Mobile/Tablet Carousel */}
        <div className="lg:hidden relative">
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <FiChevronRight className="h-5 w-5 text-gray-700" />
          </button>

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
                  className="w-full flex-shrink-0 px-4 py-2"
                >
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/60 mx-2 overflow-hidden">
                    {/* Background pattern */}
                    {renderBackgroundPattern(feature.pattern, feature.gradient)}
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <div className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-gray-700 mx-auto shadow-lg`}>
                        {feature.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {feature.description}
                      </p>

                      {/* Decorative element */}
                      <div className={`w-16 h-1 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mt-6`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation Dots */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? 'w-8 h-3 bg-gradient-to-r from-[#FF9898] to-[#FFAAAA] shadow-lg shadow-[#FF9898]/30' 
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex justify-center text-sm text-gray-500 mb-2">
              {currentSlide + 1} of {features.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-[#FF9898] to-[#FFAAAA] h-1 rounded-full transition-all duration-500"
                style={{ width: `${((currentSlide + 1) / features.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;