"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiSearch, FiUser, FiHeart } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-sm py-3 shadow-md" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={scrolled ? "/images/assets/Logo/snaplove-logo-black.png" : "/images/assets/Logo/snaplove-logo-black.png"}
            alt="SnapLove Logo"
            width={150}
            height={50}
            className="h-10 w-auto transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/explore" className="nav-link flex items-center gap-1">
            <FiSearch className="text-lg" />
            Explore
          </Link>
          <Link href="/leaderboard" className="nav-link flex items-center gap-1">
            <FiHeart className="text-lg" />
            Leaderboard
          </Link>
          <Link href="/pricing" className="nav-link">
            Pricing
          </Link>
          <Link href="/help" className="nav-link">
            Help Center
          </Link>
          <button className="btn-primary flex items-center gap-2">
            <FiUser className="text-lg" />
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-[#FF9898] focus:outline-none p-2 rounded-full bg-white/80 backdrop-blur-sm"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg py-6 px-6 fade-in">
          <div className="flex flex-col space-y-5">
            <Link
              href="/explore"
              className="nav-link flex items-center gap-2 text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiSearch className="text-xl" />
              Explore
            </Link>
            <Link
              href="/leaderboard"
              className="nav-link flex items-center gap-2 text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiHeart className="text-xl" />
              Leaderboard
            </Link>
            <Link
              href="/pricing"
              className="nav-link text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/help"
              className="nav-link text-lg py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Help Center
            </Link>
            <button className="btn-primary flex items-center justify-center gap-2 mt-2 w-full">
              <FiUser className="text-lg" />
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;