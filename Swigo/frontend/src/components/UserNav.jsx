import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose, MdMyLocation } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

// ✅ setSearchTerm import kiya
import { setUserData, setSearchTerm } from "../redux/userSlice"; 

function UserNav() {
  const { userData, City, cartItems, searchTerm } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    dispatch(setUserData(null)); 
    setIsProfileOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo & Desktop Location */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tighter hover:scale-105 transition-transform">
              Swigo
            </Link>

            <div className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer group ml-4">
              <FaMapMarkerAlt className="text-orange-500 text-lg group-hover:animate-bounce" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deliver to</span>
                <span className="text-sm font-bold flex items-center gap-1 border-b-2 border-transparent group-hover:border-orange-500 transition-colors">
                  {City || "Locating..."} <MdKeyboardArrowDown className="text-lg" />
                </span>
              </div>
            </div>
          </div>

          {/* 2. Desktop Search Box */}
          <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
            <div className="relative group">
              <input
                type="text"
                value={searchTerm} 
                onChange={(e) => dispatch(setSearchTerm(e.target.value))} // ✅ FIXED: Added closing bracket
                placeholder="Search for restaurants, items or more..."
                className="w-full bg-gray-100 border border-transparent text-gray-700 px-5 py-2.5 rounded-2xl pl-12 focus:outline-none focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all shadow-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 text-lg transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">          
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden text-gray-600 hover:text-orange-500 transition-colors"
            >
              <FaSearch className="text-xl" />
            </button>

            {userData && (
              <Link to="/my-orders" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
                <FaShoppingBag className="text-xl group-hover:scale-110 transition-transform" />
                <span className="font-bold">Orders</span>
              </Link>
            )}

            <Link to="/Cart" className="relative flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
              <div className="relative">
                <FaShoppingCart className="text-2xl group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartItems.length}
                </span>
              </div>
              <span className="font-bold hidden sm:block">Cart</span>
            </Link>

            {userData ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all focus:outline-none"
                >
                  {userData.fullname.charAt(0).toUpperCase()}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 transform origin-top-right transition-all animate-fade-in-down z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{userData.role}</p>
                      <p className="font-extrabold text-gray-800 text-lg truncate">{userData.fullname}</p>
                    </div>
                    
                    <div className="flex flex-col mt-2 gap-1">
                      <Link to="/my-orders" onClick={() => setIsProfileOpen(false)} className="sm:hidden flex items-center gap-3 px-4 py-2 hover:bg-orange-50 rounded-xl text-gray-700 hover:text-orange-600 font-bold transition-colors">
                        <FaShoppingBag className="text-lg" /> My Orders
                      </Link>
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl font-bold transition-colors">
                        <FiLogOut className="text-lg" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all">
                Sign In
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Search Popup */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 w-full bg-white shadow-xl z-50 flex flex-col px-4 py-4 animate-fade-in-down lg:hidden rounded-b-3xl border-t-4 border-orange-500">
          
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2 text-gray-700 cursor-pointer">
              <FaMapMarkerAlt className="text-orange-500 text-xl" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Deliver to</span>
                <span className="text-sm font-bold flex items-center gap-1 border-b border-orange-500 pb-0.5">
                  {City || "Locating..."} <MdKeyboardArrowDown className="text-lg text-orange-500" />
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 bg-gray-50 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors shadow-sm"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              autoFocus
              value={searchTerm} 
              onChange={(e) => dispatch(setSearchTerm(e.target.value))} 
              placeholder="Search food, restaurants..."
              className="w-full bg-gray-100 text-gray-800 px-5 py-3.5 rounded-2xl pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-transparent shadow-inner font-medium"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 bg-white p-2 rounded-xl shadow-sm hover:bg-orange-50 transition-colors border border-orange-100">
              <MdMyLocation className="text-lg" />
            </button>
          </div>
          
        </div>
      )}
    </nav>
  );
}

export default UserNav;