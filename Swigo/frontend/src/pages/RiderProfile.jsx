import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    FiUser, FiLogOut, FiMapPin, FiCalendar, 
    FiTruck, FiShield, FiChevronRight, FiEdit2, FiPhone, FiHome, FiPieChart, FiTrendingUp
} from "react-icons/fi";
import axios from "axios";

const serverurl = "https://zyngo.onrender.com";

const RiderProfile = () => {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);

    // 🗓️ Joining Date Logic
    const joiningDate = userData?.createdAt 
        ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
        : "May 2026";

 const handleLogout = async () => {
    try {
        // 1. Backend call to destroy cookie
        await axios.get(`${serverurl}/api/auth/signout`, { withCredentials: true });
    } catch (err) {
        console.error("Backend logout call failed, forcing client-side logout...");
    } finally {
        // 2. Clear Redux
        dispatch(setUserData(null));
        
        // 3. Clear Local Storage
        localStorage.clear();
        sessionStorage.clear();
        
        // 4. Force browser to clear everything and redirect
        window.location.href = "/signin";
    }
};

    return (
        <div className="min-h-screen bg-[#020617] font-sans pb-32 text-slate-200 selection:bg-orange-500/20 overflow-x-hidden">
            
            {/* 🔝 REFINED PROFILE HEADER HERO */}
            <div className="relative pt-12 pb-8 px-6 bg-gradient-to-br from-[#090d1f] to-[#020617] border-b border-white/[0.03] shadow-2xl flex flex-col items-center">
                <div className="relative flex flex-col items-center max-w-5xl w-full">
                    
                    {/* Compact Avatar Structure */}
                    <div className="w-24 h-24 border border-white/10 p-1 bg-[#090d1f] shadow-2xl relative rounded-[1.5rem] overflow-visible">
                        {userData?.image ? (
                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover rounded-[1.2rem]" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-600 text-3xl font-black text-white rounded-[1.2rem]">
                                {userData?.fullname?.charAt(0)}
                            </div>
                        )}
                        <button className="absolute -bottom-1 -right-1 bg-white hover:bg-orange-600 text-[#070B14] hover:text-white p-2 rounded-xl border border-white/5 shadow-xl active:scale-90 transition-all duration-200">
                            <FiEdit2 size={12} />
                        </button>
                    </div>
                    
                    <h2 className="mt-4 text-xl font-black text-white tracking-tight uppercase">{userData?.fullname || "Rider Node"}</h2>
                    
                    <div className="mt-2 px-3 py-1 bg-green-500/5 border border-green-500/10 flex items-center gap-1.5 rounded-lg">
                        <FiShield className="text-green-400" size={12} />
                        <p className="text-[8px] font-black text-green-400 tracking-[1.5px] uppercase leading-none">Verified Core Rider</p>
                    </div>
                </div>
            </div>

            {/* 📊 CORE INFO METRICS GRID */}
            <main className="max-w-5xl mx-auto px-4 mt-4 relative z-20 space-y-4">
                
                <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-white/[0.01] border border-white/5 p-4 flex flex-col items-center rounded-2xl">
                        <FiCalendar className="text-orange-500 mb-2" size={18} />
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Service Period</p>
                        <h4 className="text-xs font-black text-white tracking-tight uppercase mt-0.5">{joiningDate}</h4>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 p-4 flex flex-col items-center rounded-2xl">
                        <FiTruck className="text-blue-400 mb-2" size={18} />
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Node Vehicle</p>
                        <h4 className="text-xs font-black text-white tracking-tight uppercase mt-0.5">{userData?.vehicleModel || "Active Bike"}</h4>
                    </div>
                </div>

                {/* 📋 CONFIG LIST OPTIONS */}
                <div className="bg-white/[0.01] border border-white/5 rounded-[1.5rem] overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.03] bg-white/[0.005]">
                        <h3 className="text-[8px] font-black text-slate-500 uppercase tracking-[3px]">System Configuration</h3>
                    </div>
                    
                    <div className="divide-y divide-white/[0.02]">
                        {/* Mobile Node Option */}
                        <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-all group active:scale-[0.99]">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 rounded-lg"><FiPhone size={14} /></div>
                                <div>
                                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Emergency Contact</p>
                                    <p className="text-xs font-bold text-slate-200 mt-0.5">{userData?.mobile || "Not Linked"}</p>
                                </div>
                            </div>
                            <FiChevronRight className="text-slate-600 group-hover:text-orange-500 transition-all" size={14} />
                        </div>

                        {/* Location Node Option */}
                        <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-all group active:scale-[0.99]">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 rounded-lg"><FiMapPin size={14} /></div>
                                <div>
                                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Operational Sector</p>
                                    <p className="text-xs font-bold text-slate-200 mt-0.5 uppercase">{userData?.city || "Bhagalpur Node"}</p>
                                </div>
                            </div>
                            <FiChevronRight className="text-slate-600 group-hover:text-orange-500 transition-all" size={14} />
                        </div>
                    </div>
                </div>

                {/* 🚪 DANGER TERMINAL SESSION DISCONNECT */}
                <div className="pt-2">
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout} 
                        className="w-full bg-red-600/5 hover:bg-red-600/10 border border-red-500/10 text-red-400 py-4 font-black uppercase tracking-[3px] text-[9px] shadow-xl rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        <FiLogOut size={14} /> Disconnect Session
                    </motion.button>
                </div>

                <div className="py-2 text-center">
                    <p className="text-[8px] font-mono font-black text-slate-700 uppercase tracking-[4px]">Build 1.0.4-Stable</p>
                </div>
            </main>

            {/* 📱 NAVIGATION DOCK: FIXED SLICK BOTTOM BAR */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#020617]/90 backdrop-blur-md border-t border-white/[0.03] flex items-center justify-around z-[5000]">
                <button onClick={() => navigate("/rider/dashboard")} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 transition-all"><FiHome size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Radar</span></button>
                <button onClick={() => navigate("/rider/history")} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 transition-all"><FiPieChart size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Logs</span></button>
                <button onClick={() => navigate("/rider/earnings")} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-300 transition-all"><FiTrendingUp size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Earn</span></button>
                <button onClick={() => navigate("/rider/profile")} className="flex flex-col items-center gap-0.5 text-orange-500"><FiUser size={18} /><span className="text-[8px] font-black uppercase tracking-wider">Self</span></button>
            </nav>
        </div>
    );
};

export default RiderProfile;