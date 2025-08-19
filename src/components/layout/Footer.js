import Link from "next/link";
import Image from "next/image";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiSend, FiMail, FiMapPin, FiPhone, FiHeart } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container-custom max-w-7xl">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#FFE99A] to-[#FFAAAA] rounded-2xl p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-white/10 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay updated with SnapLove</h3>
              <p className="text-gray-700">
                Subscribe to our newsletter and be the first to know about new features, updates, and special offers.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full md:w-80 py-3 px-4 pr-12 rounded-full border-2 border-white focus:outline-none focus:border-[#FF9898] shadow-md transition-all group-hover:shadow-lg"
                />
                <button className="absolute right-1 top-1 bg-[#FF9898] hover:bg-[#FFAAAA] text-white p-2 rounded-full transition-all duration-300 group-hover:scale-105">
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - About */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/assets/Logo/snaplove-logo-black.png"
                alt="SnapLove Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-600 mb-6">
              SnapLove is a platform dedicated to helping you capture and share your most precious moments with loved ones around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="bg-[#FFE99A] hover:bg-[#FFD586] p-2 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <FiInstagram className="h-5 w-5 text-gray-700" />
              </Link>
              <Link href="#" className="bg-[#FFD586] hover:bg-[#FFE99A] p-2 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <FiTwitter className="h-5 w-5 text-gray-700" />
              </Link>
              <Link href="#" className="bg-[#FFAAAA] hover:bg-[#FF9898] p-2 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <FiFacebook className="h-5 w-5 text-gray-700" />
              </Link>
              <Link href="#" className="bg-[#FF9898] hover:bg-[#FFAAAA] p-2 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <FiYoutube className="h-5 w-5 text-gray-700" />
              </Link>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Features", "Pricing", "Contact", "FAQ"].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-600 hover:text-[#FF9898] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex justify-center">
                      <FiHeart className="h-3 w-3 text-[#FF9898]" />
                    </span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "GDPR Compliance", "Licenses"].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-600 hover:text-[#FF9898] transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 flex justify-center">
                      <FiHeart className="h-3 w-3 text-[#FF9898]" />
                    </span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <div className="bg-[#FFE99A] p-2 rounded-full mt-1">
                    <FiMapPin className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className="text-gray-600">123 Love Street, Snapville, SN 12345, Country</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="bg-[#FFAAAA] p-2 rounded-full">
                    <FiMail className="h-4 w-4 text-gray-700" />
                  </div>
                  <a href="mailto:hello@snaplove.com" className="text-gray-600 hover:text-[#FF9898] transition-colors">hello@snaplove.com</a>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="bg-[#FF9898] p-2 rounded-full">
                    <FiPhone className="h-4 w-4 text-gray-700" />
                  </div>
                  <a href="tel:+11234567890" className="text-gray-600 hover:text-[#FF9898] transition-colors">+1 (123) 456-7890</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} SnapLove. All rights reserved. Made with <FiHeart className="inline-block text-[#FF9898] heartbeating h-3 w-3" /> by SnapLove Team
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-[#FF9898] text-sm transition-colors">Terms</Link>
              <Link href="#" className="text-gray-500 hover:text-[#FF9898] text-sm transition-colors">Privacy</Link>
              <Link href="#" className="text-gray-500 hover:text-[#FF9898] text-sm transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;