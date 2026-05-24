import React, { useRef, useEffect, useState } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OwnerNav from "./OwnerNav";
import { motion } from "framer-motion";
import axios from "axios";

// Hook call sirf data fetch trigger karne ke liye
import useGetMyOrders from "../hooks/useGetMyOrders"; 
import useGetMyShop from "../hooks/useGetMyShop";

// Icons
import { IoNotificationsOutline, IoWalletOutline, IoLogOutOutline } from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import { FiEdit3, FiPlus, FiStar, FiRadio, FiPower, FiShoppingBag, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import OwnerItemCard from "./OwnerItemCard";
import { setUserData } from "../redux/userSlice";

const serverurl = "https://zyngo.onrender.com";

// ✅ SHOP STATS CARD COMPONENT (Mast Style)
function ShopStatsCard({ shopData, orders }) {
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-slate-50 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
        >
            {/* Shop Banner */}
            <div className="relative h-40 w-full">
                {shopData?.image ? (
                    <img src={shopData.image} alt={shopData.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                        <FiShoppingBag className="text-5xl text-orange-500/40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{shopData?.name}</h2>
                    <p className="text-[10px] text-white/70 flex items-center gap-1 mt-1">
                        <FiMapPin size={10} /> {shopData?.address?.slice(0, 60)}
                    </p>
                </div>
            </div>

            {/* Stats Grid - Real Data */}
            <div className="p-5">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <p className="text-[8px] font-black text-orange-400 uppercase tracking-wider">⭐ Rating</p>
                        <h3 className="text-xl font-black text-orange-600">{shopData?.rating || "4.8"}</h3>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-wider">📦 Total Orders</p>
                        <h3 className="text-xl font-black text-blue-600">{orders.length || 0}</h3>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-[8px] font-black text-green-400 uppercase tracking-wider">💰 Net Sales</p>
                        <h3 className="text-xl font-black text-green-600">₹{totalRevenue}</h3>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ✅ MENU CARD COMPONENT (Restaurant Style)
function MenuCardItem({ item, isShopOnline }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group ${!isShopOnline ? 'opacity-60' : ''}`}
        >
            <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                        <FiShoppingBag className="text-3xl text-orange-300" />
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">Out of Stock</span>
                    </div>
                )}
            </div>
            <div className="p-3">
                <h4 className="text-sm font-black text-gray-800 truncate">{item.name}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{item.description || "Delicious item"}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-orange-600">₹{item.price}</span>
                    <button className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white text-[10px] font-black hover:bg-orange-600 transition-all">
                        +
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function OwnerDeshboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Hooks
    useGetMyOrders(); 
    useGetMyShop();

    const { userData, myOrders } = useSelector((state) => state.user);
    const myShopData = useSelector((state) => state.owner?.myShopData);

    const [isShopOnline, setIsShopOnline] = useState(userData?.isOnline !== false);
    const [toggleLoading, setToggleLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            setIsShopOnline(userData.isOnline !== false);
        }
    }, [userData]);

    const orders = myOrders || [];
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    // ✅ Handle Status Toggle
    const handleStatusToggle = async () => {
        try {
            setToggleLoading(true);
            const res = await axios.post(`${serverurl}/api/user/toggle-availability`, {}, { withCredentials: true });
            if (res.data.success) {
                setIsShopOnline(res.data.isOnline);
                alert(`🎉 Store status updated to: ${res.data.isOnline ? "ONLINE" : "OFFLINE"}`);
            }
        } catch (err) {
            console.error("Network Status Switch Mismatch:", err);
            alert("Status update sync failed!");
        } finally {
            setToggleLoading(false);
        }
    };

    // ✅ Handle Logout
    const handleLogout = async () => {
        try {
            localStorage.clear();
            dispatch(setUserData(null));
            await axios.get(`${serverurl}/api/user/logout`, { withCredentials: true });
            window.location.href = "/signin";
        } catch (err) {
            window.location.href = "/signin";
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#FDFCFB] flex flex-col font-sans relative overflow-x-hidden">
            <OwnerNav />

            <div className="flex-grow flex flex-col items-center p-4 sm:p-8 relative gap-8">
                {!myShopData ? (
                    // ✅ Loading or No Shop State
                    <div className="w-full max-w-2xl mx-auto mt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiShoppingBag className="text-white text-5xl" />
                                </div>
                                <h2 className="text-3xl font-black text-white italic tracking-tighter">
                                    Welcome to Swiddy! 🚀
                                </h2>
                                <p className="text-orange-100 mt-2 font-medium">
                                    Start your food delivery journey today
                                </p>
                            </div>
                            <div className="p-8 text-center">
                                <p className="text-gray-600 mb-6">
                                    You haven't created a shop yet. Create your shop to start receiving orders.
                                </p>
                                <button
                                    onClick={() => navigate('/CreateAndEditShop')}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-orange-600 transition-all flex items-center gap-2 mx-auto shadow-xl"
                                >
                                    <FiPlus className="text-lg" />
                                    Create Your Shop Now
                                </button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="w-full max-w-6xl z-10 flex flex-col gap-8">
                        
                        {/* TOP BAR */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <p className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-1 italic">Shop Operations</p>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">{myShopData.name}</h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
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

                                {/* ✅ Logout Button */}
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-50 border border-red-200 px-5 py-4 rounded-3xl shadow-sm flex items-center gap-2 hover:bg-red-100 transition-all font-black text-[10px] text-red-600"
                                >
                                    <IoLogOutOutline size={16} /> LOGOUT
                                </button>
                            </div>
                        </div>

                        {/* ✅ Shop Stats Card - Real Rating, Orders, Earnings */}
                        <ShopStatsCard shopData={myShopData} orders={orders} />

                        {/* SHOP DETAILS CARD */}
                        <div className={`w-full bg-white rounded-[3rem] shadow-sm overflow-hidden border flex flex-col md:flex-row transition-all duration-300 ${!isShopOnline ? 'border-red-500/20 ring-4 ring-red-500/5' : 'border-gray-100'}`}>
                            <div className="md:w-1/2 relative h-[250px] md:h-auto overflow-hidden">
                                <img src={myShopData.image} className={`w-full h-full object-cover transition-all duration-300 ${!isShopOnline ? 'grayscale blur-[1px]' : ''}`} alt="shop" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                {!isShopOnline && (
                                    <div className="absolute top-6 right-6 bg-red-600 text-white font-mono font-black text-[8px] tracking-[3px] uppercase px-3 py-1.5 rounded-xl shadow-xl">
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

                        {/* ✅ MENU SECTION - Restaurant Style */}
                        {myShopData?.items?.length > 0 && (
                            <div className="flex flex-col gap-6 mb-20">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tighter italic uppercase flex items-center gap-2">
                                        🍽️ Our Menu
                                        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                            {myShopData.items.length} items
                                        </span>
                                    </h2>
                                    <button className="text-[9px] font-black text-orange-500 hover:text-orange-600 transition-all uppercase tracking-wider">
                                        View All →
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {myShopData.items.map((item, index) => (
                                        <MenuCardItem key={index} item={item} isShopOnline={isShopOnline} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Items Message */}
                        {myShopData?.items?.length === 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                                <FiShoppingBag className="text-3xl text-amber-400 mx-auto mb-3" />
                                <h3 className="text-lg font-black text-amber-800">Your Menu is Empty!</h3>
                                <p className="text-sm text-amber-600 mt-1">Add your first dish to start attracting customers</p>
                                <Link to="/AddItem" className="inline-block mt-4 bg-amber-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-amber-700 transition-all">
                                    + Add First Dish
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerDeshboard;