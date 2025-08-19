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
      <div className="container-custom flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={scrolled ? "/images/assets/Logo/snaplove-logo-black.png" : "/images/assets/Logo/snaplove-logo-black.png"}
            alt="SnapLove Logo"
            width={150}
            height={50}
            className="h-10 w-auto transition-all duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {["Explore", "Leaderboard", "Pricing", "Help Center"].map((item, index) => (
            <Link key={index} href={`/${item.toLowerCase().replace(" ", "-")}`} className="nav-link group">
              <span className="relative overflow-hidden">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF9898] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 hover:rotate-6">
            <FiSearch className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 relative group">
            <FiBell className="h-5 w-5 text-gray-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF9898] rounded-full group-hover:animate-pulse"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 hover:rotate-6">
            <FiHeart className="h-5 w-5 text-gray-700" />
          </button>
          <button className="btn-primary flex items-center gap-2 group">
            <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform" /> Sign In
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
      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="container mx-auto px-6 py-6 flex flex-col space-y-6">
          {["Explore", "Leaderboard", "Pricing", "Help Center"].map((item, index) => (
            <Link 
              key={index}
              href={`/${item.toLowerCase().replace(" ", "-")}`} 
              className="text-lg font-medium text-gray-700 hover:text-[#FF9898] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            <button className="btn-outline flex items-center justify-center gap-2 w-full">
              <FiHeart className="h-5 w-5" /> Favorites
            </button>
            <button className="btn-primary flex items-center justify-center gap-2 w-full">
              <FiUser className="h-5 w-5" /> Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;