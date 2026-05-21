import React from 'react';
import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  // 🆔 REAL DATA MAPPING (Backend Fields se match kiya)
  const name = shop?.name || shop?.shopName || "Restaurant Name";
  const image = shop?.image || "https://via.placeholder.com/400x250?text=Food";
  
  // ⭐ RATING LOGIC
  const ratingValue = shop?.averageRating || 0; 
  const totalReviews = shop?.totalRatings || 0;
  const isNew = ratingValue === 0;

  const time = shop?.deliveryTime || "25-30 min";
  const city = shop?.city || "";
  const address = shop?.address || "";
  const offers = shop?.offers;

  // 🎨 DYNAMIC COLOR LOGIC
  const getRatingClass = (val) => {
    if (val >= 4.0) return "bg-green-700"; // Excellent
    if (val >= 3.0) return "bg-green-500"; // Good
    if (val >= 2.0) return "bg-orange-400"; // Average
    return "bg-gray-400"; // New or Low
  };

  return (
    <div 
      onClick={() => navigate(`/shop/${shop?._id}`)}
      className="flex flex-col gap-2 group cursor-pointer w-full max-w-[280px] hover:scale-[0.98] transition-all duration-300"
    >
      
      {/* Image Section */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-gray-100 shadow-sm border border-slate-100">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {offers && (
          <div className="absolute bottom-2 left-3">
            <p className="text-white font-black text-lg tracking-tighter uppercase drop-shadow-md">
              {offers}
            </p>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="px-1 mt-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col min-w-0">
             <h3 className="text-[15px] font-black text-slate-800 truncate uppercase tracking-tight leading-tight">
               {name}
             </h3>
             {/* Total Reviews Count */}
             {!isNew && (
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {totalReviews} Ratings
                </span>
             )}
          </div>

          {/* ⭐ DYNAMIC RATING BADGE */}
          <div className={`flex items-center gap-1 ${getRatingClass(ratingValue)} text-white px-2 py-0.5 rounded-lg shrink-0 shadow-sm`}>
            <span className="text-[11px] font-black tracking-tighter">
              {isNew ? "NEW" : ratingValue.toFixed(1)}
            </span>
            {!isNew && <FaStar className="text-[8px]" />}
          </div>
        </div>

        {/* Info Line */}
        <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px] mt-1.5 uppercase tracking-tighter">
          <div className="flex items-center gap-1">
            <FaClock className="text-[10px] text-slate-300" />
            <span>{time}</span>
          </div>
          <span className="text-slate-200">•</span>
          <span className="truncate text-orange-600 font-black">{city}</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1 mt-1 opacity-70">
          <FaMapMarkerAlt className="text-slate-400 text-[9px] mt-0.5" />
          <p className="text-slate-500 text-[10px] font-medium leading-tight truncate italic">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;