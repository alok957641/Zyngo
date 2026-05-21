import React, { useState, useEffect } from "react";
import { FiPackage, FiMapPin, FiShoppingBag, FiNavigation, FiCheckCircle, FiXCircle, FiInfo, FiStar } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function UserOrderCard({ data }) {
  const navigate = useNavigate();

  // Initialize state directly from the order data
  const [rating, setRating] = useState(data.rating || 0);
  const [hasRated, setHasRated] = useState(Boolean(data.isRated) || (data.rating > 0));
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if the 'data' prop changes after a refresh/refetch
  useEffect(() => {
    setRating(data.rating || 0);
    setHasRated(Boolean(data.isRated) || (data.rating > 0));
  }, [data]);

  if (!data || !data.shopOrders) return null;

  const allShopsDelivered = data.shopOrders.every(
    (shop) => shop.status?.toLowerCase() === "delivered"
  );
  
  const orderStatus = data.status?.toLowerCase() || "pending";
  const isCancelled = orderStatus === "cancelled";
  const isDelivered = orderStatus === "delivered" || allShopsDelivered;

  const otherFees = (data.gst || 0) + (data.platformFee || 0) + (data.tip || 0);

  const handleRating = async (ratingValue) => {
    if (hasRated || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await axios.post(`http://localhost:8000/api/rating/add`, {
        orderId: data._id,
        shopId: data.shopOrders[0]?.shop?._id, 
        rating: ratingValue
      }, { withCredentials: true });

      if (response.data.success) {
        setHasRated(true);
        setRating(ratingValue);
        toast.success("Thank you for your feedback!");
      }
    } catch (error) {
      console.error("Rating Error:", error);
      
      // 🚀 FIXED: Agar backend bole "Already Rated" (400), toh UI lock kar do
      if (error.response && error.response.status === 400) {
        setHasRated(true);
        toast.error("This order is already rated!");
      } else {
        toast.error("Failed to submit rating. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "delivered") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === "preparing") return "bg-amber-50 text-amber-600 border-amber-100";
    if (s === "out for delivery") return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === "cancelled") return "bg-red-50 text-red-600 border-red-100";
    return "bg-slate-100 text-slate-500 border-slate-200";
  };

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-6 font-sans transition-all">
      
      {/* Header Section */}
      <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-2">
          <FiPackage className="text-orange-400 text-xs" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            ORDER ID: #{data._id?.slice(-6).toUpperCase()}
          </span>
        </div>
        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-tighter">
          {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "Recently"}
        </p>
      </div>

      {/* Restaurant & Item Details */}
      <div className="p-5 space-y-6">
        {data.shopOrders.map((shopOrder, sIdx) => {
          const itemsArray = shopOrder.items || shopOrder.shopOrderItems || [];
          return (
            <div key={shopOrder._id || sIdx} className="relative">
               <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                     <FiShoppingBag size={14} />
                   </div>
                   <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px]">
                     {shopOrder.shop?.name || "Restaurant"}
                   </h4>
                 </div>
                 <div className={`px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusStyle(shopOrder.status)}`}>
                   {shopOrder.status}
                 </div>
               </div>

               <div className="space-y-1.5 ml-10">
                 {itemsArray.map((item, iIdx) => (
                   <p key={iIdx} className="text-[11px] text-slate-500 font-semibold">
                     <span className="text-orange-400 font-bold mr-1">{item.quantity}x</span> {item.name}
                   </p>
                 ))}
               </div>

               <div className="mt-4 ml-10 p-3 bg-slate-50/50 rounded-2xl flex justify-between items-center border border-slate-100/50">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Store Subtotal</span>
                  <div className="flex items-center text-xs font-black text-slate-800">
                    <FaIndianRupeeSign className="text-[10px] text-slate-400 mr-0.5" />
                    <span>{shopOrder.subtotal || 0}</span>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Rating Area */}
      <div className="px-5 pb-5 space-y-4">
        {isDelivered && !isCancelled && (
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 text-center transition-all">
            {hasRated ? (
              <div className="flex flex-col items-center gap-1 py-1">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                   <FiCheckCircle size={12} /> FEEDBACK SUBMITTED
                 </p>
                 <div className="flex items-center gap-1 bg-amber-400 text-white px-5 py-2 rounded-full shadow-md">
                    <span className="text-sm font-black">{rating}</span>
                    <FiStar size={14} className="fill-white" />
                 </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 leading-none">
                  How was your experience?
                </p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      disabled={isSubmitting}
                      className="transition-transform active:scale-125 hover:scale-110"
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <FiStar
                        size={28}
                        className={`${star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-orange-500/[0.03] rounded-[2.2rem] p-6 space-y-5 border border-orange-100/50">
          <div className="flex justify-between items-end">
            <div className="space-y-2 max-w-[65%]">
              <div className="flex items-center gap-1.5 text-orange-500">
                <FiMapPin size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Delivery Address</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate italic leading-tight">
                {data.delevryAddress?.text}
              </p>
              {otherFees > 0 && (
                 <div className="flex items-center gap-1.5 text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
                    <FiInfo size={10} className="shrink-0" /> 
                    <span>Includes ₹{otherFees} in Taxes & Fees</span>
                 </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1 leading-none">Total Paid</p>
              <div className="flex items-center justify-end font-black text-slate-900 leading-none">
                <FaIndianRupeeSign className="text-sm mr-0.5" />
                <span className="text-2xl tracking-tighter">{data.totalAmount}</span>
              </div>
            </div>
          </div>

          <button 
            disabled={isDelivered || isCancelled}
            onClick={() => navigate(`/track-order/${data._id}`)}
            className={`w-full py-4.5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]
              ${isDelivered ? "bg-emerald-500 text-white" : isCancelled ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white hover:bg-orange-600"} transition-colors`}
          >
            {isDelivered ? <><FiCheckCircle size={14} /> Delivered Successfully</> : isCancelled ? <><FiXCircle size={14} /> Order Cancelled</> : <><FiNavigation size={14} className="animate-pulse" /> Track Order</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserOrderCard;