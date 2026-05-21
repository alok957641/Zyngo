import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; 
import { FiLoader, FiHome, FiSearch, FiShoppingBag, FiMapPin, FiPhoneCall } from "react-icons/fi";

const serverurl = import.meta.env.VITE_API_URL;

const AdminShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const reduxCity = useSelector((state) => state.user?.City || state.user?.city || "Bhagalpur");

  useEffect(() => {
    const currentCity = reduxCity;

    const fetchShopsData = async () => {
      try {
        setLoading(true);
        const targetUrl = `${serverurl}/api/shop/getShopByCity/${currentCity.trim()}`;
        const res = await axios.get(targetUrl, { withCredentials: true });
        
        if (res.data) {
          let extractedShops = [];
          if (Array.isArray(res.data)) {
            extractedShops = res.data;
          } else if (res.data.shops && Array.isArray(res.data.shops)) {
            extractedShops = res.data.shops;
          } else if (res.data.shopByCity && Array.isArray(res.data.shopByCity)) {
            extractedShops = res.data.shopByCity;
          }
          setShops(extractedShops);
        }
      } catch (err) {
        console.error("❌ Node response mapping fail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentCity) {
      fetchShopsData();
    }
  }, [reduxCity]);

  const filteredShops = Array.isArray(shops) 
    ? shops.filter((shop) => shop?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 bg-[#020617]">
      <FiLoader className="animate-spin text-3xl text-orange-500 mb-3" />
      <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 font-mono">Syncing Restaurant Nodes...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto px-2 text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Restaurant Nodes</h2>
        <p className="text-orange-500 text-[9px] font-black tracking-[3px] uppercase">Active Hub Kitchens & Store Management</p>
      </div>

      {/* MATRIX METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Total Restaurants</p>
          <h3 className="text-2xl font-black text-white">{filteredShops.length} <span className="text-[10px] text-slate-600 font-bold">UNITS</span></h3>
        </div>
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Active Sector</p>
          <h3 className="text-2xl font-black text-orange-500 uppercase tracking-tight italic">{reduxCity}</h3>
        </div>
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl col-span-2 lg:col-span-1">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Data Guard</p>
          <h3 className="text-sm font-black text-green-400 uppercase tracking-wide flex items-center gap-1.5 h-full pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1 inline-block"></span> 100% REAL PIPELINE
          </h3>
        </div>
      </div>

      {/* SEARCH SYSTEM */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1.5 m-auto bottom-1.5 text-slate-500" size={16} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search restaurant by name..."
          className="w-full bg-white/[0.01] border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:bg-white/[0.02] transition-all font-medium"
        />
      </div>

      {/* RESTAURANT CARDS GRID */}
      <div className="flex flex-col gap-3">
        {filteredShops.map((shop) => {
          
          // 🔥 REAL OWNER PHONE MAP: Strict populated extraction
          const realPhone = shop.owner?.mobile || "No Contact";
          
          // 🔥 REAL ORDERS COUNT: Direct database document structure link
          const realOrdersCount = shop.totalOrders || 0; 

          return (
            <div key={shop._id} className="bg-white/[0.01] border border-white/5 p-5 rounded-[1.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.03] transition-all duration-300">
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-lg text-slate-400">
                  <FiHome size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-green-400 uppercase tracking-wider">Kitchen Live</span>
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">{shop.name}</h3>
                  <p className="text-slate-500 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide mt-1">
                    <FiMapPin size={12} className="text-slate-600" /> {shop.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-white/[0.02] md:border-none pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                
                <div className="text-left md:text-right">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center md:justify-end gap-1">
                    Contact Node
                  </p>
                  <a 
                    href={realPhone !== "No Contact" ? `tel:${realPhone}` : "#"} 
                    className="text-xs font-black text-orange-500 bg-orange-500/5 hover:bg-orange-500 hover:text-white border border-orange-500/10 px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 font-mono"
                  >
                    <FiPhoneCall size={11} /> {realPhone}
                  </a>
                </div>

                <div className="h-8 w-[1px] bg-white/5 hidden sm:block"></div>

                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider mb-0.5 flex items-center justify-end gap-1">
                    <FiShoppingBag size={10} className="text-blue-400" /> Lifetime Orders
                  </p>
                  <h4 className="text-xl font-black text-blue-400 tracking-tight font-mono">
                    {realOrdersCount} <span className="text-[9px] text-slate-600 font-black">ORDERS</span>
                  </h4>
                </div>

              </div>
            </div>
          );
        })}

        {filteredShops.length === 0 && (
          <div className="text-center py-16 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/5">
            <FiHome className="mx-auto text-slate-700 mb-3" size={36} />
            <p className="text-slate-500 font-black text-[9px] uppercase tracking-[3px]">No matching restaurants found</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminShopManagement;