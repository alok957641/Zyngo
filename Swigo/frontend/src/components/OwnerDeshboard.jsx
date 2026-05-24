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

const serverurl = "https://zyngo.onrender.com";

// ✅ apiClient Definition (Fixed ReferenceError)
const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true,
});

function OwnerDeshboard() {
  const navigate = useNavigate();

  // 1. Hook ko call karo (Isse data Redux mein jayega)
  useGetMyOrders();

  const { userData, myOrders } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  // Local state taaki switch click karte hi screen par live responsive change dikhe
  const [isShopOnline, setIsShopOnline] = useState(
    userData?.isOnline !== false,
  );
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
  const totalRevenue = orders.reduce((acc, order) => {
    // Har order ke andar jitne shopOrders hain, unka subtotal add karo
    const shopTotal = order.shopOrders.reduce(
      (sum, so) => sum + (Number(so.subtotal) || 0),
      0,
    );
    return acc + shopTotal;
  }, 0);

  const handleStatusToggle = async () => {
    try {
      setToggleLoading(true);
      const res = await apiClient.post(`/api/user/toggle-availability`);

      if (res.data.success) {
        setIsShopOnline(res.data.isOnline);
        alert(
          `🎉 Store status updated to: ${res.data.isOnline ? "ONLINE" : "OFFLINE"}`,
        );
      }
    } catch (err) {
      console.error("Network Status Switch Mismatch:", err);
      alert("Session expired! Please login again.");
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
                <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1 italic">
                  Shop Operations
                </p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                  {myShopData.name}
                </h1>
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
                  <FiPower
                    className={toggleLoading ? "animate-spin" : ""}
                    size={14}
                  />
                  {isShopOnline ? "● KITCHEN LIVE" : "○ KITCHEN CLOSED"}
                </button>

                <button
                  onClick={() => navigate("/owner/earnings")}
                  className="bg-white border border-gray-200 px-5 py-4 rounded-3xl shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all font-black text-[10px]"
                >
                  <IoWalletOutline size={16} className="text-orange-500" />{" "}
                  WALLET
                </button>
                <Link
                  to="/AddItem"
                  className="bg-slate-900 text-white px-6 py-4 rounded-3xl font-black text-[10px] hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                >
                  <FiPlus /> ADD DISH
                </Link>
              </div>
            </div>

            {/* 📊 STATS MATRIX GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Total Orders
                </p>
                <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">
                  {orders.length}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Net Sales
                </p>
                <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">
                  ₹{totalRevenue}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Live Items
                </p>
                <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">
                  {myShopData?.items?.length || 0}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Rating
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter">
                    {myShopData?.ratings || myShopData?.rating || "4.8"}
                  </h3>
                  <FiStar className="text-orange-500 fill-orange-500" />
                </div>
              </div>
            </div>

            {/* 🔥 PREMIUM SHOP HEADER CARD */}
            <div
              className={`w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col md:flex-row transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] ${!isShopOnline ? "opacity-80" : ""}`}
            >
              {/* Left: Image Side */}
              <div className="md:w-5/12 relative h-[280px] md:h-auto overflow-hidden group">
                <img
                  src={myShopData.image}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isShopOnline ? "grayscale" : ""}`}
                  alt="shop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Status Badge */}
                <div
                  className={`absolute top-6 left-6 px-4 py-2 rounded-2xl backdrop-blur-md border ${
                    isShopOnline
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/20 border-red-500/30 text-red-300"
                  }`}
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    {isShopOnline
                      ? "● Store Operational"
                      : "○ Currently Closed"}
                  </span>
                </div>

                {/* Shop Name */}
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                    {myShopData.name}
                  </h2>
                </div>
              </div>

              {/* Right: Info Side */}
              <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                      Store Profile
                    </p>
                    <Link
                      to="/CreateAndEditShop"
                      className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-[0.2em]"
                    >
                      <FiEdit3 /> Edit Details
                    </Link>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                        <FaMapLocationDot size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          Store Address
                        </p>
                        <p className="text-sm font-bold text-gray-800 leading-snug">
                          {myShopData.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-10 pt-6 border-t border-gray-50 flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      Items
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {myShopData?.items?.length || 0}
                    </p>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                      Rating
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      {myShopData?.ratings || "4.8"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* INVENTORY LOGS */}
            <div className="flex flex-col gap-6 mb-20">
              <h2 className="text-2xl font-black text-gray-800 tracking-tighter italic uppercase">
                Inventory Logs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {myShopData?.items?.map((item, index) => (
                  // 🔥 LOGIC: Agar poora kitchen offline hai, toh inventory items cards par automatic smooth opacity logic shift chalega
                  <div
                    key={index}
                    className={
                      !isShopOnline
                        ? "opacity-50 pointer-events-none select-none transition-all duration-300"
                        : "transition-all duration-300"
                    }
                  >
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
