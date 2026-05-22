import React from 'react';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6 mt-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black italic text-orange-500 uppercase tracking-tighter">Zyngo</h2>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Built for Speed & Quality</p>
        </div>
        <div className="flex gap-6">
          <FiInstagram className="hover:text-orange-500 cursor-pointer" size={20} />
          <FiTwitter className="hover:text-orange-500 cursor-pointer" size={20} />
          <FiFacebook className="hover:text-orange-500 cursor-pointer" size={20} />
        </div>
      </div>
      <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-widest mt-10">
        © 2026 Zyngo Media. All nodes reserved.
      </p>
    </footer>
  );
};
export default Footer;