"use client";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";

export default function UserAvatar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none"
        aria-label="User menu"
      >
        {isAuthenticated ? (
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FFE99A] transition-transform hover:scale-105">
            <Image
              src={user?.image_profile || '/images/assets/default-avatar.png'}
              alt={user?.name || 'User'}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <button className="btn-primary flex items-center gap-2 group">
            <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform" /> Sign In
          </button>
        )}
      </button>

      {isOpen && isAuthenticated && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-10 overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
          </div>
          
          <Link 
            href="/profile" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#FFE99A]/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiUser className="mr-3 h-4 w-4" />
            Profile
          </Link>
          
          <Link 
            href="/settings" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-[#FFE99A]/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FiSettings className="mr-3 h-4 w-4" />
            Settings
          </Link>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}