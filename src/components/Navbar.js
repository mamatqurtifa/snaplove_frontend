"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiSearch, FiUser, FiHeart, FiBell } from "react-icons/fi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="container-custom flex justify-between items-center">
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
          <Link href="/explore" className="nav-link">
            Explore
          </Link>
          <Link href="/leaderboard" className="nav-link">
            Leaderboard
          </Link>
          <Link href="/pricing" className="nav-link">
            Pricing
          </Link>
          <Link href="/help" className="nav-link">
            Help Center
          </Link>
        </div>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors">
            <FiSearch className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors">
            <FiBell className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors">
            <FiHeart className="h-5 w-5 text-gray-700" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FiUser className="h-5 w-5" /> Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors">
            <FiSearch className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors"
          >
            {isMenuOpen ? (
              <FiX className="h-5 w-5 text-gray-700" />
            ) : (
              <FiMenu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-effect py-6 px-6 z-40 border-t border-gray-100 fade-in">
          <div className="flex flex-col space-y-5">
            <Link
              href="/explore"
              className="nav-link flex items-center gap-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="bg-[#FFE99A] p-2 rounded-full">
                <FiSearch className="h-4 w-4" />
              </span>
              Explore
            </Link>
            <Link
              href="/leaderboard"
              className="nav-link flex items-center gap-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="bg-[#FFD586] p-2 rounded-full">
                <FiHeart className="h-4 w-4" />
              </span>
              Leaderboard
            </Link>
            <Link
              href="/pricing"
              className="nav-link flex items-center gap-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="bg-[#FFAAAA] p-2 rounded-full">
                <FiBell className="h-4 w-4" />
              </span>
              Pricing
            </Link>
            <Link
              href="/help"
              className="nav-link flex items-center gap-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="bg-[#FF9898] p-2 rounded-full text-white">
                <FiUser className="h-4 w-4" />
              </span>
              Help Center
            </Link>
            <div className="pt-4 border-t border-gray-100">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <FiUser className="h-5 w-5" /> Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;