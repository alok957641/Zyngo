import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* 1. Brand Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Zyngo</h2>
          <p className="text-sm text-gray-400">
            © 2026 Zyngo Technologies Private Limited.
          </p>
        </div>

        {/* 2. Company Links */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-orange-500">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-orange-500">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-orange-500">Blog</Link></li>
          </ul>
        </div>

        {/* 3. Support Links */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-orange-500">Help Center</Link></li>
            <li><Link to="/safety" className="hover:text-orange-500">Safety</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* 4. Social & Apps */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Connect</h4>
          <div className="flex gap-4 mb-6">
            <a href="#" className="text-xl hover:text-orange-500"><FaFacebook /></a>
            <a href="#" className="text-xl hover:text-orange-500"><FaInstagram /></a>
            <a href="#" className="text-xl hover:text-orange-500"><FaTwitter /></a>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-orange-700 transition">
            Get Partner App
          </button>
        </div>
      </div>
      
      {/* Bottom Line */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        Built with passion for the people of Bhagalpur.
      </div>
    </footer>
  );
}

export default Footer;