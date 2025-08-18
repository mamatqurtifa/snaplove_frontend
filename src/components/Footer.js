import Link from "next/link";
import Image from "next/image";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiSend, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container-custom">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#FFE99A] to-[#FFAAAA] rounded-2xl p-8 md:p-12 mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay updated with SnapLove</h3>
              <p className="text-gray-700">
                Subscribe to our newsletter and be the first to know about new features, updates, and special offers.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full md:w-80 py-3 px-4 pr-12 rounded-full border-2 border-white focus:outline-none focus:border-[#FF9898] shadow-md"
                />
                <button className="absolute right-1 top-1 bg-[#FF9898] hover:bg-[#FFAAAA] text-white p-2 rounded-full transition-colors duration-300">
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
              <Link href="#" className="bg-[#FFE99A] hover:bg-[#FFD586] p-2 rounded-full transition-colors duration-300">
                <FiInstagram className="h-5 w-5 text-gray-700" />
              </Link>
              <Link href="#" className="bg-[#FFD586] hover:bg-[#FFE99A] p-2 rounded-full transition-colors duration-300">
                <FiTwitter className="h-5 w-5 text-gray-700" />
              </Link>
              <Link href="#" className="bg-[#FFAAAA] hover:bg-[#FF9898] p-2 rounded-full transition-colors duration-300">
                <FiFacebook className="h-5 w-5 text-gray-700" />
              </Link>
              <Link href="#" className="bg-[#FF9898] hover:bg-[#FFAAAA] p-2 rounded-full transition-colors duration-300">
                <FiYoutube className="h-5 w-5 text-gray-700" />
              </Link>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/explore" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFD586] rounded-full"></span>
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFAAAA] rounded-full"></span>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FF9898] rounded-full"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFE99A] rounded-full"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFD586] rounded-full"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFAAAA] rounded-full"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FF9898] rounded-full"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFE99A] rounded-full"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFD586] rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#FFAAAA] rounded-full"></span>
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="h-5 w-5 text-[#FF9898] mt-1" />
                <span className="text-gray-600">
                  123 SnapLove Street, Digital City, Internet 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="h-5 w-5 text-[#FFAAAA]" />
                <a href="mailto:hello@snaplove.com" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  hello@snaplove.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="h-5 w-5 text-[#FFD586]" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} SnapLove. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-gray-700 text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;