import React, { useRef, useEffect, useState, useCallback } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import UserNav from "../components/UserNav.jsx";
import { categories } from "../category.js";
import CategoryCard from "./CategoryCard.jsx";
import ShopCard from "./ShopCard.jsx";
import ItemCard from "../components/ItemCard.jsx";
import { FiArrowLeft, FiArrowRight, FiClock, FiLock } from "react-icons/fi";
import { setSelectedCategory } from "../redux/userSlice";
import axios from "axios";

const serverurl = "https://zyngo.onrender.com";

function UserDeshboard() {
  const dispatch = useDispatch();
  const categoryScrollRef = useRef(null);
  const shopScrollRef = useRef(null);

  const { City, searchTerm, selectedCategory } = useSelector((state) => state.user);

  const [liveShops, setLiveShops] = useState([]);
  const [liveItems, setLiveItems] = useState([]);
  const [uiLoading, setUiLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  // ✅ Cache data in localStorage
  const loadCachedData = useCallback(() => {
    if (!City) return false;
    try {
      const cachedShops = localStorage.getItem(`shops_${City}`);
      const cachedItems = localStorage.getItem(`items_${City}`);
      const cacheTime = localStorage.getItem(`cache_time_${City}`);
      
      if (cachedShops && cachedItems && cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        if (age < 30000) {
          setLiveShops(JSON.parse(cachedShops));
          setLiveItems(JSON.parse(cachedItems));
          setUiLoading(false);
          return true;
        }
      }
    } catch (e) {}
    return false;
  }, [City]);

  const fetchLiveClusterData = useCallback(async () => {
    if (!City) return;
    const hasCache = loadCachedData();
    if (hasCache) {
      setTimeout(() => refreshData(), 100);
      return;
    }
    await refreshData();
  }, [City, loadCachedData]);

  const refreshData = async () => {
    if (!City || !isMounted) return;
    try {
      const cleanCity = City.trim();
      
      const [shopRes, itemRes] = await Promise.all([
        axios.get(`${serverurl}/api/shop/getShopByCity/${cleanCity}`, { 
          withCredentials: true,
          timeout: 8000 
        }),
        axios.get(`${serverurl}/api/item/getbycity/${cleanCity}`, { 
          withCredentials: true,
          timeout: 8000 
        })
      ]);

      if (!isMounted) return;

      let extractedShops = Array.isArray(shopRes.data) ? shopRes.data : shopRes.data?.shops || [];
      let extractedItems = Array.isArray(itemRes.data) ? itemRes.data : itemRes.data?.items || [];

      setLiveShops(extractedShops);
      setLiveItems(extractedItems);
      
      localStorage.setItem(`shops_${City}`, JSON.stringify(extractedShops));
      localStorage.setItem(`items_${City}`, JSON.stringify(extractedItems));
      localStorage.setItem(`cache_time_${City}`, Date.now().toString());
      
    } catch (err) {
      console.error("📡 Fetch Error:", err?.message);
    } finally {
      if (isMounted) setUiLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchLiveClusterData();

    const autoRefreshTimer = setInterval(() => {
      if (isMounted) refreshData();
    }, 30000);

    return () => {
      setIsMounted(false);
      clearInterval(autoRefreshTimer);
    };
  }, [City, fetchLiveClusterData]);

  const closedShopIds = new Set(
    liveShops
      .filter(shop => shop.owner?.isOnline === false || shop.isOnline === false)
      .map(shop => shop._id?.toString())
  );

  const filteredShops = liveShops.filter((shop) => {
    const name = shop.shopName || shop.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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

  // Skeleton Loading
  if (uiLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA]">
        <UserNav />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 mt-4">
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between">
              <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-20 w-20 bg-gray-200 rounded-2xl shrink-0"></div>
              ))}
            </div>
            <div className="h-6 w-40 bg-gray-200 rounded-full"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#FAFAFA]">
      <UserNav />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-4 sm:py-6">
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          
          {/* ========== 1. CATEGORIES ========== */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h1 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                <span className="text-orange-600">order</span>
              </h1>
              <div className="flex gap-2">
                <button onClick={() => scroll(categoryScrollRef, "left")} className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
                  <FiArrowLeft className="text-sm sm:text-lg" />
                </button>
                <button onClick={() => scroll(categoryScrollRef, "right")} className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
                  <FiArrowRight className="text-sm sm:text-lg" />
                </button>
              </div>
            </div>
            <div ref={categoryScrollRef} className="w-full flex overflow-x-auto gap-3 sm:gap-6 md:gap-10 pb-3 scroll-smooth [&::-webkit-scrollbar]:hidden">
              {categories.map((cate, index) => (
                <div key={index} className="shrink-0">
                  <CategoryCard data={cate} />
                </div>
              ))}
            </div>
          </div>

          {/* ========== 2. RESTAURANTS - MOBILE GRID (2 per row) ========== */}
          <div className="border-t border-gray-100 pt-6 sm:pt-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                Top restaurants in {City}
              </h2>
              <div className="hidden sm:flex gap-3">
                <button onClick={() => scroll(shopScrollRef, "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FiArrowLeft />
                </button>
                <button onClick={() => scroll(shopScrollRef, "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <FiArrowRight />
                </button>
              </div>
            </div>
            
            {/* ✅ Mobile: 2 columns grid, Desktop: Horizontal scroll */}
            <div className="block md:hidden">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {filteredShops?.slice(0, 6).map((shop) => {
                  const isClosed = shop.owner?.isOnline === false || shop.isOnline === false;
                  return (
                    <div key={shop._id} className="relative">
                      {isClosed && (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/85 to-red-950/70 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600/20 to-rose-500/10 border border-red-500/40 flex items-center justify-center mb-1">
                            <FiClock size={18} className="text-red-500" />
                          </div>
                          <span className="text-red-400 font-black text-[8px] uppercase tracking-wider">Closed</span>
                        </div>
                      )}
                      <ShopCard shop={shop} />
                    </div>
                  );
                })}
              </div>
              {filteredShops?.length > 6 && (
                <button className="w-full mt-3 py-2 text-center text-orange-500 text-xs font-black uppercase tracking-wider">
                  View All Restaurants →
                </button>
              )}
            </div>

            {/* Desktop Horizontal Scroll */}
            <div className="hidden md:block">
              <div ref={shopScrollRef} className="flex overflow-x-auto gap-5 lg:gap-8 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden">
                {filteredShops?.map((shop) => {
                  const isClosed = shop.owner?.isOnline === false || shop.isOnline === false;
                  return (
                    <div key={shop._id} className={`shrink-0 w-[260px] lg:w-[280px] relative rounded-2xl transition-all duration-500 ${isClosed ? 'opacity-95 pointer-events-none' : 'hover:scale-[1.02]'}`}>
                      {isClosed && (
                        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-slate-950/80 to-red-950/70 backdrop-blur-[5px] z-30 flex flex-col items-center justify-center p-4 rounded-2xl">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600/20 to-rose-500/10 border border-red-500/40 flex items-center justify-center mb-2">
                            <FiClock size={22} className="text-red-500" />
                          </div>
                          <h4 className="text-red-400 font-black text-xs tracking-wide uppercase text-center">CLOSED</h4>
                        </div>
                      )}
                      <ShopCard shop={shop} />
                    </div>
                  );
                })}
              </div>
            </div>

            {filteredShops?.length === 0 && (
              <div className="w-full py-10 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Restaurants Found</p>
              </div>
            )}
          </div>

          {/* ========== 3. FOOD ITEMS - MOBILE GRID (2 per row) ========== */}
          <div className="border-t border-gray-100 pt-6 sm:pt-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                {selectedCategory !== "All" ? `${selectedCategory}` : `Best Dishes`}
              </h2>
              {selectedCategory !== "All" && (
                <button onClick={() => dispatch(setSelectedCategory("All"))} className="text-[10px] sm:text-xs font-black text-orange-600 border-b-2 border-orange-600 uppercase">
                  SHOW ALL
                </button>
              )}
            </div>

            {/* ✅ Mobile: 2 columns grid - Swiggy/Zomato style */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const targetShopId = item.shop?._id?.toString() || item.shop?.toString();
                  const isItemUnavailable = closedShopIds.has(targetShopId);
                  return (
                    <div key={item._id} className={`relative transition-all duration-500 ${isItemUnavailable ? 'opacity-70' : ''}`}>
                      {isItemUnavailable && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center rounded-xl">
                          <FiLock size={14} className="text-orange-400 mb-1" />
                          <span className="text-orange-400 font-black text-[7px] uppercase tracking-wider">Closed</span>
                        </div>
                      )}
                      <ItemCard item={item} />
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 py-16 text-center w-full bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Items Found</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDeshboard;