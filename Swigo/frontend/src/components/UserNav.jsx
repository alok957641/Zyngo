import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose, MdMyLocation } from "react-icons/md";
import { FiLogOut, FiMapPin, FiUser } from "react-icons/fi";
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
      alert("Location updated!");
      setIsLocationModalOpen(false);
      window.location.reload(); 
    } catch (err) { alert("Failed to update location."); }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          
          {/* Logo & Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-3xl font-extrabold text-red-600 tracking-tighter">Zyngo</Link>
            <div onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center cursor-pointer">
              <FaMapMarkerAlt className="text-orange-500 mr-2" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Deliver to</span>
                <span className="text-sm font-bold">{City || "Set Location"}</span>
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)} className="text-xl"><FaSearch /></button>
            <Link to="/Cart" className="relative"><FaShoppingCart className="text-xl" /><span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">{cartItems.length}</span></Link>
            
            {userData ? (
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full bg-orange-500 text-white font-black">{userData.fullname.charAt(0).toUpperCase()}</button>
            ) : (
              <Link to="/signin" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile/Mobile Menu Dropdown */}
      {isProfileOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white rounded-2xl shadow-2xl p-2 z-[60] border">
          <p className="px-4 py-2 text-xs font-bold text-gray-400">{userData?.fullname}</p>
          <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl font-bold"><FaShoppingBag /> My Orders</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded-xl font-bold"><FiLogOut /> Logout</button>
        </div>
      )}

      {/* Search & Location Modal (Mobile & Desktop) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <input autoFocus value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="w-full bg-gray-100 p-3 rounded-xl" placeholder="Search food..." />
            <button onClick={() => setIsSearchOpen(false)} className="ml-4"><MdClose size={24}/></button>
          </div>
        </div>
      )}

      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h2 className="font-black mb-4">Set Location</h2>
            <input className="w-full bg-gray-100 p-4 rounded-xl mb-4" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Type your area..." />
            <button onClick={handleLocationUpdate} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black">Update</button>
          </div>
        </div>
      )}
    </>
  );
}
export default UserNav;