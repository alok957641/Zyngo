import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { setUserData, setSearchTerm } from "../redux/userSlice"; 
import axios from "axios";

function UserNav() {
  const { userData, City, cartItems, searchTerm } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState("");

  const handleLogout = () => {
    dispatch(setUserData(null)); 
    setIsProfileOpen(false);
    navigate("/signin");
  };

  const handleLocationUpdate = async () => {
    if (!manualAddress.trim()) return;
    try {
      await axios.post("https://zyngo.onrender.com/api/user/update-location", 
        { address: manualAddress }, { withCredentials: true }
      );
      alert("Location updated!");
      setIsLocationModalOpen(false);
      window.location.reload(); 
    } catch (err) { alert("Failed to update location."); }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* 1. Logo & Location (Mobile + Desktop Clickable) */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tighter hover:scale-105 transition-transform">
                Zyngo
              </Link>

              {/* ✅ Ye div ab mobile aur desktop dono pe clickable hai */}
              <div 
                onClick={() => setIsLocationModalOpen(true)} 
                className="flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer group ml-4"
              >
                <FaMapMarkerAlt className="text-orange-500 text-lg group-hover:animate-bounce" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deliver to</span>
                  <span className="text-sm font-bold flex items-center gap-1 border-b-2 border-transparent group-hover:border-orange-500 transition-colors">
                    {City || "Locating..."} <MdKeyboardArrowDown className="text-lg" />
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Desktop Search */}
            <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm} 
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  placeholder="Search for restaurants, items or more..."
                  className="w-full bg-gray-100 border border-transparent text-gray-700 px-5 py-2.5 rounded-2xl pl-12 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all shadow-sm"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 text-lg transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">          
              <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-gray-600 hover:text-orange-500 transition-colors">
                <FaSearch className="text-xl" />
              </button>

              {userData && (
                <Link to="/my-orders" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
                  <FaShoppingBag className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-bold">Orders</span>
                </Link>
              )}

              <Link to="/Cart" className="relative flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">{cartItems.length}</span>
              </Link>

              {userData ? (
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white font-black">{userData.fullname.charAt(0).toUpperCase()}</button>
              ) : (
                <Link to="/signin" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Fixed Location Modal (Center me khulega) */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
               <h2 className="font-black text-lg italic">Set Location</h2>
               <button onClick={() => setIsLocationModalOpen(false)}><MdClose size={24}/></button>
            </div>
            <input 
              className="w-full bg-gray-100 p-4 rounded-xl mb-4 font-bold border-2 focus:border-orange-500 outline-none" 
              value={manualAddress} 
              onChange={(e) => setManualAddress(e.target.value)} 
              placeholder="Enter area/city..." 
            />
            <button onClick={handleLocationUpdate} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black">Update Location</button>
          </div>
        </div>
      )}

      {/* Mobile Search Popup (Tumhara original logic) */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full bg-white shadow-xl z-50 flex flex-col px-4 py-4 animate-fade-in-down lg:hidden rounded-b-3xl border-t-4 border-orange-500">
          <div className="flex justify-between items-center mb-4">
             <h2 className="font-bold">Search</h2>
             <button onClick={() => setIsSearchOpen(false)}><MdClose size={24}/></button>
          </div>
          <input autoFocus value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="w-full bg-gray-100 p-4 rounded-xl font-bold" placeholder="Search food..." />
        </div>
      )}
    </>
  );
}

export default UserNav;