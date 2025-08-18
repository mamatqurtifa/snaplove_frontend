'use client';

import { useState } from 'react';
import { FiMenu, FiX, FiHeart } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#home" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-snap-pink to-snap-orange rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiHeart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-snap-pink to-snap-orange bg-clip-text text-transparent">
                SnapLove
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-snap-pink px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-snap-yellow/20"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-gradient-to-r from-snap-pink to-snap-orange text-white px-6 py-2 rounded-full font-medium btn-hover">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-snap-pink transition-colors duration-300"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-snap-pink block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button className="w-full mt-4 bg-gradient-to-r from-snap-pink to-snap-orange text-white px-6 py-2 rounded-full font-medium btn-hover">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}