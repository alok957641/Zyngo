import React, { useRef, useEffect, useState } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import UserNav from "../components/UserNav.jsx";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard.jsx";
import ShopCard from "./ShopCard.jsx";
import ItemCard from "../components/ItemCard.jsx";
import { FiArrowLeft, FiArrowRight, FiClock, FiLock } from "react-icons/fi";
import { setSelectedCategory } from "../redux/userSlice";
import axios from "axios";

const serverurl = "http://localhost:8000";

function UserDeshboard() {
  const dispatch = useDispatch();
  const categoryScrollRef = useRef(null);
  const shopScrollRef = useRef(null);

  const { City, searchTerm, selectedCategory } = useSelector((state) => state.user);

  // 🚀 LIVE CLUSTER STATES
  const [liveShops, setLiveShops] = useState([]);
  const [liveItems, setLiveItems] = useState([]);
  const [uiLoading, setUiLoading] = useState(true);

  // 📡 AUTOMATIC POLLING REFRESH ENGINE (Silent Backend Worker)
  const fetchLiveClusterData = async () => {
    if (!City) return;
    try {
      const cleanCity = City.trim();
      
      const [shopRes, itemRes] = await Promise.all([
        axios.get(`${serverurl}/api/shop/getShopByCity/${cleanCity}`, { withCredentials: true }),
        axios.get(`${serverurl}/api/item/getbycity/${cleanCity}`, { withCredentials: true })
      ]);

      if (shopRes.data) {
        let extractedShops = Array.isArray(shopRes.data) ? shopRes.data : shopRes.data.shops || [];
        setLiveShops(extractedShops);
      }

      if (itemRes.data) {
        let extractedItems = Array.isArray(itemRes.data) ? itemRes.data : itemRes.data.items || [];
        setLiveItems(extractedItems);
      }
    } catch (err) {
      console.error("📡 Live Sync Matrix Fail: Core nodes are desynced.", err.message);
    } finally {
      setUiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClusterData(); 

    const autoRefreshTimer = setInterval(() => {
      fetchLiveClusterData(); 
    }, 5000);

    return () => clearInterval(autoRefreshTimer); 
  }, [City]);

  // 🔥 CRITICAL PROTECTION LAYER: Closed dukano ki dynamic list/set taiyar karo logic matrix ke liye
  const closedShopIds = new Set(
    liveShops
      .filter(shop => shop.owner?.isOnline === false || shop.isOnline === false)
      .map(shop => shop._id?.toString())
  );

  // 1. SHOPS REAL-TIME FILTER
  const filteredShops = liveShops.filter((shop) => {
    const name = shop.shopName || shop.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 2. ITEMS REAL-TIME FILTER
  const filteredItems = liveItems.filter((item) => {
    const name = item.name || item.itemName || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const itemCat = item.category?.toLowerCase().trim() || "";
    const selectedCat = selectedCategory?.toLowerCase().trim() || "all";
    const matchesCategory = selectedCat === "all" || itemCat === selectedCat;

    return matchesSearch && matchesCategory;
  });

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (uiLoading) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-mono font-black uppercase tracking-[4px] text-slate-400 mt-4">Connecting Bhagalpur Nodes...</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#FAFAFA] overflow-x-hidden selection:bg-orange-500/10">
      <UserNav />

      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-10 p-6 md:px-16 mt-4">
        
        {/* 1. CATEGORIES SECTOR */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
              Inspiration for your <span className="text-orange-600">order</span>
            </h1>
            <div className="flex gap-3">
              <button onClick={() => scroll(categoryScrollRef, "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"><FiArrowLeft className="text-lg" /></button>
              <button onClick={() => scroll(categoryScrollRef, "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"><FiArrowRight className="text-lg" /></button>
            </div>
          </div>
          <div ref={categoryScrollRef} className="w-full flex overflow-x-auto gap-6 md:gap-10 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden">
            {categories.map((cate, index) => <CategoryCard data={cate} key={index} />)}
          </div>
        </div>

        {/* 2. RESTAURANTS PANEL DOCK */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">Top restaurants in {City}</h2>
            <div className="flex gap-3">
              <button onClick={() => scroll(shopScrollRef, "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><FiArrowLeft /></button>
              <button onClick={() => scroll(shopScrollRef, "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><FiArrowRight /></button>
            </div>
          </div>
          <div ref={shopScrollRef} className="flex overflow-x-auto gap-8 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden">
            {filteredShops?.length > 0 ? (
              filteredShops.map((shop) => {
                const isClosed = shop.owner?.isOnline === false || shop.isOnline === false;

                return (
                  <div 
                    key={shop._id} 
                    className={`shrink-0 w-[280px] relative rounded-[2rem] transition-all duration-500 overflow-hidden ${
                      isClosed 
                        ? 'opacity-95 pointer-events-none select-none scale-[0.98]' 
                        : 'opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    {/* 🛑 TAGDA NEON GRADIENT GLASSMORPHIC OVERLAY FOR CLOSED SHOPS */}
                    {isClosed && (
                      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-slate-950/80 to-red-950/70 backdrop-blur-[5px] z-30 flex flex-col items-center justify-center p-6 transition-all duration-300 border border-red-500/10 shadow-inner">
                        {/* Flashing premium glowing border line at top */}
                        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_2px_10px_rgba(239,68,68,0.5)] animate-pulse" />
                        
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600/20 to-rose-500/10 border border-red-500/40 flex items-center justify-center mb-3.5 shadow-xl shadow-red-950 animate-bounce">
                          <FiClock size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        </div>
                        
                        <h4 className="bg-gradient-to-r from-red-400 via-rose-500 to-amber-500 bg-clip-text text-transparent font-sans font-black text-base tracking-[0.25em] uppercase text-center drop-shadow-sm">
                          CLOSED NOW
                        </h4>
                        
                        <span className="text-red-400/90 font-mono font-black text-[9px] uppercase tracking-[0.2em] mt-3 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 shadow-md">
                          Kitchen Offline
                        </span>
                      </div>
                    )}
                    <ShopCard shop={shop} />
                  </div>
                );
              })
            ) : (
              <div className="w-full py-10 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No Restaurants Found</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. FOOD ITEMS GRID MATRIX */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
              {selectedCategory !== "All" ? `${selectedCategory} Specials` : `Best Dishes in ${City}`}
            </h2>
            {selectedCategory !== "All" && (
              <button onClick={() => dispatch(setSelectedCategory("All"))} className="text-xs font-black text-orange-600 border-b-2 border-orange-600 uppercase">SHOW ALL</button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 justify-items-center mb-20">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const targetShopId = item.shop?._id?.toString() || item.shop?.toString();
                const isItemUnavailable = closedShopIds.has(targetShopId);

                return (
                  <div 
                    key={item._id}
                    className={`w-full relative transition-all duration-500 rounded-3xl overflow-hidden ${
                      isItemUnavailable 
                        ? 'opacity-90 pointer-events-none select-none scale-[0.97]' 
                        : 'opacity-100'
                    }`}
                  >
                    {/* 🛑 TAGDA PREMIUM FROSTED OVERLAY FOR DISHES */}
                    {isItemUnavailable && (
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-black/90 backdrop-blur-[3.5px] z-20 flex flex-col items-center justify-center p-3 text-center border border-white/5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-orange-500/30 flex items-center justify-center mb-2 shadow-md">
                          <FiLock size={14} className="text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]" />
                        </div>
                        
                        <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-red-500 bg-clip-text text-transparent font-sans font-black text-[10px] tracking-[0.15em] uppercase leading-none">
                          UNAVAILABLE
                        </span>
                        
                        <p className="text-[8px] font-mono text-rose-400/80 font-bold uppercase mt-2 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 truncate max-w-full">
                          Shop is Closed
                        </p>
                      </div>
                    )}
                    <ItemCard item={item} />
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center w-full bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">No Items Found</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserDeshboard;