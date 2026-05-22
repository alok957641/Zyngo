import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose, MdMyLocation } from "react-icons/md";
import { FiLogOut, FiMapPin, FiCheck } from "react-icons/fi";
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
      // Backend request to update address
      await axios.post("https://zyngo.onrender.com/api/user/update-location", 
        { address: manualAddress }, { withCredentials: true }
      );
      // Update logic here (dispatch new user data or reload)
      alert("Location updated!");
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
            {/* Logo & Location Trigger */}
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

            {/* ... (Search and Cart logic remains same) ... */}
            
            {/* Existing Right side items... */}
          </div>
        </div>
      </nav>

      {/* 🧩 Location Modal (The Fix) */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-lg uppercase italic">Change Location</h2>
              <button onClick={() => setIsLocationModalOpen(false)}><MdClose size={24}/></button>
            </div>
            <input 
              type="text" 
              placeholder="Enter area or city..." 
              className="w-full bg-gray-100 p-4 rounded-2xl mb-4 font-bold outline-none border-2 border-transparent focus:border-orange-500"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
            <button 
              onClick={handleLocationUpdate}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-700 transition-all"
            >
              Update Location
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserNav;