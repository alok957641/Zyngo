import React, { useState } from "react";
import { FaPlus, FaMinus, FaShoppingBag, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

const ItemCard = ({ item = {} }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(1);

  const isInCart = cartItems.some((i) => (i.id || i._id) === item._id);

  // ✅ REAL DATA MAPPING
  const itemName = item?.name || "Food Item";
  const itemImage = item?.image || "https://via.placeholder.com/300x200?text=Food";
  const itemPrice = item?.price || 0;
  const originalPrice = item?.originalPrice || itemPrice * 1.2;
  const discount = item?.discount || Math.round(((originalPrice - itemPrice) / originalPrice) * 100);
  const shopName = item?.shop?.shopName || item?.shop?.name || "Restaurant";
  const rating = item?.rating || 4.2;
  const isVeg = item?.isVeg !== false; // Default true

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        shop: item.shop,
        quantity: quantity,
      }));
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 w-full border border-gray-100 cursor-pointer hover:-translate-y-1">
      
      {/* ========== IMAGE SECTION ========== */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <img
          src={itemImage}
          alt={itemName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Veg/Non-Veg Badge */}
        <div className="absolute top-2 left-2">
          <div className={`w-4 h-4 rounded-full border-2 ${isVeg ? 'border-green-600' : 'border-red-600'} bg-white flex items-center justify-center`}>
            <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {discount}% OFF
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
          <FaStar className="text-green-600 text-[8px]" />
          <span className="text-[10px] font-black text-gray-800">{rating}</span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
          <span className="text-white font-black text-xs">₹{itemPrice}</span>
          {originalPrice > itemPrice && (
            <span className="text-gray-400 text-[8px] line-through ml-1">₹{originalPrice}</span>
          )}
        </div>
      </div>

      {/* ========== CONTENT SECTION ========== */}
      <div className="p-3">
        
        {/* Shop Name */}
        <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-tighter">
          {shopName}
        </h3>
        
        {/* Item Name */}
        <h4 className="text-sm font-black text-gray-800 truncate mt-0.5">
          {itemName}
        </h4>
        
        {/* Description */}
        {item?.description && (
          <p className="text-[10px] text-gray-400 truncate mt-0.5">
            {item.description}
          </p>
        )}

        {/* Quantity & Add to Cart Section */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          
          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-100 rounded-xl">
            <button 
              onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-500 rounded-l-xl transition-all"
            >
              <FaMinus className="text-[9px]" />
            </button>
            <span className="w-7 text-center text-xs font-black text-gray-800">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-500 rounded-r-xl transition-all"
            >
              <FaPlus className="text-[9px]" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-xl transition-all duration-300 font-black text-[9px] uppercase tracking-wider flex items-center gap-1
              ${isInCart 
                ? "bg-gray-800 text-white" 
                : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-md"
              }`}
          >
            <FaShoppingBag className="text-[9px]" />
            {isInCart ? "ADDED" : "ADD"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;