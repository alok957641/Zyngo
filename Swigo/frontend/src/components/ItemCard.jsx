import React, { useState } from "react";
import { FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
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
  const shopName = item?.shop?.shopName || item?.shop?.name || "Restaurant";

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
    <div className="group flex bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 w-full border border-gray-100 cursor-pointer">
      
      {/* LEFT: Image Section - Small and Compact */}
      <div className="relative w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 shrink-0 overflow-hidden bg-gray-50">
        <img
          src={itemImage}
          alt={itemName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Price Badge on Image */}
        <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
          <span className="text-white font-black text-[10px] sm:text-xs">
            ₹{itemPrice}
          </span>
        </div>
      </div>

      {/* RIGHT: Content Section */}
      <div className="flex-1 p-2 sm:p-2.5 flex flex-col justify-between">
        
        {/* Shop Name */}
        <div>
          <h3 className="text-xs sm:text-sm font-black text-gray-800 truncate uppercase tracking-tight">
            {shopName}
          </h3>
          
          {/* Item Name */}
          <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate mt-0.5">
            {itemName}
          </p>
          
          {/* Description (if any) */}
          {item?.description && (
            <p className="text-[9px] text-gray-400 truncate mt-0.5">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom Section: Quantity & Add Button */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-50">
          
          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
            <button 
              onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 bg-white rounded-l-lg transition-all"
            >
              <FaMinus className="text-[8px]" />
            </button>
            <span className="px-2 text-[11px] font-black text-gray-800 min-w-[28px] text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-600 bg-white rounded-r-lg transition-all"
            >
              <FaPlus className="text-[8px]" />
            </button>
          </div>

          {/* Total Price */}
          <span className="text-sm font-black text-gray-900">
            ₹{(itemPrice * quantity)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-2 py-1.5 rounded-lg transition-all duration-300 font-black text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center justify-center gap-1
            ${isInCart 
              ? "bg-gray-800 text-white" 
              : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
            }`}
        >
          <FaShoppingBag className="text-[10px]" />
          {isInCart ? "IN CART" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;