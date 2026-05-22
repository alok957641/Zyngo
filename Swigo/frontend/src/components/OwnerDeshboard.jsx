import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OwnerNav from "./OwnerNav";
import axios from "axios";
import { IoWalletOutline } from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import { FiEdit3, FiPlus, FiStar, FiPower, FiLoader } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import OwnerItemCard from "./OwnerItemCard";
import useGetMyOrders from "../hooks/useGetMyOrders";

const serverurl = "http://localhost:8000";

function OwnerDeshboard() {
  const navigate = useNavigate();
  useGetMyOrders();

  const { userData, myOrders } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  const [isShopOnline, setIsShopOnline] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    if (userData) setIsShopOnline(userData.isOnline !== false);
  }, [userData]);

  const orders = myOrders || [];
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  const handleStatusToggle = async () => {
    try {
      setToggleLoading(true);
      const res = await axios.post(`${serverurl}/api/user/toggle-availability`, {}, { withCredentials: true });
      if (res.data.success) setIsShopOnline(res.data.isOnline);
    } catch (err) { alert("Status update sync failed!"); }
    finally { setToggleLoading(false); }
  };

  // --- 🔥 LOGIC FIX: LOADING vs NO SHOP ---
  if (myShopData === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (myShopData === null) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] p-6 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">No Shop Found</h2>
        <Link to="/CreateAndEditShop" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all">
          CREATE MY SHOP
        </Link>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] flex flex-col font-sans relative overflow-x-hidden">
      <OwnerNav />
      <div className="flex-grow flex flex-col items-center p-4 sm:p-8 relative gap-10">
        <div className="w-full max-w-5xl z-10 flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Shop Operations</p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">{myShopData.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleStatusToggle} disabled={toggleLoading} className={`px-5 py-4 rounded-3xl font-black text-[10px] flex items-center gap-2 border ${isShopOnline ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
                <FiPower className={toggleLoading ? "animate-spin" : ""} size={14} />
                {isShopOnline ? "● KITCHEN LIVE" : "○ KITCHEN CLOSED"}
              </button>
              <Link to="/AddItem" className="bg-slate-900 text-white px-6 py-4 rounded-3xl font-black text-[10px] hover:bg-orange-600 transition-all flex items-center gap-2">
                <FiPlus /> ADD DISH
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                <h3 className="text-4xl font-black italic">{orders.length}</h3>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Net Sales</p>
                <h3 className="text-4xl font-black italic">₹{totalRevenue}</h3>
             </div>
          </div>

          <div className={`w-full bg-white rounded-[3rem] border p-6 flex flex-col md:flex-row ${!isShopOnline ? 'border-red-500/20' : 'border-gray-100'}`}>
            <img src={myShopData.image} className="w-full md:w-1/2 h-60 object-cover rounded-2xl" alt="shop" />
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <p className="font-bold text-gray-500 flex items-center gap-2"><FaMapLocationDot /> {myShopData.address}</p>
              <Link to="/CreateAndEditShop" className="mt-4 text-[10px] font-black uppercase text-orange-500"><FiEdit3 className="inline"/> Manage Store</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myShopData.items?.map((item, index) => (
              <div key={index} className={!isShopOnline ? "opacity-50" : ""}>
                 <OwnerItemCard data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDeshboard;