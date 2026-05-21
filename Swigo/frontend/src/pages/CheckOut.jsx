import React, { useState, useMemo } from "react";
import { FiArrowLeft, FiLoader, FiMapPin, FiTruck, FiChevronRight, FiSmartphone, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addMyOrder } from "../redux/userSlice";

// 🚨 Icons for Online Payment
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";

export const serverurl = "import.meta.env.VITE_API_URL";

// Real Distance Formula
const calculateKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(2));
};

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 16);
  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [tip, setTip] = useState(0);

  const position = [location.lat || 25.2500, location.lon || 86.2333];

  // 🧮 ASLI BILLING LOGIC (Synced with Backend)
  const billingData = useMemo(() => {
    let totalDeliveryCharge = 0;
    const platformFee = 7; // 🔥 Fixed to ₹7
    const packagingFeePerShop = 15;
    
    const shopsInCart = [];
    cartItems.forEach(item => {
        const shopId = item.shop?._id || item.shop;
        if (!shopsInCart.find(s => s.id === shopId)) {
            shopsInCart.push({
                id: shopId,
                lat: item.shop?.location?.coordinates?.[1],
                lon: item.shop?.location?.coordinates?.[0]
            });
        }
    });

    shopsInCart.forEach(shop => {
        if (shop.lat && shop.lon && location.lat && location.lon) {
            const dist = calculateKm(location.lat, location.lon, shop.lat, shop.lon);
            // 🔥 ₹10 per KM Exact Logic
            totalDeliveryCharge += Math.round(dist * 10); 
        } else {
            totalDeliveryCharge += 20; // Default if location missing
        }
    });

    const totalPackaging = shopsInCart.length * packagingFeePerShop;
    const gst = 0; // 🔥 GST Removed (0)
    const grandTotal = totalAmount + totalDeliveryCharge + platformFee + totalPackaging + gst + tip;

    return { deliveryCharge: totalDeliveryCharge, packaging: totalPackaging, platformFee, gst, grandTotal };
  }, [cartItems, location, totalAmount, tip]);

  // 🌐 RAZORPAY PAYMENT LOGIC
  const initPayment = (razorpayOrder, orderId) => {
    const options = {
      key: "rzp_test_SoP0awKZdS5zFG", 
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Swigo Bhagalpur",
      description: "Food Order",
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          setLoading(true);
          const { data } = await axios.post(`${serverurl}/api/order/verify-payment`, {
            ...response, orderId
          }, { withCredentials: true });

          if (data.success) navigate("/order-success");
        } catch (error) {
          alert("Payment Failed!");
        } finally { setLoading(false); }
      },
      prefill: {
        name: userData?.fullname || "Customer",
        contact: userData?.mobile || ""
      },
      theme: { color: "#0F172A" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ✅ PLACE ORDER API
  const handleplaceorder = async () => {
    if (!address) return alert("Bhai pehle map par location select kar!");

    try {
      setLoading(true);
      const result = await axios.post(`${serverurl}/api/order/place-order`, {
        paymentMethod: paymentMethod.toLowerCase(),
        deliveryAddress: { text: address, latitude: location.lat, longitude: location.lon },
        totalAmount: billingData.grandTotal, 
        cartItems,
        tip
      }, { withCredentials: true });

      if (result.data.success) {
        dispatch(addMyOrder(result.data.order));
        
        if (paymentMethod === "ONLINE" && result.data.razorpayOrder) {
            initPayment(result.data.razorpayOrder, result.data.order._id);
        } else {
            navigate("/order-success"); 
        }
      }
    } catch (error) {
      alert("Order place nahi hua, console check kar bhai!");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-40 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 🔝 FLAT HEADER */}
      <header className="sticky top-0 z-[1001] bg-white border-b border-slate-200 px-4 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-none hover:bg-orange-100 hover:text-orange-600 transition-all">
            <FiArrowLeft className="text-2xl" />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter leading-none italic">Secure Checkout</h1>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-[2px]">Real-Time Sync</span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto mt-6 px-4 space-y-6">
        
        {/* 🗺️ LOCATION: EDGE-TO-EDGE STYLE */}
        <section className="bg-white border-2 border-slate-200 p-1 relative shadow-[5px_5px_0px_#e2e8f0]">
          <div className="h-[200px] relative z-0">
            <MapContainer center={position} zoom={15} className="h-full w-full grayscale-[10%]" zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ChangeView center={position} />
              <Marker position={position} icon={markerIcon} />
            </MapContainer>
            
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md p-4 z-[1000] flex items-start gap-3">
               <FiMapPin className="text-orange-500 text-xl shrink-0 mt-0.5" />
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Delivery Target</p>
                  <p className="text-xs font-bold text-white italic leading-tight">{address || "Bhagalpur Node, Bihar"}</p>
               </div>
            </div>
          </div>
        </section>

        {/* 💳 PAYMENT SELECTION: SHARP SQUARES */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[3px] ml-1">Payment Gateway</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* COD CARD */}
            <div onClick={() => setPaymentMethod("COD")} className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center gap-3 ${paymentMethod === "COD" ? "border-orange-500 bg-orange-50 shadow-[4px_4px_0px_#f97316]" : "border-slate-200 bg-white"}`}>
              <div className={`p-4 rounded-full ${paymentMethod === "COD" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                 <FiTruck size={24} />
              </div>
              <div>
                 <p className="text-sm font-black uppercase italic leading-none mb-1">Cash on Delivery</p>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Pay Rider at Door</p>
              </div>
            </div>

            {/* ONLINE CARD */}
            <div onClick={() => setPaymentMethod("ONLINE")} className={`p-6 border-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center gap-3 relative ${paymentMethod === "ONLINE" ? "border-slate-900 bg-slate-50 shadow-[4px_4px_0px_#0f172a]" : "border-slate-200 bg-white"}`}>
              {paymentMethod === "ONLINE" && <FiCheckCircle className="absolute top-4 right-4 text-slate-900 text-xl" />}
              <div className={`p-4 rounded-full ${paymentMethod === "ONLINE" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                 <FiSmartphone size={24} />
              </div>
              <div>
                 <p className="text-sm font-black uppercase italic leading-none mb-2">Digital Payment</p>
                 <div className="flex justify-center gap-3 opacity-80">
                    <SiGooglepay size={18} className={paymentMethod === "ONLINE" ? "text-slate-900" : "text-slate-400"} />
                    <SiPhonepe size={18} className={paymentMethod === "ONLINE" ? "text-slate-900" : "text-slate-400"} />
                    <SiPaytm size={24} className={paymentMethod === "ONLINE" ? "text-slate-900" : "text-slate-400"} />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🧾 FINAL BILL: RECEIPT STYLE */}
        <section className="bg-white border-2 border-slate-200 p-8 shadow-[5px_5px_0px_#e2e8f0]">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
            <p className="text-[12px] font-black text-slate-900 uppercase tracking-[4px]">Final Bill</p>
            <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-1 uppercase tracking-widest">Synced</span>
          </div>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between font-bold text-slate-600">
              <span className="uppercase">Item Total</span>
              <span className="text-slate-900 font-black">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-600">
              <span className="uppercase">Delivery (₹10/km)</span>
              <span className="text-slate-900 font-black">₹{billingData.deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-600">
              <span className="uppercase">Platform Fee</span>
              <span className="text-slate-900 font-black">₹{billingData.platformFee}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-600">
              <span className="uppercase">Packaging</span>
              <span className="text-slate-900 font-black">₹{billingData.packaging}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 flex justify-between items-end">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[3px] mb-1">To Pay</span>
                <span className="text-4xl font-black text-orange-600 tracking-tighter italic leading-none">₹{billingData.grandTotal}</span>
            </div>
            <div className="bg-green-100 px-3 py-1.5 border border-green-300">
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">No GST</span>
            </div>
          </div>
        </section>
      </main>

      {/* 🚀 FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t-2 border-slate-200 z-[1002]">
        <div className="max-w-xl mx-auto">
           <button 
             onClick={handleplaceorder} 
             disabled={loading}
             className="w-full bg-slate-900 hover:bg-orange-600 text-white py-5 rounded-none font-black uppercase tracking-[4px] text-sm transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
           >
              {loading ? (
                <FiLoader className="animate-spin text-2xl" />
              ) : (
                <>
                  <span>{paymentMethod === "ONLINE" ? "Pay & Execute Order" : "Confirm COD Order"}</span>
                  <FiChevronRight className="text-2xl" />
                </>
              )}
           </button>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;