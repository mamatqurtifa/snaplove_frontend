'use client';

import { FiUserPlus, FiSearch, FiMessageCircle } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: FiUserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and create an authentic profile that showcases your personality, interests, and what you\'re looking for in a partner.',
      color: 'snap-pink'
    },
    {
      number: 2,
      icon: FiSearch,
      title: 'Find Your Match',
      description: 'Our smart algorithm analyzes your preferences and suggests compatible matches based on shared interests and values.',
      color: 'snap-orange'
    },
    {
      number: 3,
      icon: FiMessageCircle,
      title: 'Start Connecting',
      description: 'Once you match, start meaningful conversations and build genuine connections that could lead to lasting relationships.',
      color: 'snap-yellow'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How{' '}
            <span className="bg-gradient-to-r from-snap-pink to-snap-orange bg-clip-text text-transparent">
              SnapLove
            </span>{' '}
            Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Getting started with SnapLove is simple. Follow these three easy steps to find your perfect match.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between">
              <div className="w-8 h-8 bg-snap-pink rounded-full"></div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-4"></div>
              <div className="w-8 h-8 bg-snap-orange rounded-full"></div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300 mt-4"></div>
              <div className="w-8 h-8 bg-snap-yellow rounded-full"></div>
            </div>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step number and icon */}
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br from-${step.color} to-${step.color}/80 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${step.color} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Match?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who found love through SnapLove. 
            Start your journey today and discover meaningful connections.
          </p>
          <button className="bg-gradient-to-r from-snap-pink to-snap-orange text-white px-8 py-4 rounded-full font-medium text-lg btn-hover">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}