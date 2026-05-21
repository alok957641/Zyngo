import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiShoppingBag, FiCheckCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import CartItemCard from "../components/CartItemCart"

function Cartpage() {
  const navigate = useNavigate();
  const [isGoingBack, setIsGoingBack] = useState(false);
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const handleBackClick = () => {
    setIsGoingBack(true);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28"> {/* Background change for contrast */}
      
      {/* --- Header Section --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 flex items-center gap-4">
        <button
          onClick={handleBackClick}
          className="p-2 bg-gray-50 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm"
        >
          {isGoingBack ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            <FiArrowLeft className="text-xl" />
          )}
        </button>

        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            Cart Review
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Check your food before order
          </p>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="max-w-md mx-auto p-4">
        {!cartItems || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4">
               <FiShoppingBag className="text-5xl text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">
              Cart Is Empty
            </p>
            <span className="text-xs text-slate-300 mt-1">
              Bhai kuch khana order kar le!
            </span>
            <button 
                onClick={() => navigate("/")}
                className="mt-6 text-orange-600 font-black uppercase text-sm border-b-2 border-orange-600"
            >
                Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* --- Cart Items List --- */}
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                    Your Selected Items
                </p>
                {cartItems?.map((items, index) => (
                  <CartItemCard data={items} key={index} />
                ))}
            </div>

            {/* --- Bill Summary Card --- */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 mt-8">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">
                Bill Details
              </h3>
              
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Item Total</span>
                <span>₹{totalAmount}</span>
              </div>
              
              <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-bold tracking-tighter italic text-xs">FREE DELIVERY</span>
              </div>

              <div className="h-[1px] bg-slate-50 my-2"></div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">To Pay</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        ₹{totalAmount}
                    </span>
                </div>
                <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                    <FiCheckCircle /> SAVING ₹40
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Floating Sticky Checkout Button (Pro Style) --- */}
      {cartItems?.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-50">
          <div className="max-w-md mx-auto">
            <button onClick={()=>navigate("/CheckOut")} className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl group">
               <span>Proceed to Checkout</span>
               <div className="bg-white/20 w-px h-4 mx-1"></div>
               <span className="group-hover:translate-x-1 transition-transform">₹{totalAmount}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cartpage;