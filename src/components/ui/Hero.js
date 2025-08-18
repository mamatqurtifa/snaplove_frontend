'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HiPlay, HiStar, HiUserGroup, HiPhotograph } from 'react-icons/hi';

const Hero = () => {
  const stats = [
    { icon: HiPhotograph, value: '1M+', label: 'Photos Shared' },
    { icon: HiUserGroup, value: '50K+', label: 'Active Users' },
    { icon: HiStar, value: '4.9', label: 'Average Rating' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-brand-yellow/20 via-brand-orange/10 to-brand-pink/20 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmY5ZjkiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNi0yLTYtMnptMC0xNiA2LTItNi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight">
              Share Your 
              <span className="bg-brand-gradient bg-clip-text text-transparent"> Moments</span>
              <br />
              With The World
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
              Discover and share amazing moments through photos. Connect with a community of photographers and storytellers from around the globe.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/signup"
                className="bg-brand-gradient text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Sharing Now
              </Link>
              <button className="flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold px-8 py-4 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
                <HiPlay className="h-5 w-5 text-brand-red" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start">
                    <stat.icon className="h-6 w-6 text-brand-red mr-2" />
                    <span className="font-poppins font-bold text-2xl text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/images/assets/snaplove-banner.png"
                alt="SnapLove App Banner"
                width={600}
                height={400}
                priority
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-brand-yellow rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-brand-pink rounded-full opacity-50 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -right-8 w-12 h-12 bg-brand-orange rounded-full opacity-40 animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-8">Trusted by photographers worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for partner logos - you can replace with actual logos */}
            <div className="text-gray-400 font-semibold">Photography Weekly</div>
            <div className="text-gray-400 font-semibold">CreativeShots</div>
            <div className="text-gray-400 font-semibold">PhotoWorld</div>
            <div className="text-gray-400 font-semibold">LensLife</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;