import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose, MdMyLocation } from "react-icons/md";
import { FiLogOut, FiMapPin } from "react-icons/fi";
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

  const handleLogout = async () => {
    try {
      await axios.get("https://zyngo.onrender.com/api/auth/signout", { withCredentials: true });
    } catch (err) { console.error("Logout error"); }
    finally {
      dispatch(setUserData(null));
      localStorage.clear();
      navigate("/signin");
      window.location.reload();
    }
  };

  const handleLocationUpdate = async () => {
    if (!manualAddress.trim()) return;
    try {
      await axios.post("https://zyngo.onrender.com/api/user/update-location", 
        { address: manualAddress }, { withCredentials: true }
      );
      alert("Location updated successfully!");
      setIsLocationModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert("Failed to update location.");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* 1. Logo & Location Trigger */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="text-3xl font-extrabold text-red-600 tracking-tighter">Zyngo</Link>
              <div 
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer group ml-4"
              >
                <FaMapMarkerAlt className="text-orange-500 text-lg" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deliver to</span>
                  <span className="text-sm font-bold flex items-center gap-1">{City || "Set Location"} <MdKeyboardArrowDown /></span>
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
                  className="w-full bg-gray-100 border border-transparent text-gray-700 px-5 py-2.5 rounded-2xl pl-12 focus:outline-none focus:bg-white focus:border-orange-400 transition-all shadow-sm"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
            </div>

            {/* 3. Right Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-gray-600 hover:text-orange-500"><FaSearch className="text-xl" /></button>
              
              <Link to="/Cart" className="relative flex items-center gap-2">
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">{cartItems.length}</span>
              </Link>

              {userData ? (
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-full bg-orange-500 text-white font-black">{userData.fullname.charAt(0).toUpperCase()}</button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl p-2 z-50">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded-xl font-bold"><FiLogOut /> Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="bg-orange-600 text-white px-5 py-2 rounded-xl font-bold text-sm">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🧩 Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h2 className="font-black text-lg italic">Set Location</h2>
              <button onClick={() => setIsLocationModalOpen(false)}><MdClose size={24}/></button>
            </div>
            <input 
              type="text" 
              placeholder="Enter your city/area..." 
              className="w-full bg-gray-100 p-4 rounded-xl mb-4 font-bold outline-none"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
            <button onClick={handleLocationUpdate} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase text-xs">Update</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserNav;