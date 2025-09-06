import Link from "next/link";
import Image from "next/image";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiSend, FiMail, FiMapPin, FiPhone, FiHeart } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Discover", href: "/discover" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" }
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Community Guidelines", href: "/guidelines" },
    { name: "Licenses", href: "/licenses" }
  ];

  const socialLinks = [
    { icon: FiInstagram, href: "#", color: "from-[#FFE99A] to-[#FFD586]", hoverColor: "hover:shadow-[#FFE99A]/30" },
    { icon: FiTwitter, href: "#", color: "from-[#C9A7FF] to-[#B794F6]", hoverColor: "hover:shadow-[#C9A7FF]/30" },
    { icon: FiFacebook, href: "#", color: "from-[#A8EECC] to-[#81E6D9]", hoverColor: "hover:shadow-[#A8EECC]/30" },
    { icon: FiYoutube, href: "#", color: "from-[#FF9898] to-[#FFAAAA]", hoverColor: "hover:shadow-[#FF9898]/30" }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#FAFBFF] via-[#F8F9FF] to-[#F5F7FA] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFE99A]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FF9898]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="pt-20 pb-16">
          <div className="container-custom max-w-6xl">
            <div className="bg-gradient-to-r from-[#FF9898] via-[#FFAAAA] to-[#FFE99A] rounded-3xl p-8 md:p-12 shadow-2xl shadow-[#FF9898]/20 relative overflow-hidden">
              {/* Newsletter background elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/4 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                <div className="max-w-lg text-center lg:text-left">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                    Stay Updated with SnapLove
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Subscribe to our newsletter and be the first to know about new frames, features, and community highlights.
                  </p>
                </div>
                
                <div className="w-full lg:w-auto">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative flex">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full lg:w-80 py-4 px-6 pr-16 rounded-full bg-white/95 backdrop-blur-sm border-0 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg text-gray-800 placeholder-gray-500 transition-all"
                      />
                      <button className="absolute right-2 top-2 bg-gradient-to-r from-[#FF9898] to-[#FFAAAA] hover:from-[#FFAAAA] hover:to-[#FF9898] text-white p-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                        <FiSend className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="pb-12">
          <div className="container-custom max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* About SnapLove */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <Image
                    src="/images/assets/Logo/snaplove-logo-black.png"
                    alt="SnapLove Logo"
                    width={160}
                    height={50}
                    className="h-12 w-auto"
                  />
                </div>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md">
                  SnapLove is a creative platform where memories come to life. Share your moments with beautiful frames created by our amazing community.
                </p>
                
                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <Link 
                        key={index}
                        href={social.href} 
                        className={`bg-gradient-to-br ${social.color} p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-110 shadow-md ${social.hoverColor} hover:shadow-lg group`}
                      >
                        <IconComponent className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-gray-800">Quick Links</h4>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href} 
                        className="text-gray-600 hover:text-[#FF9898] transition-all duration-300 flex items-center group hover:translate-x-1"
                      >
                        <div className="w-0 group-hover:w-6 overflow-hidden transition-all duration-300 flex items-center">
                          <div className="w-2 h-2 bg-[#FF9898] rounded-full mr-2"></div>
                        </div>
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal & Support */}
              <div>
                <h4 className="text-xl font-bold mb-6 text-gray-800">Legal & Support</h4>
                <ul className="space-y-4">
                  {legalLinks.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href} 
                        className="text-gray-600 hover:text-[#FF9898] transition-all duration-300 flex items-center group hover:translate-x-1"
                      >
                        <div className="w-0 group-hover:w-6 overflow-hidden transition-all duration-300 flex items-center">
                          <div className="w-2 h-2 bg-[#FF9898] rounded-full mr-2"></div>
                        </div>
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/40">
              <h4 className="text-xl font-bold mb-6 text-gray-800 text-center">Get in Touch</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FFE99A]/20 to-[#FFD586]/20 group hover:scale-105 transition-transform">
                  <div className="bg-gradient-to-br from-[#FFE99A] to-[#FFD586] p-3 rounded-2xl shadow-md">
                    <FiMapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Address</p>
                    <p className="text-xs text-gray-600">123 Love Street, Snapville</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#C9A7FF]/20 to-[#B794F6]/20 group hover:scale-105 transition-transform">
                  <div className="bg-gradient-to-br from-[#C9A7FF] to-[#B794F6] p-3 rounded-2xl shadow-md">
                    <FiMail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <a href="mailto:hello@snaplove.com" className="text-xs text-gray-600 hover:text-[#FF9898] transition-colors">
                      hello@snaplove.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#FF9898]/20 to-[#FFAAAA]/20 group hover:scale-105 transition-transform">
                  <div className="bg-gradient-to-br from-[#FF9898] to-[#FFAAAA] p-3 rounded-2xl shadow-md">
                    <FiPhone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Phone</p>
                    <a href="tel:+11234567890" className="text-xs text-gray-600 hover:text-[#FF9898] transition-colors">
                      +1 (123) 456-7890
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/30 backdrop-blur-sm">
          <div className="container-custom max-w-6xl py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm text-center md:text-left">
                © {currentYear} SnapLove. All rights reserved. Made with{" "}
                <FiHeart className="inline-block text-[#FF9898] h-4 w-4 animate-pulse" />{" "}
                for photo lovers everywhere
              </p>
              <div className="flex gap-6">
                <Link href="/terms" className="text-gray-500 hover:text-[#FF9898] text-sm transition-colors font-medium">
                  Terms
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-[#FF9898] text-sm transition-colors font-medium">
                  Privacy
                </Link>
                <Link href="/cookies" className="text-gray-500 hover:text-[#FF9898] text-sm transition-colors font-medium">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;