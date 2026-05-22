import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

// Pages
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

// Rider Panel
import DelevryBoyDeshboard from "./components/DelevryBoyDeshboard.jsx";
import RiderEarnings from "./pages/RiderEarnings";
import RiderHistory from "./pages/RiderHistory";
import RiderProfile from "./pages/RiderProfile";

// Owner & Billing
import OwnerEarnings from "./pages/OwnerEarnings.jsx";
import AdminPayouts from "./pages/AdminPayouts.jsx";

// Admin Panel
import AdminRoute from "./components/AdminRoute.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";
import AdminDashboardOverview from "./pages/AdminDashboardOverview.jsx";
import AdminRiderManagement from "./pages/AdminRiderManagement.jsx";
import AdminShopManagement from "./pages/AdminShopManagement.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";

// Hooks
import useGetCurruser from "./hooks/useGetCurruser.jsx";
import useGetCity from "./hooks/useGetCity.jsx";
import useGetMyShop from "./hooks/useGetMyShop.jsx";
import useGetShopbyCity from "./hooks/useGetShopbyCity.jsx";
import useGetItemByCity from "./hooks/useGetItemByCity.jsx";
import useGetMyOrders from "./hooks/useGetMyOrders.jsx";
import useGetUpdateLocation from "./hooks/useGetUpdateLocation.jsx";

function App() {
  // Global Axios Setup
 useEffect(() => {
  axios.defaults.baseURL = "https://zyngo.onrender.com";
  axios.defaults.withCredentials = true;
}, []);


  // Global Hooks
  useGetCurruser();
  useGetCity();
  useGetMyShop();
  useGetShopbyCity();
  useGetItemByCity();
  useGetMyOrders();
  useGetUpdateLocation();

const { userData } = useSelector((state) => state.user);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: "12px", fontWeight: "bold", borderRadius: "15px", background: "#1e293b", color: "#fff" } }} />

      <Routes>
      {/* Gateway - Yahan hum check kar rahe hain role kya hai */}
<Route path="/" element={
  !userData ? (
    <Navigate to="/signin" replace />
  ) : userData.role === "admin" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : userData.role === "deliveryboy" ? (
    <Navigate to="/rider/dashboard" replace />
  ) : userData.role === "owner" ? (
    <Navigate to="/owner/earnings" replace /> 
  ) : (
    <Home /> // Yeh sirf customer/user ke liye
  )
} />
        {/* Auth */}
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" replace />} />
        <Route path="/forgetpassword" element={!userData ? <Forgetpassword /> : <Navigate to="/" replace />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminSidebar /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashboardOverview />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="riders" element={<AdminRiderManagement />} />
          <Route path="restaurants" element={<AdminShopManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Customer/User Protected Routes */}
        <Route path="/CreateAndEditShop" element={userData ? <CreateAndEditShop /> : <Navigate to="/signin" replace />} />
        <Route path="/AddItem" element={userData ? <AddItem /> : <Navigate to="/signin" replace />} />
        <Route path="/EditItem/:itemId" element={userData ? <EditItem /> : <Navigate to="/signin" replace />} />
        <Route path="/cart" element={userData ? <Cartpage /> : <Navigate to="/signin" replace />} />
        <Route path="/CheckOut" element={userData ? <CheckOut /> : <Navigate to="/signin" replace />} />
        <Route path="/order-success" element={userData ? <OrderSuccess /> : <Navigate to="/signin" replace />} />
        <Route path="/my-orders" element={userData ? <MyOrders /> : <Navigate to="/signin" replace />} />
        <Route path="/category/:catName" element={userData ? <CategoryPage /> : <Navigate to="/signin" replace />} />
        <Route path="/shop/:shopId" element={userData ? <ShopPage /> : <Navigate to="/signin" replace />} />
        <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to="/signin" replace />} />

        {/* Rider */}
        <Route path="/rider/dashboard" element={userData?.role === "deliveryboy" ? <DelevryBoyDeshboard /> : <Navigate to="/signin" replace />} />
        <Route path="/rider/earnings" element={userData?.role === "deliveryboy" ? <RiderEarnings /> : <Navigate to="/signin" replace />} />
        <Route path="/rider/history" element={userData?.role === "deliveryboy" ? <RiderHistory /> : <Navigate to="/signin" replace />} />
        <Route path="/rider/profile" element={userData?.role === "deliveryboy" ? <RiderProfile /> : <Navigate to="/signin" replace />} />

        {/* Owner */}
        <Route path="/owner/earnings" element={userData ? <OwnerEarnings /> : <Navigate to="/signin" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
}

export default App;