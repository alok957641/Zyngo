import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiShoppingBag, FiMapPin } from "react-icons/fi";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import useGetMyShop from "../hooks/useGetMyShop"; 
import axios from "axios";

const serverurl = "http://localhost:8000";

function MyOrders() {
  useGetMyShop(); 
  const navigate = useNavigate();
  
  const { userData, myOrders: reduxOrders } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner); 
  
  // 💡 YE HAI ASLI ILAJ: Local state mein orders rakho
  const [localOrders, setLocalOrders] = useState([]);
  const [isGoingBack, setIsGoingBack] = useState(false);

  // 🔄 1. Fresh Orders Fetch Function
  const fetchLatestOrders = async () => {
    try {
      const res = await axios.get(`${serverurl}/api/order/my-orders`, { withCredentials: true });
      
      if (res.data && Array.isArray(res.data)) {
        // 🔥 DATA MILTE HI UI UPDATE KARO
        setLocalOrders(res.data); 
        console.log("🔄 UI Update Triggered: ", res.data.length, "orders");
      }
    } catch (err) {
      console.log("Sync Error:", err.response?.status);
    }
  };

  // 🔥 2. POLLING ENGINE: Har 3 second mein check
  useEffect(() => {
    fetchLatestOrders(); // Initial load

    const orderPoll = setInterval(() => {
      fetchLatestOrders();
    }, 3000); 

    return () => clearInterval(orderPoll); 
  }, []);

  // 💡 Render ke liye orders choose karo
  // Pehle localOrders dekho, agar khali hai toh Redux wala (initial load ke liye)
  const ordersToDisplay = localOrders.length > 0 ? localOrders : (reduxOrders || []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 font-sans">
      
      <div className="max-w-4xl w-full mb-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-slate-500 font-bold">
            <div className="p-2.5 bg-white rounded-full shadow-sm border border-slate-200">
               <FiArrowLeft />
            </div>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-200">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span>{ordersToDisplay.length} Orders Live</span>
          </div>
        </div>

        {userData?.role === "owner" && myShopData && (
          <div className="bg-slate-900 p-5 rounded-[2.5rem] shadow-xl flex items-center gap-4 animate-in zoom-in duration-500">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {myShopData.name?.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">Active Store</p>
              <h2 className="text-xl font-black text-white italic tracking-tighter">{myShopData.name}</h2>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl w-full space-y-6 px-4 pb-20">
        {ordersToDisplay.length > 0 ? (
          ordersToDisplay.map((order) => (
            userData?.role === "user" 
              ? <UserOrderCard data={order} key={order._id} />
              : <OwnerOrderCard data={order} key={order._id} />
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
             <FiShoppingBag className="mx-auto text-6xl text-slate-100 mb-4 animate-bounce" />
             <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Searching...</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;