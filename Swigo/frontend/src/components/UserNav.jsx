import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
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
      // Backend ko address bhej rahe hain
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
      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          
          {/* Logo & Location Trigger */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-extrabold text-red-600 tracking-tighter">Swigo</Link>
            <div onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center cursor-pointer hover:text-orange-500">
              <FaMapMarkerAlt className="text-orange-500 mr-2" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Deliver to</span>
                <span className="text-sm font-bold flex items-center">{City || "Set Location"} <MdKeyboardArrowDown /></span>
              </div>
            </div>
          </div>

          {/* Icons: Search, Cart, Profile */}
          <div className="flex items-center gap-5">
            <button onClick={() => setIsSearchOpen(true)} className="text-xl text-gray-600"><FaSearch /></button>
            <Link to="/Cart" className="relative text-gray-600">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">{cartItems.length}</span>}
            </Link>
            
            {userData ? (
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full bg-orange-500 text-white font-black hover:scale-105 transition-transform">
                {userData.fullname.charAt(0).toUpperCase()}
              </button>
            ) : (
              <Link to="/signin" className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile/Menu Dropdown */}
      {isProfileOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white rounded-2xl shadow-2xl p-2 z-[60] border border-gray-100">
          <p className="px-4 py-2 text-xs font-bold text-gray-400 truncate">{userData?.fullname}</p>
          <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl font-bold"><FaShoppingBag /> My Orders</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded-xl font-bold"><FiLogOut /> Logout</button>
        </div>
      )}

      {/* Search Modal (Works for Mobile & Desktop) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-6 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-2xl italic">Search</h2>
            <button onClick={() => setIsSearchOpen(false)}><MdClose size={32}/></button>
          </div>
          <input autoFocus value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="w-full bg-gray-100 p-5 rounded-2xl font-bold text-lg outline-none" placeholder="Search food, restaurants..." />
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="font-black text-lg mb-4">Set Location</h2>
            <input className="w-full bg-gray-100 p-4 rounded-xl mb-4 font-bold" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Type your area..." />
            <button onClick={handleLocationUpdate} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black uppercase">Confirm</button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserNav;