import React, { useRef, useEffect, useState } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OwnerNav from "./OwnerNav";
import { motion } from "framer-motion";
import axios from "axios";

// Hook call sirf data fetch trigger karne ke liye
import useGetMyOrders from "../hooks/useGetMyOrders"; 

// Icons
import { IoNotificationsOutline, IoWalletOutline } from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import { FiEdit3, FiPlus, FiStar, FiRadio, FiPower } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import OwnerItemCard from "./OwnerItemCard";

const serverurl = import.meta.env.VITE_API_URL;

function OwnerDeshboard() {
  const navigate = useNavigate();
  
  // 1. Hook ko call karo (Isse data Redux mein jayega)
  useGetMyOrders(); 

  const { userData, myOrders } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  // Local state taaki switch click karte hi screen par live responsive change dikhe
  const [isShopOnline, setIsShopOnline] = useState(userData?.isOnline !== false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Sync state with incoming Redux data wrapper
  useEffect(() => {
    if (userData) {
      setIsShopOnline(userData.isOnline !== false);
    }
  }, [userData]);

  // Orders array safely handled
  const orders = myOrders || [];

  // Revenue Calculate (Safe Logic)
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  // 🔥 CORE LIVE/OFFLINE NETWORK SWITCH INTERCEPTOR
  const handleStatusToggle = async () => {
    try {
      setToggleLoading(true);
      
      // Backend global endpoint pipeline ko hit kiya state invert karne ke liye
      const res = await axios.post(`${serverurl}/api/user/toggle-availability`, {}, { withCredentials: true });
      
      if (res.data.success) {
        setIsShopOnline(res.data.isOnline);
        alert(`🎉 Store status updated to: ${res.data.isOnline ? "ONLINE" : "OFFLINE"}`);
      }
    } catch (err) {
      console.error("Network Status Switch Mismatch:", err);
      alert("Status update sync failed with core node!");
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] flex flex-col font-sans relative overflow-x-hidden">
      <OwnerNav />

      <div className="flex-grow flex flex-col items-center p-4 sm:p-8 relative gap-10">
        {!myShopData ? (
          <div className="py-20 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full max-w-5xl z-10 flex flex-col gap-8">
            
            {/* TOP BAR GRID CONTROL SYSTEM */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1 italic">Shop Operations</p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">{myShopData.name}</h1>
              </div>

              {/* ACTION TOOLS BOX CONTAINER */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* 🔥 THE CHIEF TOGGLE SWITCH: Live status manager */}
                <button
                  onClick={handleStatusToggle}
                  disabled={toggleLoading}
                  className={`px-5 py-4 rounded-3xl font-black text-[10px] tracking-wider transition-all duration-300 flex items-center gap-2 border shadow-sm ${
                    isShopOnline 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20" 
                      : "bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20 animate-pulse"
                  }`}
                >
                  <FiPower className={toggleLoading ? "animate-spin" : ""} size={14} />
                  {isShopOnline ? "● KITCHEN LIVE" : "○ KITCHEN CLOSED"}
                </button>

                <button onClick={() => navigate('/owner/earnings')} className="bg-white border border-gray-200 px-5 py-4 rounded-3xl shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all font-black text-[10px]">
                  <IoWalletOutline size={16} className="text-orange-500" /> WALLET
                </button>
                <Link to="/AddItem" className="bg-slate-900 text-white px-6 py-4 rounded-3xl font-black text-[10px] hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                  <FiPlus /> ADD DISH
                </Link>
              </div>
            </div>

            {/* 📊 STATS MATRIX GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
                  <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">{orders.length}</h3>
               </div>

               <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Net Sales</p>
                  <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">₹{totalRevenue}</h3>
               </div>

               <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Items</p>
                  <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">{myShopData?.items?.length || 0}</h3>
               </div>

               <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Rating</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">{myShopData?.ratings || myShopData?.rating || "4.8"}</h3>
                    <FiStar className="text-orange-500 fill-orange-500" />
                  </div>
               </div>
            </div>

            {/* SHOP DETAILS HEADER CARD (With Offline Interceptor Mask) */}
            <div className={`w-full bg-white rounded-[3rem] shadow-sm overflow-hidden border flex flex-col md:flex-row transition-all duration-300 ${!isShopOnline ? 'border-red-500/20 ring-4 ring-red-500/5' : 'border-gray-100'}`}>
              <div className="md:w-1/2 relative h-[250px] md:h-auto overflow-hidden">
                <img src={myShopData.image} className={`w-full h-full object-cover transition-all duration-300 ${!isShopOnline ? 'grayscale blur-[1px]' : ''}`} alt="shop" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* 🛑 DYNAMIC CLOSED MASK LOG OVERLAY */}
                {!isShopOnline && (
                  <div className="absolute top-6 right-6 bg-red-600 text-white font-mono font-black text-[8px] tracking-[3px] uppercase px-3 py-1.5 rounded-xl shadow-xl border border-red-500/20">
                     STORE OFFLINE
                  </div>
                )}

                <div className="absolute bottom-6 left-8 text-white">
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{myShopData.name}</h2>
                </div>
              </div>
              
              <div className="md:w-1/2 p-10 flex flex-col justify-center relative">
                <div className="flex items-start gap-4 mb-8 text-left">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><FaMapLocationDot /></div>
                  <p className="text-gray-500 font-bold text-sm leading-relaxed">{myShopData.address}</p>
                </div>
                <Link to="/CreateAndEditShop" className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-orange-500 transition-all uppercase tracking-[0.2em]">
                  <FiEdit3 /> Manage Store <MdArrowForward />
                </Link>
              </div>
            </div>

            {/* INVENTORY LOGS */}
            <div className="flex flex-col gap-6 mb-20">
               <h2 className="text-2xl font-black text-gray-800 tracking-tighter italic uppercase">Inventory Logs</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {myShopData?.items?.map((item, index) => (
                  // 🔥 LOGIC: Agar poora kitchen offline hai, toh inventory items cards par automatic smooth opacity logic shift chalega
                  <div key={index} className={!isShopOnline ? "opacity-50 pointer-events-none select-none transition-all duration-300" : "transition-all duration-300"}>
                     <OwnerItemCard data={item} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDeshboard;