import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { setSearchTerm } from "../redux/userSlice";
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
    try { await axios.get("https://zyngo.onrender.com/api/auth/signout", { withCredentials: true }); }
    catch (err) { console.error("Logout error"); }
    finally {
      localStorage.clear();
      window.location.href = "/signin";
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          
          {/* Logo & Location Trigger */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-extrabold text-red-600 tracking-tighter">Zyngo</Link>
            <div onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center cursor-pointer hover:text-orange-500">
              <FaMapMarkerAlt className="text-orange-500 mr-2" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Deliver to</span>
                <span className="text-sm font-bold flex items-center">{City || "Set Location"} <MdKeyboardArrowDown /></span>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-5">
            {/* Search Icon (Only Mobile) */}
            <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-xl"><FaSearch /></button>
            
            {/* Desktop Search (Only Desktop) */}
            <div className="hidden lg:flex bg-gray-100 p-2 rounded-xl w-64 items-center">
              <FaSearch className="text-gray-400 ml-2" />
              <input value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="bg-transparent ml-2 outline-none w-full text-sm" placeholder="Search..." />
            </div>

            <Link to="/Cart" className="relative"><FaShoppingCart className="text-xl" />{cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center">{cartItems.length}</span>}</Link>
            
            {userData ? (
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 rounded-full bg-orange-500 text-white font-black">{userData.fullname.charAt(0).toUpperCase()}</button>
            ) : (
              <Link to="/signin" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Dropdown (Responsive) */}
      {isProfileOpen && (
        <div className="absolute right-4 mt-2 w-48 bg-white rounded-2xl shadow-2xl p-2 z-[60] border">
          <p className="px-4 py-2 text-xs font-bold text-gray-400 truncate">{userData?.fullname}</p>
          {/* My Orders (Only Mobile) */}
          <Link to="/my-orders" className="lg:hidden flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl font-bold"><FaShoppingBag /> My Orders</Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded-xl font-bold"><FiLogOut /> Logout</button>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-4 lg:hidden">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setIsLocationModalOpen(true)} className="text-orange-500 font-bold text-xs"><FaMapMarkerAlt className="inline mr-1"/> {City || "Location"}</button>
            <button onClick={() => setIsSearchOpen(false)}><MdClose size={28}/></button>
          </div>
          <input autoFocus value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="w-full bg-gray-100 p-4 rounded-2xl font-bold" placeholder="Search food, restaurants..." />
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-lg">Set Location</h2>
              <button onClick={() => setIsLocationModalOpen(false)}><MdClose size={24}/></button>
            </div>
            <input className="w-full bg-gray-100 p-4 rounded-xl mb-4 font-bold" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} placeholder="Enter area..." />
            <button onClick={async () => { await axios.post("https://zyngo.onrender.com/api/user/update-location", { address: manualAddress }, { withCredentials: true }); window.location.reload(); }} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black uppercase">Update</button>
          </div>
        </div>
      )}
    </>
  );
}
export default UserNav;