"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiHeart, FiShare2, FiDownload } from "react-icons/fi";

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

  // Frame data array
  const frames = [
    {
      id: 1,
      title: "Birthday Celebration 🎂",
      mainImage: "/images/frames/birthday-main.jpg",
      overlayImage: "/images/frames/birthday-overlay.png",
      rotation: "rotate-3",
      animation: "floating",
      delay: "delay-0"
    },
    {
      id: 2,
      title: "Just Married 💍",
      mainImage: "/images/frames/wedding-main.jpg",
      overlayImage: "/images/frames/wedding-overlay.png",
      rotation: "rotate-2",
      animation: "floating",
      delay: "delay-100"
    },
    {
      id: 3,
      title: "Happy Holidays ☃️",
      mainImage: "/images/frames/holiday-main.jpg",
      overlayImage: "/images/frames/holiday-overlay.png",
      rotation: "rotate-4",
      animation: "floating",
      delay: "delay-200"
    },
    {
      id: 4,
      title: "Congrats Grad! 🎓",
      mainImage: "/images/frames/graduation-main.jpg",
      overlayImage: "/images/frames/graduation-overlay.png",
      rotation: "rotate-3",
      animation: "floating",
      delay: "delay-300"
    },
    {
      id: 5,
      title: "Summer Vibes 🏝️",
      mainImage: "/images/frames/summer-main.jpg",
      overlayImage: "/images/frames/summer-overlay.png",
      rotation: "rotate-2",
      animation: "floating",
      delay: "delay-400"
    },
    {
      id: 6,
      title: "Baby Announcement 👶",
      mainImage: "/images/frames/baby-main.jpg",
      overlayImage: "/images/frames/baby-overlay.png",
      rotation: "rotate-3",
      animation: "floating",
      delay: "delay-500"
    }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-white to-[#FFF8F8]"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFE99A]/30 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-[#E2CFFF]/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#C7F9E3]/30 rounded-full blur-3xl"></div>
      
      <div className="container-custom py-12 z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-12 md:mb-0 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Create & Share <span className="text-[#FF9898] relative">
                Photo Frames
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                  <path 
                    d="M0,5 Q50,15 100,5 V15 H0 Z" 
                    fill="#FFE99A" 
                  />
                </svg>
              </span> With Everyone
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              SnapLove helps you create beautiful photo frames, share them with the community, and use frames created by others for your perfect photos.
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
                <FiCamera className="group-hover:rotate-12 transition-transform" /> Browse Frames
              </Link>
            </div>
            
            <div className="mt-12 flex items-center">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden hover:scale-110 transition-transform z-10">
                    <Image 
                      src={`/images/avatars/avatar-${i}.jpg`} 
                      alt={`User ${i}`}
                      width={40} 
                      height={40} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="font-semibold">Join 10k+ creators</p>
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center opacity-0 translate-y-10 transition-all duration-1000 delay-300 animate-on-scroll">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-[#FFE99A] rounded-full opacity-20"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-[#C9A7FF] rounded-full opacity-20"></div>
              
              {/* Grid of frames */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                {frames.map((frame) => (
                  <div 
                    key={frame.id} 
                    className={`${frame.rotation} ${frame.animation} ${frame.delay} transition-all duration-500 hover:-rotate-1 hover:scale-105 group`}
                  >
                    <div className="bg-white p-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={frame.mainImage}
                          alt={frame.title}
                          width={160}
                          height={200}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full">
                          <Image
                            src={frame.overlayImage}
                            alt={`${frame.title} overlay`}
                            width={160}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                            <FiHeart className="h-4 w-4 text-[#FF9898]" />
                          </button>
                          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                            <FiDownload className="h-4 w-4 text-[#C9A7FF]" />
                          </button>
                          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                            <FiShare2 className="h-4 w-4 text-[#A8EECC]" />
                          </button>
                        </div>
                      </div>
                      <p className="text-center mt-2 text-xs font-medium truncate">{frame.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Featured frame indicator */}
              <div className="absolute -top-4 right-0 z-20 bg-[#FF9898] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Featured Frames
              </div>
              
              {/* Upload your frame CTA */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20">
                <button className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium hover:shadow-xl transition-all duration-300 group">
                  <span className="bg-[#A8EECC] p-1.5 rounded-full">
                    <FiCamera className="h-3 w-3 text-gray-700 group-hover:rotate-12 transition-transform" />
                  </span>
                  Upload Your Frame
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;