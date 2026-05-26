import React from 'react';
import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  // Real Data Mapping
  const name = shop?.name || shop?.shopName || "Restaurant Name";
  const image = shop?.image || "https://via.placeholder.com/400x250?text=Food";
  
  // Real Rating
  const ratingValue = shop?.rating || shop?.averageRating || 0;
  const totalReviews = shop?.totalReviews || shop?.totalRatings || 0;
  const isNew = ratingValue === 0;
  
  // Real Delivery Time
  const deliveryTime = shop?.deliveryTime || shop?.estimatedTime || "30-40 min";
  
  // Location
  const city = shop?.city || "";
  const area = shop?.area || shop?.locality || "";
  
  // Offers - Real data from backend
  const offers = shop?.offers || shop?.discount || "";
  
  // Dynamic Rating Color (Swiggy Style)
  const getRatingClass = (val) => {
    if (val >= 4.0) return "bg-green-600";
    if (val >= 3.5) return "bg-green-500";
    if (val >= 3.0) return "bg-orange-500";
    return "bg-red-500";
  };

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
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
        <img 
          src={image} 
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        
        {/* Offer Badge - Bottom Left (Swiggy Style) */}
        {offers && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
            <p className="text-white font-black text-[10px] sm:text-xs tracking-tight">
              {offers}
            </p>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="px-1 mt-2">
        {/* Restaurant Name */}
        <h3 className="text-sm sm:text-base font-black text-gray-800 truncate capitalize">
          {name}
        </h3>
        
        {/* Rating Row - Swiggy Style */}
        <div className="flex items-center gap-1 mt-0.5">
          {!isNew ? (
            <>
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${getRatingClass(ratingValue)}`}>
                <FaStar className="text-white text-[8px] sm:text-[9px]" />
                <span className="text-white font-black text-[9px] sm:text-[10px]">{ratingValue.toFixed(1)}</span>
              </div>
              {totalReviews > 0 && (
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium">
                  {totalReviews}+ ratings
                </span>
              )}
            </>
          ) : (
            <div className="bg-gray-500 px-1.5 py-0.5 rounded">
              <span className="text-white font-black text-[9px] sm:text-[10px]">NEW</span>
            </div>
          )}
        </div>
        
        {/* Cuisine Type */}
        {shop?.cuisine && (
          <p className="text-gray-500 text-[9px] sm:text-[10px] font-medium truncate mt-0.5">
            {shop.cuisine}
          </p>
        )}
        
        {/* Location and Time */}
        <div className="flex items-center gap-1 mt-1 text-gray-500 text-[9px] sm:text-[10px] font-medium">
          <FaClock size={10} className="text-gray-400" />
          <span>{deliveryTime}</span>
          <span className="text-gray-300">•</span>
          <FaMapMarkerAlt size={9} className="text-gray-400" />
          <span className="truncate">{area || city || "Location"}</span>
        </div>
        
        {/* Offer Text */}
        {offers && (
          <p className="text-orange-600 font-black text-[8px] sm:text-[9px] uppercase tracking-tighter mt-1 truncate">
            {offers}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopCard;