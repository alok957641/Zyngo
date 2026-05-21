import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNav from "../components/UserNav";
import ItemCard from "../components/ItemCard";
import { FaStar, FaMapMarkerAlt, FaMotorcycle } from "react-icons/fa";

function ShopPage() {
  const { shopId } = useParams();
  const { ShopsOfMyCity, itemsInMyCity } = useSelector((state) => state.user);

  // 1. Current Shop find karo
  const currentShop = ShopsOfMyCity?.find((s) => s._id === shopId);

  // 2. Sirf is shop ke items filter karo
  const shopItems = itemsInMyCity?.filter((item) => {
    // Check if item.shop is an object or just ID
    const itemShopId = item?.shop?._id || item?.shop;
    return itemShopId === shopId;
  });

  if (!currentShop) return <div className="p-20 text-center font-bold uppercase tracking-widest">Loading Restaurant...</div>;

  return (
    <div className="w-full min-h-screen bg-white">
      <UserNav />

      {/* 🏠 RESTAURANT HEADER */}
      <div className="max-w-5xl mx-auto p-4 md:p-10 mt-4">
        <div className="flex flex-col md:flex-row gap-8 items-start border-b border-dashed pb-10">
          {/* Shop Image */}
          <div className="w-full md:w-72 aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={currentShop.image || "https://via.placeholder.com/400"} 
              className="w-full h-full object-cover" 
              alt={currentShop.shopName}
            />
          </div>

          {/* Shop Info */}
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase leading-none">
              {currentShop.shopName || currentShop.name}
            </h1>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-1.5 bg-green-700 text-white px-3 py-1 rounded-xl font-black">
                 <FaStar /> {currentShop.rating || "4.2"}
               </div>
               <div className="flex items-center gap-2 text-gray-500 font-bold uppercase text-sm">
                 <FaMotorcycle className="text-orange-500 text-xl" />
                 <span>30-35 MINS • {currentShop.city}</span>
               </div>
            </div>

            <p className="flex items-start gap-2 text-gray-400 font-semibold text-lg italic">
              <FaMapMarkerAlt className="text-orange-600 mt-1" />
              {currentShop.address}
            </p>
          </div>
        </div>

        {/* 🍔 MENU SECTION */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-gray-800 uppercase mb-8 border-l-8 border-orange-600 pl-4">
            Menu ({shopItems?.length || 0})
          </h2>

          {/* Responsive Grid: Ek line mein 5 items for Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-20">
            {shopItems && shopItems.length > 0 ? (
              shopItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed">
                 <p className="text-gray-400 font-bold uppercase tracking-widest">No items found for this restaurant</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;