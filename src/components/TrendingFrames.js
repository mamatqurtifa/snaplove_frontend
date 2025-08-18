"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FiHeart, FiDownload, FiEye, FiUser } from "react-icons/fi";

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
    <section className="section-padding bg-white">
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
              className={`category-pill px-6 py-2 ${
                activeCategory === category
                  ? "bg-[#FF9898] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              className={`frame-card opacity-0 translate-y-10 transition-all duration-1000 delay-${index * 100} animate-on-scroll`}
            >
              <div className="photo-frame mb-4 overflow-hidden">
                <Image
                  src={frame.image}
                  alt={frame.title}
                  width={400}
                  height={500}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="tag bg-[#FF9898]/90 text-white backdrop-blur-sm">
                    {frame.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{frame.title}</h3>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={frame.avatarUrl}
                      alt={frame.creator}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600">@{frame.creator}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiHeart className="h-4 w-4 text-[#FF9898]" />
                    <span>{frame.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FiDownload className="h-4 w-4 text-[#C9A7FF]" />
                    <span>{frame.downloads}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="btn-outline flex-1 py-2 flex items-center justify-center gap-1">
                  <FiEye className="h-4 w-4" /> Preview
                </button>
                <button className="btn-primary flex-1 py-2 flex items-center justify-center gap-1">
                  <FiDownload className="h-4 w-4" /> Use
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 opacity-0 translate-y-10 transition-all duration-1000 delay-600 animate-on-scroll">
          <button className="btn-secondary px-8">
            View All Frames
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingFrames;