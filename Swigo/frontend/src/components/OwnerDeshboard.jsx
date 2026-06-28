import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Components
import OwnerNav from "./OwnerNav";
import OwnerItemCard from "./OwnerItemCard";

// Icons
import { IoWalletOutline } from "react-icons/io5";
import { MdArrowForward, MdStorefront } from "react-icons/md";
import { FiEdit3, FiPlus, FiStar, FiPower, FiShoppingBag, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";

// Hooks
import useGetMyOrders from "../hooks/useGetMyOrders";
import useGetMyShop from "../hooks/useGetMyShop";
import { serverurl } from "../config/api.js";
const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true,
});

function OwnerDeshboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Fetch data
  const { myShopData, isLoading: isShopLoading } = useGetMyShop();
  useGetMyOrders();

  const { userData, myOrders } = useSelector((state) => state.user);
  
  // Local states
  const [isShopOnline, setIsShopOnline] = useState(userData?.isOnline !== false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Sync online status
  useEffect(() => {
    if (userData) {
      setIsShopOnline(userData.isOnline !== false);
    }
  }, [userData]);

  // Orders and revenue
  const orders = myOrders || [];
  const totalRevenue = orders.reduce((acc, order) => {
    const shopTotal = order.shopOrders?.reduce(
      (sum, so) => sum + (Number(so.subtotal) || 0), 0
    ) || 0;
    return acc + shopTotal;
  }, 0);

  // Handle status toggle
  const handleStatusToggle = async () => {
    try {
      setToggleLoading(true);
      const res = await apiClient.post(`/api/user/toggle-availability`);
      if (res.data.success) {
        setIsShopOnline(res.data.isOnline);
      }
    } catch (err) {
      console.error("Status Toggle Error:", err);
    } finally {
      setToggleLoading(false);
    }
  };

  // Loading state
  if (isShopLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCFB] flex flex-col">
        <OwnerNav />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading your shop...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 CASE 1: NO SHOP - Show Create Shop Card
  if (!myShopData || !myShopData._id) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col">
        <OwnerNav />
        <div className="flex-grow flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdStorefront className="text-white text-5xl" />
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter">
                Welcome to Zyngo! 🚀
              </h2>
              <p className="text-orange-100 mt-2 text-sm">
                Start your food delivery journey today
              </p>
            </div>
            
            {/* Content Section */}
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                You haven't created a shop yet. Create your shop to start receiving orders and grow your business.
              </p>
              
              {/* Features List */}
              <div className="flex flex-col gap-3 mb-8 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <FiPlus className="text-green-500 text-xs" />
                  </div>
                  <span>Easy shop setup in minutes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="text-green-500 text-xs" />
                  </div>
                  <span>Add unlimited menu items</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="text-green-500 text-xs" />
                  </div>
                  <span>Track orders and earnings</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/CreateAndEditShop")}
                className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <FiPlus className="text-lg" />
                Create Your Shop Now
              </button>
              <p className="text-xs text-gray-400 mt-4">
                ⚡ It takes less than 2 minutes to set up your shop
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 🔥 CASE 2: SHOP EXISTS - Show Dashboard
  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
      <OwnerNav />

      <div className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                Shop Operations
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter uppercase">
                {myShopData.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleStatusToggle}
                disabled={toggleLoading}
                className={`px-4 py-3 rounded-2xl font-black text-[10px] tracking-wider transition-all flex items-center gap-2 border ${
                  isShopOnline
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    : "bg-red-500/10 border-red-500/20 text-red-600"
                }`}
              >
                <FiPower className={toggleLoading ? "animate-spin" : ""} size={14} />
                {isShopOnline ? "● KITCHEN LIVE" : "○ KITCHEN CLOSED"}
              </button>

              <button
                onClick={() => navigate("/owner/earnings")}
                className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all font-black text-[10px]"
              >
                <IoWalletOutline size={16} className="text-orange-500" /> WALLET
              </button>
              
              <Link
                to="/AddItem"
                className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-black text-[10px] hover:bg-orange-600 transition-all flex items-center gap-2 shadow-md"
              >
                <FiPlus /> ADD DISH
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: orders.length, color: "blue" },
              { label: "Net Sales", value: `₹${totalRevenue}`, color: "green" },
              { label: "Live Items", value: myShopData?.items?.length || 0, color: "orange" },
              { label: "Rating", value: myShopData?.ratings || myShopData?.rating || "4.8", color: "yellow", icon: <FiStar className="text-yellow-500 fill-yellow-500" /> }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <div className="flex items-center gap-1">
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Shop Card */}
          <div className={`bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row transition-all ${!isShopOnline ? "opacity-80" : ""}`}>
            <div className="md:w-5/12 relative h-64 md:h-auto">
              <img
                src={myShopData.image}
                className={`w-full h-full object-cover ${!isShopOnline ? "grayscale" : ""}`}
                alt={myShopData.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-black ${
                isShopOnline 
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" 
                  : "bg-red-500/20 border-red-500/30 text-red-300"
              }`}>
                {isShopOnline ? "● LIVE" : "○ CLOSED"}
              </div>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-black text-white tracking-tighter">{myShopData.name}</h2>
              </div>
            </div>

            <div className="md:w-7/12 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[9px] font-black text-orange-500 uppercase tracking-wider">Store Profile</p>
                  <Link to="/CreateAndEditShop" className="flex items-center gap-1 text-[9px] font-black text-gray-400 hover:text-orange-600 transition-colors">
                    <FiEdit3 size={12} /> Edit
                  </Link>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <FaMapLocationDot className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">{myShopData.address}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-6">
                <div>
                  <p className="text-[8px] text-gray-400 uppercase font-black">Items</p>
                  <p className="text-lg font-black text-gray-800">{myShopData?.items?.length || 0}</p>
                </div>
                <div className="w-px bg-gray-200" />
                <div>
                  <p className="text-[8px] text-gray-400 uppercase font-black">Rating</p>
                  <p className="text-lg font-black text-gray-800">{myShopData?.ratings || "4.8"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          {myShopData?.items?.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-800 tracking-tighter uppercase">Menu Items</h2>
                <Link to="/AddItem" className="text-[9px] font-black text-orange-500 hover:text-orange-600 transition-colors">
                  + Add More
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {myShopData.items.map((item, index) => (
                  <div key={index} className={!isShopOnline ? "opacity-50 pointer-events-none" : ""}>
                    <OwnerItemCard data={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty Inventory Message */}
          {myShopData?.items?.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
              <FiShoppingBag className="text-3xl text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-black text-amber-800">Your Menu is Empty!</h3>
              <p className="text-sm text-amber-600 mt-1">Add your first dish to start attracting customers</p>
              <Link to="/AddItem" className="inline-block mt-4 bg-amber-600 text-white px-5 py-2 rounded-xl font-black text-xs hover:bg-amber-700 transition-all">
                + Add First Dish
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDeshboard;