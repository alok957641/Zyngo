import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose, MdMyLocation } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { setUserData, setSearchTerm } from "../redux/userSlice"; 
import axios from "axios";

function UserNav() {
  const { userData, City, cartItems, searchTerm } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false); // Modal state
  const [manualAddress, setManualAddress] = useState(""); // Input state

  const handleLogout = () => {
    dispatch(setUserData(null)); 
    setIsProfileOpen(false);
    navigate("/signin");
  };

  // ✅ FIXED: 400 Error Resolve - Backend logic match
 const handleLocationUpdate = async () => {
    if (!manualAddress.trim()) {
      alert("Address toh daal bhai!");
      return;
    }
    
    try {
      console.log("📤 Backend ko bhej rahe hain:", { address: manualAddress });
      
      const response = await axios.post(
        "https://zyngo.onrender.com/api/user/update-location", 
        { address: manualAddress }, // Yahi object format backend ko chahiye
        { withCredentials: true }
      );
      
      if (response.data.success) {
        alert("Location updated!");
        setIsLocationModalOpen(false);
        window.location.reload(); 
      }
    } catch (err) {
      console.error("❌ Update Fail:", err.response?.data?.message || err.message);
      alert("Server ko data nahi mila, console check kar!");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tighter hover:scale-105 transition-transform">
                Zyngo
              </Link>
              {/* Location Click Trigger */}
              <div onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer group ml-4">
                <FaMapMarkerAlt className="text-orange-500 text-lg group-hover:animate-bounce" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deliver to</span>
                  <span className="text-sm font-bold flex items-center gap-1 border-b-2 border-transparent group-hover:border-orange-500 transition-colors">
                    {City || "Locating..."} <MdKeyboardArrowDown className="text-lg" />
                  </span>
                </div>
              </div>
            </div>

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
              <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-gray-600 hover:text-orange-500 transition-colors"><FaSearch className="text-xl" /></button>
              {userData && (<Link to="/my-orders" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group"><FaShoppingBag className="text-xl" /><span className="font-bold">Orders</span></Link>)}
              <Link to="/Cart" className="relative flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
                <FaShoppingCart className="text-2xl" /><span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">{cartItems.length}</span>
              </Link>
              {userData ? (
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white font-extrabold">{userData.fullname.charAt(0).toUpperCase()}</button>
              ) : (
                <Link to="/signin" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Location Input Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h2 className="font-black text-lg mb-4">Enter Location</h2>
            <input className="w-full bg-gray-100 p-4 rounded-xl mb-4 font-bold" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Type address/city" />
            <button onClick={handleLocationUpdate} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black">Update Location</button>
          </div>
        </div>
      )}

      {/* Profile/Search Modals remain exactly as before... */}
      {/* (Baaki mobile search aur profile menu code tumhara same hai) */}
    </>
  );
}
export default UserNav;