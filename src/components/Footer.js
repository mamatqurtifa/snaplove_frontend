import Link from "next/link";
import Image from "next/image";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiSend, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-[#FFF8F8] pt-16 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FFE99A] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-16 left-1/4 w-48 h-48 bg-[#FFAAAA] rounded-full opacity-15 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand column */}
          <div className="flex flex-col">
            <Link href="/" className="mb-6">
              <Image
                src="/images/assets/Logo/snaplove-logo-black.png"
                alt="SnapLove Logo"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-6">
              Create beautiful photo frames for your special moments and share them with the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-[#FFE99A] rounded-full text-gray-700 hover:bg-[#FFD586] transition-colors duration-300">
                <FiInstagram className="text-lg" />
              </a>
              <a href="#" className="p-2 bg-[#FFAAAA] rounded-full text-gray-700 hover:bg-[#FF9898] transition-colors duration-300">
                <FiTwitter className="text-lg" />
              </a>
              <a href="#" className="p-2 bg-[#FFE99A] rounded-full text-gray-700 hover:bg-[#FFD586] transition-colors duration-300">
                <FiFacebook className="text-lg" />
              </a>
              <a href="#" className="p-2 bg-[#FFAAAA] rounded-full text-gray-700 hover:bg-[#FF9898] transition-colors duration-300">
                <FiYoutube className="text-lg" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  Explore Frames
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#FF9898] text-lg mt-1" />
                <span className="text-gray-600">
                  123 Creative Street, Design City, 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[#FF9898] text-lg" />
                <a href="mailto:hello@snaplove.com" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  hello@snaplove.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-[#FF9898] text-lg" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-[#FF9898] transition-colors duration-300">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white border border-gray-200 rounded-l-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF9898] flex-grow"
              />
              <button className="bg-[#FF9898] hover:bg-[#FFAAAA] text-white rounded-r-full px-4 transition-colors duration-300">
                <FiSend />
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} SnapLove. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-gray-600 hover:text-[#FF9898] text-sm transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-[#FF9898] text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-[#FF9898] text-sm transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;