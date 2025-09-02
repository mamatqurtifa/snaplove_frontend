"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiSearch, FiUser, FiHeart, FiBell, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

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
  
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user has admin role
  const isAdmin = user?.role && (user.role.toLowerCase().includes('official') || user.role.toLowerCase().includes('developer'));

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
          {["Discover", "Leaderboard", "Pricing", "Help Center"].map((item, index) => (
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
          
          {isAuthenticated ? (
            <>
              <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 relative group">
                <FiBell className="h-5 w-5 text-gray-700" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF9898] rounded-full group-hover:animate-pulse"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 hover:rotate-6">
                <FiHeart className="h-5 w-5 text-gray-700" />
              </button>
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-[#FFE99A] transition-all duration-300 focus:outline-none"
                >
                  <Image
                    src={user?.image_profile || "/images/assets/placeholder-user.png"}
                    alt="Profile"
                    width={38}
                    height={38}
                    className="rounded-full h-9 w-9 object-cover border-2 border-[#FFE99A]"
                  />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">@{user?.username}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser className="h-4 w-4" /> Profile
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/official-admin-snaplove" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiSettings className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left flex items-center gap-2"
                    >
                      <FiLogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/auth/login" className="btn-primary flex items-center gap-2 group">
              <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform" /> Sign In
            </Link>
          )}
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
          {isAuthenticated && (
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <Image
                src={user?.image_profile || "/images/assets/placeholder-user.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover border-2 border-[#FFE99A]"
              />
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
            </div>
          )}
          
          {["Discover", "Leaderboard", "Pricing", "Help Center"].map((item, index) => (
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
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="btn-outline flex items-center justify-center gap-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="h-5 w-5" /> Profile
                </Link>
                {isAdmin && (
                  <Link 
                    href="/official-admin-snaplove" 
                    className="btn-outline flex items-center justify-center gap-2 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiSettings className="h-5 w-5" /> Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="btn-primary flex items-center justify-center gap-2 w-full"
                >
                  <FiLogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn-outline flex items-center justify-center gap-2 w-full">
                  <FiHeart className="h-5 w-5" /> Favorites
                </button>
                <Link 
                  href="/auth/login" 
                  className="btn-primary flex items-center justify-center gap-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="h-5 w-5" /> Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;