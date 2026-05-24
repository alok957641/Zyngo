import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";


// Pages & Components Imports
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

// Rider Panel Pages
import DelevryBoyDeshboard from "./components/DelevryBoyDeshboard.jsx";
import RiderEarnings from "./pages/RiderEarnings";
import RiderHistory from "./pages/RiderHistory";
import RiderProfile from "./pages/RiderProfile";

// Owner & Billing Pages
import OwnerEarnings from "./pages/OwnerEarnings.jsx";
import AdminPayouts from "./pages/AdminPayouts.jsx";

// Admin System Protectors & Components
import AdminRoute from "./components/AdminRoute.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";
import AdminDashboardOverview from "./pages/AdminDashboardOverview.jsx";
import AdminRiderManagement from "./pages/AdminRiderManagement.jsx";
import AdminShopManagement from "./pages/AdminShopManagement.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";

// Global Live Sync Hooks
import useGetCurruser from "./hooks/useGetCurruser.jsx";
import useGetCity from "./hooks/useGetCity.jsx";
import useGetMyShop from "./hooks/useGetMyShop.jsx";
import useGetShopbyCity from "./hooks/useGetShopbyCity.jsx";
import useGetItemByCity from "./hooks/useGetItemByCity.jsx";
import useGetMyOrders from "./hooks/useGetMyOrders.jsx";
import useGetUpdateLocation from "./hooks/useGetUpdateLocation.jsx";

function App() {
  // 🔥 Hooks are kept flat to comply with core React alignment rules
  useGetCurruser();
  useGetCity();
  useGetMyShop();
  useGetShopbyCity();
  useGetItemByCity();
  useGetMyOrders();
  useGetUpdateLocation();

  useEffect(() => {
    // 🛡️ GLOBAL INTERCEPTOR: Agar kabhi bhi server se 401 aaye, toh user ko logout karke login page pe bhejo
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("🛡️ Unauthorized! Forcing Logout...");
          localStorage.clear(); // Saara data saaf
          window.location.href = "/signin"; // Force redirect
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  // ✅ Add loading state from Redux
  const { userData, loading } = useSelector((state) => state.user);

  // ✅ Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Swiddy...</p>
          <p className="text-sm text-gray-400 mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "15px",
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.05)",
          },
        }}
      />

      <Routes>
        {/* 🌐 CORE GATEWAY CHECK */}
        <Route
          path="/"
          element={
            !userData ? (
              <Navigate to="/signin" replace />
            ) : userData.role === "admin" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : userData.role === "deliveryboy" ? (
              <Navigate to="/rider/dashboard" replace />
            ) : (
              <Home />
            )
          }
        />

        {/* 🔓 Public Auth Routes */}
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signin"
          element={!userData ? <Signin /> : <Navigate to="/" replace />}
        />
        <Route
          path="/forgetpassword"
          element={!userData ? <Forgetpassword /> : <Navigate to="/" replace />}
        />

        {/* 👑 ADMIN PANEL MESH */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminSidebar /> 
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboardOverview />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="riders" element={<AdminRiderManagement />} />
          <Route path="restaurants" element={<AdminShopManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 🔒 Protected User/Customer Portal Matrix */}
        <Route
          path="/CreateAndEditShop"
          element={
            userData ? <CreateAndEditShop /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/AddItem"
          element={userData ? <AddItem /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/EditItem/:itemId"
          element={userData ? <EditItem /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/cart"
          element={userData ? <Cartpage /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/CheckOut"
          element={userData ? <CheckOut /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/order-success"
          element={
            userData ? <OrderSuccess /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/my-orders"
          element={userData ? <MyOrders /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/category/:catName"
          element={
            userData ? <CategoryPage /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/shop/:shopId"
          element={userData ? <ShopPage /> : <Navigate to="/signin" replace />}
        />
        <Route
          path="/track-order/:orderId"
          element={
            userData ? <TrackOrderPage /> : <Navigate to="/signin" replace />
          }
        />

        {/* 🛵 Rider Fleet Navigation Matrix */}
        <Route
          path="/rider/dashboard"
          element={
            userData && userData.role === "deliveryboy" ? (
              <DelevryBoyDeshboard />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/rider/earnings"
          element={
            userData && userData.role === "deliveryboy" ? (
              <RiderEarnings />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/rider/history"
          element={
            userData && userData.role === "deliveryboy" ? (
              <RiderHistory />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/rider/profile"
          element={
            userData && userData.role === "deliveryboy" ? (
              <RiderProfile />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* 💰 Hub Merchant Node Routes */}
        <Route
          path="/owner/earnings"
          element={
            userData ? <OwnerEarnings /> : <Navigate to="/signin" replace />
          }
        />

        {/* 🚫 Catch-all Route Safety Net */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
}

export default App;