import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; // useNavigate add kiya
import { FiUsers, FiShoppingBag, FiTruck, FiActivity, FiLoader, FiLogOut } from "react-icons/fi"; // FiLogOut import kiya

const serverurl = "https://zyngo.onrender.com";

const AdminDashboardOverview = () => {
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
        await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true });
    } catch (err) { console.error("Logout failed"); }
    finally {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/signin");
        window.location.reload();
    }
  };

  if (loading) return <div className="flex justify-center py-20 text-orange-500"><FiLoader className="animate-spin text-3xl" /></div>;

  return (
    <div className="w-full text-slate-200 animate-in fade-in duration-500">
      {/* 🔝 TITLE & LOGOUT SECTION */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Live System Pulse</h2>
          <p className="text-orange-500 text-[10px] font-black tracking-[4px] uppercase italic">Real-time DB Analytics</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500/20 transition-all"
        >
          <FiLogOut size={14} /> Logout
        </button>
      </div>

      {/* 📊 GRID */}
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

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.03] transition-all">
    <div className="mb-4 text-2xl">{icon}</div>
    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{label}</p>
    <h3 className="text-4xl font-black text-white italic mt-1">{value}</h3>
  </div>
);

export default AdminDashboardOverview;