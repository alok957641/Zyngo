import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ItemCard from "../components/ItemCard.jsx";
import UserNav from "../components/UserNav.jsx";

function CategoryPage() {
  const { catName } = useParams(); 
  const { itemsInMyCity } = useSelector((state) => state.user);

  // ✅ SMART FILTER: Ab ye 'Burger', 'burger', 'Burgers' sabko pakad lega
  const filteredItems = itemsInMyCity?.filter((item) => {
    // 1. Dono ko lowercase karo aur extra space hatao (.trim)
    const itemCat = item.category?.toLowerCase().trim() || "";
    const urlCat = catName?.toLowerCase().trim() || "";

    // 2. Smart Match: Exact match ho YA ek dusre ke andar ho (e.g. 'burger' in 'burgers')
    return (
      itemCat === urlCat || 
      itemCat.includes(urlCat) || 
      urlCat.includes(itemCat)
    );
  });

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <UserNav />
      
      {/* Side Gaps badha diye hain Swiggy look ke liye */}
      <div className="max-w-[1440px] mx-auto p-6 md:px-16 lg:px-20">
        
        {/* Header */}
        <div className="flex flex-col gap-1 mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">
            Best <span className="text-orange-600">{catName}</span> in Town
          </h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
            {filteredItems?.length || 0} Options available for you
          </p>
        </div>

        {/* Items Grid: Dashboard jaisa 5-column layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 justify-items-center">
          {filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest italic">
                Bhai, "{catName}" mein abhi koi dish nahi mili!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;