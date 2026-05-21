import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTruck, FiUser, FiMapPin, FiPhone, FiLoader, FiTrendingUp, FiActivity } from "react-icons/fi";

const serverurl = "http://localhost:8000";

const AdminRiderManagement = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/admin/riders/all`, { withCredentials: true });
        if (res.data.success) setRiders(res.data.riders);
      } catch (err) {
        console.error("Rider fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRiders();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <FiLoader className="animate-spin text-3xl text-orange-500 mb-3" />
      <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 font-mono">Syncing Fleet Nodes...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto px-2">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Rider Fleet</h2>
        <p className="text-orange-500 text-[9px] font-black tracking-[3px] uppercase">Live Delivery Force Management</p>
      </div>

      {/* RIDERS LIST GRID */}
      <div className="flex flex-col gap-3">
        {riders.map((rider) => (
          <div key={rider._id} className="bg-white/[0.01] border border-white/5 p-5 rounded-[1.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.03] transition-all duration-300">
            
            {/* LEFT SECTION: AVATAR & CREDENTIALS */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-lg text-slate-400">
                <FiUser size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] font-black text-green-400 uppercase tracking-wider">Node Online</span>
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">{rider.fullname}</h3>
                <div className="flex gap-4 mt-1">
                  <p className="text-slate-500 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                    <FiPhone size={12} /> {rider.mobile || "No Contact"}
                  </p>
                  <p className="text-slate-500 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                    <FiMapPin size={12} /> Bhagalpur
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION: MULTI-BALANCE METRICS GRID */}
            <div className="flex items-center gap-6 border-t border-white/[0.02] md:border-none pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
              
              {/* METRIC 1: AVAILABLE BALANCE (BACHAA PAISA) */}
              <div className="text-left md:text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-0.5 flex items-center md:justify-end gap-1">
                  <FiActivity size={10} className="text-orange-500" /> Available Balance
                </p>
                <h4 className="text-xl font-black text-orange-500 tracking-tight">₹{rider.wallet || 0}</h4>
              </div>

              {/* VERTICAL SEPARATOR LINE */}
              <div className="h-8 w-[1px] bg-white/5 hidden sm:block"></div>

              {/* METRIC 2: LIFETIME PROFIT (TOTAL KAMAI - FIXED 🔥) */}
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1">
                  <FiTrendingUp size={10} className="text-orange-400" /> Lifetime Profit
                </p>
                <h4 className="text-xl font-black text-orange-400 tracking-tight">
                  {/* 🔥 DUMMY CODING REMOVED: Ab seedhe database ka real field chamkega */}
                  ₹{rider.lifetimeEarnings || 0}
                </h4>
              </div>

            </div>

          </div>
        ))}

        {/* EMPTY STATE SCREEN */}
        {riders.length === 0 && (
          <div className="text-center py-16 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5">
            <FiTruck className="mx-auto text-slate-700 mb-3" size={36} />
            <p className="text-slate-500 font-black text-[9px] uppercase tracking-[3px]">No active delivery nodes found in fleet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRiderManagement;