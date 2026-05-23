import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

// Pages & Components
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
import Forgetpassword from "./pages/Forgetpassword.jsx";
import CreateAndEditShop from "./pages/CreateAndEditShop.jsx";
import AddItem from "./pages/AddItem.jsx";
import EditItem from "./pages/EditItem.jsx";
import Cartpage from "./pages/Cartpage.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import DelevryBoyDeshboard from "./components/DelevryBoyDeshboard.jsx";
import RiderEarnings from "./pages/RiderEarnings";
import RiderHistory from "./pages/RiderHistory";
import RiderProfile from "./pages/RiderProfile";
import OwnerEarnings from "./pages/OwnerEarnings.jsx";
import AdminPayouts from "./pages/AdminPayouts.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";
import AdminDashboardOverview from "./pages/AdminDashboardOverview.jsx";
import AdminRiderManagement from "./pages/AdminRiderManagement.jsx";
import AdminShopManagement from "./pages/AdminShopManagement.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import OwnerDashboard from "./components/OwnerDeshboard.jsx";
import Footer from "./components/Footer.jsx";

// Hooks
import useGetCurruser from "./hooks/useGetCurruser.jsx";
import useGetCity from "./hooks/useGetCity.jsx";
import useGetMyShop from "./hooks/useGetMyShop.jsx";
import useGetShopbyCity from "./hooks/useGetShopbyCity.jsx";
import useGetItemByCity from "./hooks/useGetItemByCity.jsx";
import useGetMyOrders from "./hooks/useGetMyOrders.jsx";
import useGetUpdateLocation from "./hooks/useGetUpdateLocation.jsx";
import { app } from "../firebase.js";


function App() {
  const location = useLocation();

  useEffect(() => {
    axios.defaults.baseURL = "https://zyngo.onrender.com";
    axios.defaults.withCredentials = true;
  }, []);

  useGetCurruser();
  useGetCity();
  useGetMyShop();
  useGetShopbyCity();
  useGetItemByCity();
  useGetMyOrders();
  useGetUpdateLocation();

  const { userData, loading } = useSelector((state) => state.user);

  // 🚀 PREMIUM LOADER
  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[4px] text-orange-500 animate-pulse font-mono">Syncing Zyngo Node...</p>
    </div>
  );

  const path = location.pathname.toLowerCase();
  const showFooter = ["/", "/cart", "/my-orders", "/checkout", "/order-success"].includes(path) || 
                     path.startsWith("/shop/") || 
                     path.startsWith("/category/");

  // Helper function taaki baar baar same logic na likhna pade
  const Protected = ({ children, role }) => {
    if (loading) return null; // Wait karo
    if (!userData) return <Navigate to="/signin" replace />;
    if (role && userData.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: "12px", borderRadius: "15px", background: "#1e293b", color: "#fff" } }} />
      
      <Routes>
        <Route path="/" element={
          !userData ? <Home /> : 
          userData.role === "admin" ? <Navigate to="/admin/dashboard" replace /> :
          userData.role === "deliveryboy" ? <Navigate to="/rider/dashboard" replace /> :
          userData.role === "owner" ? <Navigate to="/owner/dashboard" replace /> :
          <Home />
        } />

        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" replace />} />
        <Route path="/forgetpassword" element={!userData ? <Forgetpassword /> : <Navigate to="/" replace />} />

        {/* Protected Routes Wrapper */}
        <Route path="/CreateAndEditShop" element={<Protected role="owner"><CreateAndEditShop /></Protected>} />
        <Route path="/AddItem" element={<Protected role="owner"><AddItem /></Protected>} />
        <Route path="/EditItem/:itemId" element={<Protected role="owner"><EditItem /></Protected>} />
        <Route path="/cart" element={<Protected><Cartpage /></Protected>} />
        <Route path="/CheckOut" element={<Protected><CheckOut /></Protected>} />
        <Route path="/order-success" element={<Protected><OrderSuccess /></Protected>} />
        <Route path="/my-orders" element={<Protected><MyOrders /></Protected>} />
        <Route path="/category/:catName" element={<Protected><CategoryPage /></Protected>} />
        <Route path="/shop/:shopId" element={<Protected><ShopPage /></Protected>} />
        <Route path="/track-order/:orderId" element={<Protected><TrackOrderPage /></Protected>} />

        <Route path="/rider/dashboard" element={<Protected role="deliveryboy"><DelevryBoyDeshboard /></Protected>} />
        <Route path="/rider/earnings" element={<Protected role="deliveryboy"><RiderEarnings /></Protected>} />
        <Route path="/rider/history" element={<Protected role="deliveryboy"><RiderHistory /></Protected>} />
        <Route path="/rider/profile" element={<Protected role="deliveryboy"><RiderProfile /></Protected>} />

        <Route path="/owner/dashboard" element={<Protected role="owner"><OwnerDashboard /></Protected>} />
        <Route path="/owner/earnings" element={<Protected role="owner"><OwnerEarnings /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default app ;