import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

// Pages & Components (Aapke imports wahi hain)
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

function App() {
  const { userData, loading } = useSelector((state) => state.user);

  // ✅ FIXED PROTECTED ROUTE LOGIC
  const Protected = ({ children, role }) => {
    if (loading) return <div className="h-screen flex items-center justify-center text-orange-500">Syncing Zyngo...</div>;
    
    if (!userData) return <Navigate to="/signin" replace />;

    // 1. ADMIN BYPASS: Admin ko sab jagah access milega
    if (userData.role === "admin") return children;

    // 2. ROLE CHECK: Agar specific role define hai aur match nahi karta
    if (role && userData.role !== role) {
      if (userData.role === "owner") return <Navigate to="/owner/dashboard" replace />;
      if (userData.role === "deliveryboy") return <Navigate to="/rider/dashboard" replace />;
      return <Navigate to="/" replace />;
    }

    // 3. GENERIC USER ROUTES PROTECTION: 
    // Agar route par role define nahi hai (generic), lekin user 'owner'/'deliveryboy' hai,
    // toh unhe wapas unke dashboard bhejo.
    if (!role && userData.role !== "user") {
      if (userData.role === "owner") return <Navigate to="/owner/dashboard" replace />;
      if (userData.role === "deliveryboy") return <Navigate to="/rider/dashboard" replace />;
    }

    return children;
  };

  return (
    <>
      <Toaster />
      <Routes>
        {/* HOME REDIRECT */}
        <Route path="/" element={
            !userData ? <Home /> : 
            userData.role === "admin" ? <Navigate to="/admin/dashboard" replace /> :
            userData.role === "deliveryboy" ? <Navigate to="/rider/dashboard" replace /> : 
            userData.role === "owner" ? <Navigate to="/owner/dashboard" replace /> : <Home />
        } />

        {/* AUTH */}
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" replace />} />

        {/* OWNER ROUTES */}
        <Route path="/owner/dashboard" element={<Protected role="owner"><OwnerDashboard /></Protected>} />
        <Route path="/CreateAndEditShop" element={<Protected role="owner"><CreateAndEditShop /></Protected>} />
        <Route path="/AddItem" element={<Protected role="owner"><AddItem /></Protected>} />
        <Route path="/EditItem/:itemId" element={<Protected role="owner"><EditItem /></Protected>} />
        <Route path="/owner/earnings" element={<Protected role="owner"><OwnerEarnings /></Protected>} />

        {/* USER ROUTES (role="user" add karna zaroori hai!) */}
        <Route path="/cart" element={<Protected role="user"><Cartpage /></Protected>} />
        <Route path="/CheckOut" element={<Protected role="user"><CheckOut /></Protected>} />
        <Route path="/my-orders" element={<Protected role="user"><MyOrders /></Protected>} />
        <Route path="/shop/:shopId" element={<Protected role="user"><ShopPage /></Protected>} />

        {/* RIDER ROUTES */}
        <Route path="/rider/dashboard" element={<Protected role="deliveryboy"><DelevryBoyDeshboard /></Protected>} />
        <Route path="/rider/earnings" element={<Protected role="deliveryboy"><RiderEarnings /></Protected>} />
        <Route path="/rider/history" element={<Protected role="deliveryboy"><RiderHistory /></Protected>} />
        
        {/* ADMIN ROUTES (Agar admin dashboard banaya hai toh) */}
        {/* <Route path="/admin/dashboard" element={<Protected role="admin"><AdminDashboard /></Protected>} /> */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
