import React, { useEffect, useState } from "react"; 
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OwnerNav from "./OwnerNav";
import axios from "axios";
import { IoWalletOutline } from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import { FiEdit3, FiPlus, FiStar, FiPower, FiLoader } from "react-icons/fi";
import { FaMapLocationDot } from "react-icons/fa6";
import OwnerItemCard from "./OwnerItemCard";
import useGetMyOrders from "../hooks/useGetMyOrders"; 

const serverurl = "http://localhost:8000";

function OwnerDeshboard() {
  const navigate = useNavigate();
  useGetMyOrders(); 

  const { userData, myOrders } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  const [isShopOnline, setIsShopOnline] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  // --- 🔥 REDIRECT LOGIC: Agar shop nahi hai, toh seedha Create page pe bhej ---
  useEffect(() => {
    if (myShopData === null) {
      navigate("/CreateAndEditShop");
    }
  }, [myShopData, navigate]);

  useEffect(() => {
    if (userData) setIsShopOnline(userData.isOnline !== false);
  }, [userData]);

  const orders = myOrders || [];
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  const handleStatusToggle = async () => {
    try {
      setToggleLoading(true);
      const res = await axios.post(`${serverurl}/api/user/toggle-availability`, {}, { withCredentials: true });
      if (res.data.success) setIsShopOnline(res.data.isOnline);
    } catch (err) { alert("Status update sync failed!"); }
    finally { setToggleLoading(false); }
  };

  // --- 🔥 LOADING STATE ---
  if (myShopData === undefined) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] flex flex-col font-sans relative overflow-x-hidden">
      <OwnerNav />
      <div className="flex-grow flex flex-col items-center p-4 sm:p-8 relative gap-10">
        <div className="w-full max-w-5xl z-10 flex flex-col gap-8">
            {/* Top Bar, Stats, and Inventory Logs remains same */}
            {/* ... */}
        </div>
      </div>
    </div>
  );
}

export default OwnerDeshboard;