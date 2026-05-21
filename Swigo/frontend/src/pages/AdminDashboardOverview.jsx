import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { FiUsers, FiShoppingBag, FiTruck, FiActivity, FiLoader } from "react-icons/fi";

const serverurl = import.meta.env.VITE_API_URL;

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalShops: 0, totalRiders: 0, activeOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/admin/stats`, { withCredentials: true });
        if (res.data.success) setStats(res.data.stats);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchRealStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-orange-500"><FiLoader className="animate-spin text-3xl" /></div>;

  return (
    <div className="w-full text-slate-200 animate-in fade-in duration-500">
      {/* 🔝 TITLE SECTION */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Live System Pulse</h2>
        <p className="text-orange-500 text-[10px] font-black tracking-[4px] uppercase italic">Real-time DB Analytics</p>
      </div>

      {/* 📊 GRID - Sirf ek baar render hoga */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FiActivity className="text-orange-500" />} label="Active Orders" value={stats.activeOrders} />
        <StatCard icon={<FiTruck className="text-blue-500" />} label="Delivery Boys" value={stats.totalRiders} />
        <StatCard icon={<FiShoppingBag className="text-green-500" />} label="Active Restaurants" value={stats.totalShops} />
        <StatCard icon={<FiUsers className="text-purple-500" />} label="Registered Users" value={stats.totalUsers} />
      </div>

      {/* FOOTER */}
      <div className="mt-10 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
        <h4 className="text-white font-black italic uppercase">Status: Connected to Database</h4>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live data streaming from MongoDB.</p>
      </div>
    </div>
  );
};

// Helper Component to avoid code duplication
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.03] transition-all">
    <div className="mb-4 text-2xl">{icon}</div>
    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{label}</p>
    <h3 className="text-4xl font-black text-white italic mt-1">{value}</h3>
  </div>
);

export default AdminDashboardOverview;