import React, { useState, useEffect } from "react";
import { FiUser, FiPhone, FiMapPin, FiChevronDown, FiLoader, FiNavigation, FiLock } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from "axios";

const serverurl = "https://zyngo.onrender.com";

function OwnerOrderCard({ data }) {
  if (!data || !data.shopOrders || data.shopOrders.length === 0) return null;

  const myShopOrder = data.shopOrders[0];
  const [currentStatus, setCurrentStatus] = useState(myShopOrder?.status || "pending");
  const [availableBoys, setAvailableBoys] = useState([]);
  const [updating, setUpdating] = useState(false);

  const itemsArray = myShopOrder?.items || [];
  const isDelivered = currentStatus === "delivered";
  const isLocked = currentStatus === "out for delivery" || isDelivered;

  // 🔄 1. Global Order Status Sync
  const syncOrderStatus = async () => {
    try {
      const res = await axios.get(`${serverurl}/api/order/get-order-by-id/${data._id}`, { withCredentials: true });
      const freshOrder = res.data;
      
      if (freshOrder && freshOrder.shopOrders) {
        const myFreshShopOrder = freshOrder.shopOrders.find(so => 
          (so.shop?._id || so.shop) === (myShopOrder.shop?._id || myShopOrder.shop)
        );

        if (myFreshShopOrder && myFreshShopOrder.status !== currentStatus) {
          setCurrentStatus(myFreshShopOrder.status);
        }
      }
    } catch (err) {
      console.log("Sync Log Failure");
    }
  };

  // 🔥 2. RADAR RADIAL ENGINE SWITCH POLLING Loop (Har 5 Second me Live Online Riders Fetch)
  const fetchLiveRadarBoys = async () => {
    if (currentStatus !== "out for delivery" || isDelivered) return;
    try {
      const shopId = myShopOrder.shop?._id || myShopOrder.shop;
      // Re-triggering state criteria to strip out offline boys instantly
      const response = await axios.post(
        `${serverurl}/api/order/update-status/${data._id}/${shopId}`,
        { status: currentStatus },
        { withCredentials: true }
      );
      if (response.data?.success || response.status === 200) {
        setAvailableBoys(response.data.availableBoys || []);
      }
    } catch (error) {
      console.log("Radar sync failure");
    }
  };

  useEffect(() => {
    if (isDelivered) return;

    // Status checking loop
    const statusInterval = setInterval(syncOrderStatus, 4000);
    
    // Radar pooling loop trigger
    const radarInterval = setInterval(fetchLiveRadarBoys, 5000); // 👈 HAR 5 SECOND ME RADAR REFRESH!

    return () => {
      clearInterval(statusInterval);
      clearInterval(radarInterval);
    };
  }, [currentStatus, isDelivered]);

  // 🛠️ 3. Dropdown Manual State Updates
  const handleStatusChange = async (newStatus) => {
    if (isDelivered || updating) return;
    
    const oldStatus = currentStatus;
    setCurrentStatus(newStatus); 
    setUpdating(true);

    try {
      const shopId = myShopOrder.shop?._id || myShopOrder.shop;
      const response = await axios.post(
        `${serverurl}/api/order/update-status/${data._id}/${shopId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200 || response.data.success) {
        if (newStatus === "out for delivery") {
          setAvailableBoys(response.data.availableBoys || []);
        }
      } else {
        setCurrentStatus(oldStatus); 
      }
    } catch (error) {
      setCurrentStatus(oldStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 font-sans animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        
        {updating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <FiLoader className="animate-spin text-orange-500 text-2xl" />
          </div>
        )}

        {/* 🆔 Header */}
        <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-400">
              <FiUser size={18} />
            </div>
            <div>
              <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{data.user?.fullname || "Customer"}</h4>
              <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <FiPhone size={12} /> {data.user?.mobile}
              </p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            isDelivered ? "bg-green-50 text-green-600 border-green-200" : "bg-orange-50 text-orange-600 border-orange-200"
          }`}>
            {currentStatus}
          </div>
        </div>

        {/* 📦 Items */}
        <div className="p-6 space-y-4">
          <div className="grid gap-2">
            {itemsArray.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/30 border border-slate-100">
                <div className="flex items-center gap-4">
                  <p className="text-[11px] font-black text-slate-700 capitalize">
                    <span className="text-orange-500 mr-1.5">{item.quantity}x</span> {item.name}
                  </p>
                </div>
                <p className="text-[11px] font-black text-slate-900 italic">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 bg-orange-50/30 rounded-2xl border border-dashed border-orange-100">
            <FiMapPin className="text-orange-500 shrink-0" size={16} />
            <p className="text-[11px] text-slate-600 font-bold italic line-clamp-1">{data.delevryAddress?.text}</p>
          </div>
        </div>

        {/* 🎮 Footer Actions */}
        <div className="px-6 py-5 bg-white border-t border-slate-50 flex items-center justify-between">
          <div className="relative min-w-[160px]">
            <p className={`text-[9px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-2 ${isLocked ? 'text-slate-400' : 'text-orange-500'}`}>
              {isLocked ? <FiLock size={12}/> : <FiNavigation size={12}/>} Update Status
            </p>
            <div className="relative">
              <select
                disabled={isLocked}
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full text-[10px] font-black uppercase tracking-widest pl-4 pr-10 py-3 rounded-2xl border appearance-none transition-all ${
                  isLocked ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" : "bg-white border-slate-200 text-slate-800 hover:border-orange-500"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out for delivery">Out for Delivery</option>
                {isDelivered && <option value="delivered">Delivered</option>}
              </select>
              {!isLocked && <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
            </div>
          </div>

          <div className="text-right">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Earnings</p>
             <div className="flex items-center gap-1.5 font-black text-slate-900 leading-none">
                <FaIndianRupeeSign className="text-sm text-orange-500" />
                <span className="text-2xl tracking-tighter">{myShopOrder?.subtotal || 0}</span>
             </div>
          </div>
        </div>
      </div>

      {/* 📡 Radar Box Panel (Refreshes dynamically with active riders) */}
      {currentStatus === "out for delivery" && !isDelivered && (
        <div className="mt-3 bg-white border border-orange-100 rounded-[1.5rem] p-4 shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Rider Radar Active</p>
             </div>
             <span className="text-[8px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">{availableBoys.length} Nearby</span>
          </div>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1">
            {availableBoys.length > 0 ? availableBoys.map(boy => (
              <div key={boy._id} className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2 shrink-0 animate-in fade-in duration-200">
                <div className="w-6 h-6 bg-slate-900 text-orange-400 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm uppercase">
                  {boy.fullname?.charAt(0) || "R"}
                </div>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{boy.fullname || "Rider"}</p>
              </div>
            )) : <p className="text-[9px] text-slate-400 italic font-medium">Scanning for active fleet partners...</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerOrderCard;