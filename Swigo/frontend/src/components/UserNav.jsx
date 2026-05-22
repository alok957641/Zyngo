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
      window.location.reload(); 
    } catch (err) { alert("Failed to update location."); }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tighter">Swigo</Link>
              {/* Desktop Location */}
              <div onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer ml-4">
                <FaMapMarkerAlt className="text-orange-500 text-lg" />
                <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase">Deliver to</span>
                  <span className="text-sm font-bold flex items-center">{City || "Locating..."} <MdKeyboardArrowDown /></span>
                </div>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
              <div className="relative group"><input type="text" value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} placeholder="Search..." className="w-full bg-gray-100 border p-2.5 rounded-2xl pl-12" />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-xl"><FaSearch /></button>
              {userData && <Link to="/my-orders" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-500"><FaShoppingBag className="text-xl" /><span className="font-bold">Orders</span></Link>}
              <Link to="/Cart" className="relative text-gray-700"><FaShoppingCart className="text-2xl" /><span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center">{cartItems.length}</span></Link>
              {userData ? (
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full bg-orange-500 text-white font-black">{userData.fullname.charAt(0).toUpperCase()}</button>
              ) : (
                <Link to="/signin" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Dropdown */}
      {isProfileOpen && (
        <div className="absolute right-4 mt-2 w-56 bg-white rounded-2xl shadow-2xl border p-2 z-[60]">
          <p className="px-4 py-3 border-b font-extrabold truncate">{userData?.fullname}</p>
          <Link to="/my-orders" className="sm:hidden flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl font-bold"><FaShoppingBag /> My Orders</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl font-bold"><FiLogOut /> Logout</button>
        </div>
      )}

      {/* Mobile Search Overlay with Location */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full bg-white shadow-xl z-[70] p-4 lg:hidden h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black italic">Search</h2>
            <button onClick={() => setIsSearchOpen(false)}><MdClose size={24} /></button>
          </div>
          {/* Mobile Location Trigger (Under search header) */}
          <div onClick={() => setIsLocationModalOpen(true)} className="mb-4 p-4 bg-gray-50 rounded-xl flex items-center gap-2 cursor-pointer border border-gray-200">
            <FaMapMarkerAlt className="text-orange-500" />
            <span className="font-bold text-sm">{City || "Set Location"}</span>
          </div>
          <input autoFocus value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="w-full bg-gray-100 p-4 rounded-xl font-bold" placeholder="Search food, restaurants..." />
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="font-black">Set Location</h2><button onClick={() => setIsLocationModalOpen(false)}><MdClose size={24}/></button></div>
            <input className="w-full bg-gray-100 p-4 rounded-xl mb-4 font-bold" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Enter area..." />
            <button onClick={handleLocationUpdate} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black">Confirm</button>
          </div>
        </div>
      )}
    </>
  );
}
export default UserNav;