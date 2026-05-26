import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHeart, FiMapPin, FiPhone, FiMail, 
  FiFacebook, FiTwitter, FiInstagram, FiGithub,
  FiShoppingBag, FiTruck, FiUsers, FiShield,
  FiChevronRight, FiClock
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-all" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <FiShoppingBag className="text-white text-xl" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-800">
                Zyngo<span className="text-orange-500">.</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Delivering happiness to your doorstep. Fast, fresh, and always on time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all group">
                <FiFacebook className="text-gray-500 group-hover:text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all group">
                <FiTwitter className="text-gray-500 group-hover:text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all group">
                <FiInstagram className="text-gray-500 group-hover:text-white text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all group">
                <FiGithub className="text-gray-500 group-hover:text-white text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/my-orders" text="My Orders" />
              <FooterLink to="/cart" text="Cart" />
              <FooterLink to="/" text="Offers" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full" />
              Support
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/" text="Help Center" />
              <FooterLink to="/" text="Terms of Service" />
              <FooterLink to="/" text="Privacy Policy" />
              <FooterLink to="/" text="Refund Policy" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full" />
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <FiMapPin className="text-orange-500 text-base" />
                <span>Bhagalpur, Bihar, India</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <FiPhone className="text-orange-500 text-base" />
                <a href="tel:+919876543210" className="hover:text-orange-500 transition-all">
                  +91 7541840606
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <FiMail className="text-orange-500 text-base" />
                <a href="mailto:support@zyngo.com" className="hover:text-orange-500 transition-all">
                  support@zyngo.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <FiClock className="text-orange-500 text-base" />
                <span>9 AM - 11 PM | All Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-black text-orange-500">500+</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Partner Restaurants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-orange-500">10k+</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-orange-500">50+</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Delivery Partners</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-orange-500">30min</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Avg Delivery Time</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-xs text-gray-500">
              © {currentYear} Zyngo. All rights reserved. Made with{' '}
              <FiHeart className="inline text-red-500 animate-pulse" size={12} /> in India
            </p>
            <div className="flex gap-4">
              <span className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <FiShield size={10} /> Secure Payments
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <FiTruck size={10} /> Fast Delivery
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <FiUsers size={10} /> 24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Link Component
function FooterLink({ to, text }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-500 text-sm hover:text-orange-500 transition-all flex items-center gap-1 group"
      >
        <FiChevronRight className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all text-xs" />
        {text}
      </Link>
    </li>
  );
}

export default Footer;