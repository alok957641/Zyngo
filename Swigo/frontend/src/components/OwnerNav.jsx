import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// ✅ STRICT RE-FIXED ICONS: Saare icons sahi package nodes se link kar diye hain bhai
import { MdOutlinePendingActions, MdAddCircleOutline, MdFastfood } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { setUserData } from "../redux/userSlice";

function OwnerNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // REDUX CONFIG EXTRACTION
  const { userData, myOrders } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  // REAL-TIME ORDERS FILTER ENGINE
  const ordersArray = myOrders || [];
  const pendingOrdersCount = ordersArray.filter((order) => {
    if (!order.shopOrders || order.shopOrders.length === 0) return false;
    
    // Apni shop ka status extract karo aur check karo kitchen me active hai ya nahi
    const currentStatus = order.shopOrders[0]?.status?.toLowerCase().trim();
    return currentStatus === "pending" || currentStatus === "preparing";
  }).length;

  const handleLogout = () => {
    dispatch(setUserData(null));
    setIsProfileOpen(false);
    navigate("/signin");
  };

  return (
    <nav className="bg-white shadow-md border-b-2 border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="text-3xl sm:text-4xl font-extrabold text-red-600 tracking-tighter hover:scale-105 transition-transform">
              Swigo
            </Link>
            <span className="bg-orange-100 text-orange-600 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md tracking-wider uppercase hidden sm:block">
              Partner
            </span>
          </div>

          {/* 2. ACTION BUTTONS */}
          <div className="flex items-center gap-5 sm:gap-8">
            
            {/* A. Add Food Items */}
            {myShopData && (
              <Link 
                to="/AddItem" 
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group"
              >
                <MdAddCircleOutline className="text-2xl sm:text-xl group-hover:scale-110 transition-transform" />
                <span className="font-bold hidden sm:block">Add Food</span>
              </Link>
            )}

            {/* B. Real-Time Pending Orders Notification Counter */}
            <Link 
              to="/my-orders"
              className="relative flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors group"
            >
              <div className="relative">
                <MdOutlinePendingActions className="text-2xl group-hover:scale-110 transition-transform" />
                
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-md animate-pulse font-mono">
                    {pendingOrdersCount}
                  </span>
                )}
              </div>
              <span className="font-bold hidden sm:block">Orders</span>
            </Link>

            {/* C. User Profile Dropdown Menu */}
            {userData ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-600 border-2 border-orange-200 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all focus:outline-none"
                >
                  {userData.fullname?.charAt(0).toUpperCase()}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 transform origin-top-right transition-all z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">Restaurant Owner</p>
                      <p className="font-extrabold text-gray-800 text-lg truncate uppercase mt-0.5">{userData.fullname}</p>
                    </div>
                    
                    <div className="flex flex-col mt-2 gap-1">
                      <Link to="/all-foods" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-orange-50 rounded-xl text-gray-700 hover:text-orange-600 font-bold transition-colors">
                        <MdFastfood className="text-lg" /> My Menu
                      </Link>
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-xl font-bold transition-colors">
                        <FiLogOut className="text-lg" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default OwnerNav;