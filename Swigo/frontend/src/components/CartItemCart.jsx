import React from "react";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch } from "react-redux";
// 🚨 FIXED: 'updateQuentity' ko 'updateQuantity' kar diya hai
import { removecartItem, updateQuantity } from "../redux/userSlice";

const CartItemCard = ({ data }) => {
  const dispatch = useDispatch();
  const itemPrice = data?.price || 0;
  const itemQty = data?.quantity || 1;
  const itemId = data?.id || data?._id;

  const handleincrease = (id, currentQty) => {
    // ✅ Updated Dispatch call
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handledecrease = (id, currentQty) => {
    if (currentQty > 1) {
      // ✅ Updated Dispatch call
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-md mx-auto mb-3 group relative">
      {/* Image Block */}
      <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-50">
        <img
          src={data?.image || "https://via.placeholder.com/150?text=Food"}
          alt={data?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${data?.foodType === "Veg" ? "bg-green-500" : "bg-red-500"}`}></div>
      </div>

      {/* Content Block */}
      <div className="flex flex-grow flex-col justify-between h-20 py-0.5">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-black text-slate-800 uppercase truncate tracking-tight leading-none">
              {data?.name || "Premium Item"}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              Unit Price: ₹{itemPrice}
            </p>
          </div>
          <button 
            onClick={() => dispatch(removecartItem(itemId))} 
            className="text-slate-300 hover:text-red-500 transition-colors p-1"
          >
            <FaTrashAlt className="text-[12px]" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[18px] font-black text-slate-900 tracking-tighter leading-none">
            ₹{itemPrice * itemQty}
          </span>

          {/* Quantity Controls */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-0.5 shadow-inner">
            <button
              onClick={() => handledecrease(itemId, itemQty)}
              className={`w-7 h-7 flex items-center justify-center transition-all ${itemQty <= 1 ? "opacity-30 cursor-not-allowed" : "text-slate-400 hover:text-red-500 active:scale-75"}`}
            >
              <FaMinus className="text-[8px]" />
            </button>
            <span className="px-2.5 text-[12px] font-black text-slate-800 tabular-nums">{itemQty}</span>
            <button
              onClick={() => handleincrease(itemId, itemQty)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-green-500 active:scale-75 transition-all"
            >
              <FaPlus className="text-[8px]" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Interaction Overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-100 rounded-[24px] pointer-events-none transition-all duration-300"></div>
    </div>
  );
};

export default CartItemCard;