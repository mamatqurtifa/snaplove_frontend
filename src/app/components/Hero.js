'use client';

import { FiPlay, FiDownload, FiStar } from 'react-icons/fi';

export default function Hero() {
  return (
    <section id="home" className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-snap-yellow/20 via-snap-orange/10 to-snap-pink-light/20"></div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-snap-pink/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-snap-orange/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-snap-yellow/30 text-snap-pink font-medium text-sm mb-8 fade-in">
            <FiStar className="w-4 h-4 mr-2" />
            Find Your Perfect Match
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 fade-in">
            Snap, Connect, and{' '}
            <span className="bg-gradient-to-r from-snap-pink to-snap-orange bg-clip-text text-transparent">
              Fall in Love
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto fade-in">
            Experience the future of dating with SnapLove. Our innovative platform uses advanced 
            algorithms to help you find meaningful connections based on your authentic self.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 fade-in">
            <button className="w-full sm:w-auto bg-gradient-to-r from-snap-pink to-snap-orange text-white px-8 py-4 rounded-full font-medium text-lg btn-hover flex items-center justify-center">
              <FiDownload className="w-5 h-5 mr-2" />
              Download App
            </button>
            <button className="w-full sm:w-auto border-2 border-snap-pink text-snap-pink px-8 py-4 rounded-full font-medium text-lg btn-hover flex items-center justify-center hover:bg-snap-pink hover:text-white transition-colors duration-300">
              <FiPlay className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto fade-in">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-snap-pink mb-2">1M+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-snap-orange mb-2">50K+</div>
              <div className="text-gray-600">Successful Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-snap-yellow mb-2">4.9★</div>
              <div className="text-gray-600">App Store Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}