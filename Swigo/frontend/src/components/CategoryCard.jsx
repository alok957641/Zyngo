import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate use karenge route change ke liye

function CategoryCard({ data }) {
  const navigate = useNavigate();

  return (
    <div 
      // ✅ Click karte hi ye dynamic URL par bhej dega (e.g., /category/Pizza)
      onClick={() => navigate(`/category/${data.category}`)} 
      className="flex flex-col items-center gap-2 md:gap-3 cursor-pointer group shrink-0 transition-all"
    >
      
      {/* Image Container */}
      <div className="w-[85px] h-[85px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden bg-gray-50 shadow-md group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 ring-2 ring-transparent group-hover:ring-orange-500 ring-offset-2 md:ring-offset-4">
        <img 
          src={data.image} 
          alt={data.category} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      {/* Category Name */}
      <span className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300 uppercase tracking-tight">
        {data.category}
      </span>
      
    </div>
  );
}

export default CategoryCard;