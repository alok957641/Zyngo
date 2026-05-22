import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaShoppingBag } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
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
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* 1. Logo & Desktop Location */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tighter hover:scale-105 transition-transform">
                Swigo
              </Link>

              <div className="hidden md:flex items-center gap-1 text-gray-600 hover:text-orange-500 cursor-pointer group ml-4">
                <FaMapMarkerAlt className="text-orange-500 text-lg" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deliver to</span>
                  <span className="text-sm font-bold flex items-center gap-1">
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
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  placeholder="Search for restaurants, items or more..."
                  className="w-full bg-gray-100 border border-transparent text-gray-700 px-5 py-2.5 rounded-2xl pl-12 focus:outline-none focus:bg-white focus:border-orange-400 transition-all shadow-sm"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              </div>
            </div>

            {/* 3. Right Icons */}
            <div className="flex items-center gap-4 sm:gap-6">          
              <button onClick={() => setIsSearchOpen(true)} className="lg:hidden text-gray-600 hover:text-orange-500 transition-colors">
                <FaSearch className="text-xl" />
              </button>

              {userData && (
                <Link to="/my-orders" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
                  <FaShoppingBag className="text-xl" />
                  <span className="font-bold">Orders</span>
                </Link>
              )}

              <Link to="/Cart" className="relative flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group">
                <div className="relative">
                  <FaShoppingCart className="text-2xl" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartItems.length}
                  </span>
                </div>
                <span className="font-bold hidden sm:block">Cart</span>
              </Link>

              {userData ? (
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white font-extrabold text-base shadow-md transition-all">
                    {userData.fullname.charAt(0).toUpperCase()}
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border p-2 z-50">
                      <div className="px-4 py-3 border-b"><p className="font-extrabold truncate">{userData.fullname}</p></div>
                      <Link to="/my-orders" className="sm:hidden flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl font-bold"><FaShoppingBag /> My Orders</Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl font-bold"><FiLogOut /> Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Popup */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full bg-white shadow-xl z-[60] p-4 lg:hidden border-b-4 border-orange-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black italic">Search</h2>
            <button onClick={() => setIsSearchOpen(false)} className="p-2"><MdClose size={24} /></button>
          </div>
          <input autoFocus value={searchTerm} onChange={(e) => dispatch(setSearchTerm(e.target.value))} className="w-full bg-gray-100 p-4 rounded-xl font-bold" placeholder="Search food..." />
        </div>
      )}
    </>
  );
}

export default UserNav;