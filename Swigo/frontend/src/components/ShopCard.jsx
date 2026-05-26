import React from 'react';
import { FaStar, FaClock, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  // 🔥 REAL DATA MAPPING
  const name = shop?.name || shop?.shopName || "Restaurant Name";
  const image = shop?.image || "https://via.placeholder.com/400x250?text=Food";
  
  // ⭐ REAL RATING
  const ratingValue = shop?.rating || shop?.averageRating || 4.0;
  const totalReviews = shop?.totalReviews || shop?.totalRatings || 0;
  
  // ⏰ REAL DELIVERY TIME
  const deliveryTime = shop?.deliveryTime || shop?.estimatedTime || "30-40 min";
  
  // 📍 LOCATION
  const city = shop?.city || "";
  const area = shop?.area || shop?.locality || "";
  const address = shop?.address || "";
  
  // 🏷️ OFFERS
  const offers = shop?.offers || shop?.discount || "";
  
  // 💰 PRICE FOR TWO
  const priceForTwo = shop?.priceForTwo || shop?.avgCost || 400;
  
  // 🎨 DYNAMIC RATING COLOR (Swiggy Style)
  const getRatingColor = (rating) => {
    if (rating >= 4.0) return "bg-green-600";
    if (rating >= 3.5) return "bg-green-500";
    if (rating >= 3.0) return "bg-orange-500";
    return "bg-red-500";
  };

  // 📊 RATING TEXT
  const ratingText = ratingValue > 0 ? ratingValue.toFixed(1) : "NEW";

  const handleClick = () => {
    if (shop?._id) {
      navigate(`/shop/${shop._id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col cursor-pointer w-full transition-all duration-300 hover:scale-[0.98] active:scale-[0.98]"
    >
      {/* ========== IMAGE SECTION ========== */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
        <img 
          src={image} 
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        
        {/* OFFER BADGE (Bottom Left) - Swiggy Style */}
        {offers && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <p className="text-white font-black text-xs tracking-tight">
              {offers}
            </p>
          </div>
        )}
        
        {/* RATING BADGE (Top Left) - Swiggy Style */}
        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md shadow-lg ${getRatingColor(ratingValue)}`}>
          <FaStar className="text-white text-[10px]" />
          <span className="text-white font-black text-xs">{ratingText}</span>
        </div>
        
        {/* PRICE FOR TWO BADGE (Top Right) */}
        {priceForTwo > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md">
            <p className="text-gray-800 font-black text-[10px] flex items-center gap-0.5">
              <FaRupeeSign size={8} />{priceForTwo} for two
            </p>
          </div>
        )}
      </div>

      {/* ========== DETAILS SECTION ========== */}
      <div className="px-1 mt-2">
        {/* Restaurant Name */}
        <h3 className="text-sm sm:text-base font-black text-gray-800 truncate capitalize">
          {name}
        </h3>
        
        {/* Rating & Reviews Row */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${getRatingColor(ratingValue)}`}>
            <FaStar className="text-white text-[8px]" />
            <span className="text-white font-black text-[10px]">{ratingText}</span>
          </div>
          {totalReviews > 0 && (
            <span className="text-gray-500 text-[10px] font-medium">
              {totalReviews}+ ratings
            </span>
          )}
        </div>
        
        {/* Cuisine / Food Type */}
        {shop?.cuisine && (
          <p className="text-gray-500 text-[10px] font-medium truncate mt-1">
            {shop.cuisine}
          </p>
        )}
        
        {/* Location and Time Row */}
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-[10px] font-medium">
          <FaClock size={10} className="text-gray-400" />
          <span>{deliveryTime}</span>
          <span className="text-gray-300">•</span>
          <FaMapMarkerAlt size={9} className="text-gray-400" />
          <span className="truncate">{area || city || "Location"}</span>
        </div>
        
        {/* Offer Text (if any) */}
        {offers && (
          <p className="text-orange-600 font-black text-[9px] uppercase tracking-tighter mt-1 truncate">
            {offers}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopCard;