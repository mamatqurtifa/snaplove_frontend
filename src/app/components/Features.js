'use client';

import { FiHeart, FiShield, FiZap, FiUsers } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: FiHeart,
      title: 'Smart Matching',
      description: 'Our advanced AI algorithm analyzes your preferences and behavior to find your perfect match.',
      color: 'snap-pink',
      bgColor: 'snap-pink-light'
    },
    {
      icon: FiShield,
      title: 'Safe & Secure',
      description: 'Your privacy and safety are our top priority. All profiles are verified and data is encrypted.',
      color: 'snap-orange',
      bgColor: 'snap-orange'
    },
    {
      icon: FiZap,
      title: 'Instant Connections',
      description: 'Connect instantly with people who share your interests and values through our real-time chat.',
      color: 'snap-yellow',
      bgColor: 'snap-yellow'
    },
    {
      icon: FiUsers,
      title: 'Community Focused',
      description: 'Join a vibrant community of genuine people looking for meaningful relationships.',
      color: 'snap-pink',
      bgColor: 'snap-pink-light'
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-snap-pink to-snap-orange bg-clip-text text-transparent">
              SnapLove?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover what makes SnapLove the perfect platform for finding genuine connections 
            and building lasting relationships.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover-lift hover:shadow-lg transition-all duration-300 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-${feature.bgColor}/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-snap-pink transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover effect background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${feature.bgColor}/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 fade-in">
          <button className="bg-gradient-to-r from-snap-pink to-snap-orange text-white px-8 py-4 rounded-full font-medium text-lg btn-hover">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
}