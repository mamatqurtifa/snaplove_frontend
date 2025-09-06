"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiDownload, FiEye } from "react-icons/fi";

const TrendingFrames = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
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

  const categories = ["All", "Birthday", "Wedding", "Holiday", "Graduation", "Baby"];
  
  const frames = [
    {
      id: 1,
      title: "Birthday Celebration",
      creator: "designlover",
      image: "/images/frames/birthday-frame.png",
      category: "Birthday",
      likes: 2584,
      downloads: 1240,
      avatarUrl: "/images/avatars/avatar-1.jpeg"
    },
    {
      id: 2,
      title: "Wedding Memories",
      creator: "loveframes",
      image: "/images/frames/wedding-frame.png",
      category: "Wedding",
      likes: 3452,
      downloads: 2100,
      avatarUrl: "/images/avatars/avatar-2.jpeg"
    },
    {
      id: 3,
      title: "Christmas Joy",
      creator: "holidaymaker",
      image: "/images/frames/holiday-frame.png",
      category: "Holiday",
      likes: 1856,
      downloads: 980,
      avatarUrl: "/images/avatars/avatar-3.jpeg"
    },
    {
      id: 4,
      title: "Graduation Day",
      creator: "academiclife",
      image: "/images/frames/graduation-frame.png",
      category: "Graduation",
      likes: 2145,
      downloads: 1320,
      avatarUrl: "/images/avatars/avatar-4.jpeg"
    },
    {
      id: 5,
      title: "Baby Announcement",
      creator: "newparents",
      image: "/images/frames/baby-frame.png",
      category: "Baby",
      likes: 4251,
      downloads: 3120,
      avatarUrl: "/images/avatars/avatar-5.jpeg"
    },
    {
      id: 6,
      title: "Summer Vibes",
      creator: "beachlover",
      image: "/images/frames/summer-frame.png",
      category: "Holiday",
      likes: 1958,
      downloads: 876,
      avatarUrl: "/images/avatars/avatar-6.jpeg"
    }
  ];
  
  const filteredFrames = activeCategory === "All" 
    ? frames 
    : frames.filter(frame => frame.category === activeCategory);

  return (
    <section className="section-padding bg-gradient-to-br from-white to-[#F8F9FF] relative">
      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 right-0 w-48 h-48 bg-[#C9A7FF]/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-56 h-56 bg-[#FFE99A]/15 rounded-full blur-3xl -z-10"></div>
      
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 translate-y-10 transition-all duration-1000 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Trending <span className="text-[#FF9898] relative">
              Frames
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,5 Q50,15 100,5 V15 H0 Z" fill="#FFE99A" opacity="0.5" />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Discover the most popular photo frames created by our talented community.
          </p>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 opacity-0 translate-y-10 transition-all duration-1000 delay-200 animate-on-scroll">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#FF9898] text-white shadow-lg shadow-[#FF9898]/25 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFrames.map((frame, index) => (
            <div 
              key={frame.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-0 translate-y-10 animate-on-scroll group`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={frame.image}
                  alt={frame.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-[#FF9898]/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                    {frame.category}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#FF9898] transition-colors duration-300">
                  {frame.title}
                </h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-100">
                      <Image
                        src={frame.avatarUrl}
                        alt={frame.creator}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">@{frame.creator}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FiHeart className="h-4 w-4 text-[#FF9898]" />
                      <span className="font-medium">{frame.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <FiDownload className="h-4 w-4 text-[#C9A7FF]" />
                      <span className="font-medium">{frame.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
                    <FiEye className="h-4 w-4" /> 
                    Preview
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-[#FF9898] to-[#FF7B7B] hover:from-[#FF7B7B] hover:to-[#FF9898] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-[#FF9898]/25">
                    <FiDownload className="h-4 w-4" /> 
                    Use
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16 opacity-0 translate-y-10 transition-all duration-1000 delay-600 animate-on-scroll">
          <Link href="/discover">
            <button className="bg-gradient-to-r from-[#C9A7FF] to-[#B794F6] hover:from-[#B794F6] hover:to-[#C9A7FF] text-white font-semibold py-4 px-12 rounded-full transition-all duration-300 shadow-lg shadow-[#C9A7FF]/25 hover:shadow-xl hover:shadow-[#C9A7FF]/30 hover:-translate-y-1">
              View All Frames
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingFrames;