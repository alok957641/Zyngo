import React, { useState } from 'react';
import { FiGrid, FiUsers, FiDollarSign, FiTruck, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#020617] flex">
      {/* Mobile Toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-6 right-6 z-[60] p-3 bg-orange-600 text-white rounded-xl shadow-lg">
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 p-8 bg-[#090d1f] border-r border-white/5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-10">Admin<span className="text-orange-500">.</span></h1>
        
        <nav className="flex flex-col gap-3">
          <SidebarLink to="/admin/dashboard" icon={<FiGrid />} label="Overview" active={location.pathname === "/admin/dashboard"} />
          <SidebarLink to="/admin/payouts" icon={<FiDollarSign />} label="Payouts" active={location.pathname === "/admin/payouts"} />
          <SidebarLink to="/admin/riders" icon={<FiTruck />} label="Delivery Fleet" active={location.pathname === "/admin/riders"} />
          <SidebarLink to="/admin/restaurants" icon={<FiUsers />} label="Restaurants" active={location.pathname === "/admin/restaurants"} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} label="Settings" active={location.pathname === "/admin/settings"} />
        </nav>
      </aside>

      {/* Main Content Area - YAHAN EK HI OUTLET HOGA */}
      <main className="flex-1 min-h-screen p-6 md:p-12 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] ${active ? 'bg-orange-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}>
    {icon} <span className="font-black text-[10px] uppercase">{label}</span>
  </Link>
);

export default AdminSidebar;