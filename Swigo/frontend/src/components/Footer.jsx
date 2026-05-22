import React from 'react';
import { FiInstagram, FiTwitter, FiFacebook, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#FDFCFB] text-[#535665] py-16 px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black italic text-slate-900">Zyngo</h2>
          <p className="text-[12px] font-medium">© 2026 Zyngo Technologies</p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-slate-900 mb-2">Company</h3>
          <a href="#" className="text-sm hover:text-orange-500 transition">About</a>
          <a href="#" className="text-sm hover:text-orange-500 transition">Careers</a>
          <a href="#" className="text-sm hover:text-orange-500 transition">Team</a>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-slate-900 mb-2">Contact</h3>
          <a href="#" className="text-sm hover:text-orange-500 transition">Help & Support</a>
          <a href="#" className="text-sm hover:text-orange-500 transition">Partner with us</a>
          <a href="#" className="text-sm hover:text-orange-500 transition">Ride with us</a>
        </div>

        {/* Legal/Social */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-slate-900">Legal</h3>
          <div className="flex gap-4">
            <FiInstagram size={20} className="cursor-pointer hover:text-orange-500" />
            <FiTwitter size={20} className="cursor-pointer hover:text-orange-500" />
            <FiFacebook size={20} className="cursor-pointer hover:text-orange-500" />
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
        Zyngo is currently serving selected nodes. Stay tuned for expansion!
      </div>
    </footer>
  );
};

export default Footer;