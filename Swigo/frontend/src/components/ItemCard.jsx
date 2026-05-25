import React, { useState } from "react";
import { FaStar, FaPlus, FaMinus, FaMotorcycle, FaShoppingBag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

const ItemCard = ({ item = {} }) => {
  const dispatch = useDispatch();
  const { City, cartItems } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(1);

  const isInCart = cartItems.some((i) => (i.id || i._id) === item._id);

  // ✅ SHOP NAME LOGIC: Multiple keys check taaki Zyngo Partner na dikhe
  const shopName = item?.shop?.shopName || item?.shop?.name || item?.restaurantName || "Restaurant Name";
  const shopAddress = item?.shop?.address || City || "Local Area";
  const displayRating = item?.rating?.average || (typeof item?.rating === 'number' ? item.rating : "4.2");

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop,
        quantity: quantity,
        foodType: item.foodType,
      }));
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:scale-[0.98] transition-all duration-300 w-full max-w-[240px] mx-auto cursor-pointer border border-gray-100 shadow-sm">
      
      {/* 1. Image Section: Reduced Height with shorter aspect */}
      <div className="relative h-28 md:h-32 w-full overflow-hidden bg-gray-50">
        <img
          src={item?.image || "https://via.placeholder.com/400"}
          alt={item?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Bottom Image Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
          <span className="text-white font-black text-[11px] md:text-[13px] uppercase tracking-tighter italic ml-1">
            ₹{item?.price} • DEAL
          </span>
        </div>
      </div>

      {/* 2. Content Section: Tightened gaps for shorter height */}
      <div className="p-2.5 flex flex-col gap-0.5">
        
        {/* 🏢 SHOP NAME: Same style as before but ensures it's the real name */}
        <h3 className="text-[15px] md:text-[16px] font-black text-gray-800 truncate uppercase tracking-tight leading-none">
          {shopName}
        </h3>

        {/* Rating & Delivery Time Row */}
        <div className="flex items-center gap-2 text-gray-700 font-bold text-[12px] mt-0.5">
          <div className="flex items-center gap-0.5 bg-green-700 text-white px-1 py-0.5 rounded-md text-[10px]">
            <FaStar className="text-[8px]" />
            <span>{displayRating}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="tracking-tight text-gray-500 flex items-center gap-1 uppercase text-[11px]">
            <FaMotorcycle className="text-orange-500" /> 25 MINS
          </span>
        </div>

        {/* 🍔 ITEM NAME & 📍 LOCATION: Single line to save space */}
        <p className="text-[12px] text-gray-400 font-medium truncate mt-0.5">
          {item?.name} — {shopAddress}
        </p>

        {/* 3. Footer: Price & Stepper (More compact) */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-50">
          <span className="text-sm md:text-base font-black text-gray-900 tracking-tighter">
            ₹{(item?.price || 0) * quantity}
          </span>

          {/* Compact Quantity Controls */}
          <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200">
            <button 
              onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 bg-white rounded shadow-sm"
            >
              <FaMinus className="text-[7px]" />
            </button>
            <span className="px-2 text-[11px] font-black text-gray-800">{quantity}</span>
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-600 bg-white rounded shadow-sm"
            >
              <FaPlus className="text-[7px]" />
            </button>
          </div>
        </div>

        {/* 🛒 Add to Basket Button: Slimmer button */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-2 py-2 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-wider
            ${isInCart 
              ? "bg-gray-800 text-white" 
              : "bg-[#fc8019] text-white hover:bg-orange-600 active:scale-95"
            }`}
        >
          {isInCart ? "IN CART" : "ADD TO BASKET"}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;