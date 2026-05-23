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
  const location = useLocation();

  // ✅ AXIOS CONFIG
  useEffect(() => {
    axios.defaults.baseURL = "https://zyngo.onrender.com";
    axios.defaults.withCredentials = true;
  }, []);

  // ✅ REDUX STATE
  const { userData, loading } = useSelector((state) => state.user);

  // ✅ HOOKS (Sare hooks yahan call ho rahe hain)
  useGetCurruser();
  useGetCity();
  useGetShopbyCity();
  useGetItemByCity();
  useGetMyShop(userData);
  useGetMyOrders(userData);
  useGetUpdateLocation(userData);

  // ✅ PROTECTED ROUTE LOGIC
  const Protected = ({ children, role }) => {
    if (loading)
      return (
        <div className="h-screen flex items-center justify-center text-orange-500">
          Syncing Zyngo...
        </div>
      );

    if (!userData) return <Navigate to="/signin" replace />;

    if (role && userData.role !== role) return <Navigate to="/" replace />;

    return children;
  };

  const path = location.pathname.toLowerCase();
  const showFooter =
    ["/", "/cart", "/my-orders", "/checkout", "/order-success"].includes(
      path,
    ) ||
    path.startsWith("/shop/") ||
    path.startsWith("/category/");

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "12px",
            borderRadius: "15px",
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />

      <Routes>
        <Route
          path="/"
          element={
            !userData ? (
              <Home />
            ) : userData.role === "deliveryboy" ? (
              <Navigate to="/rider/dashboard" replace />
            ) : userData.role === "owner" ? (
              <Navigate to="/owner/dashboard" replace />
            ) : (
              <Home />
            )
          }
        />

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

        {/* OWNER */}
        <Route
          path="/CreateAndEditShop"
          element={
            <Protected role="owner">
              <CreateAndEditShop />
            </Protected>
          }
        />
        <Route
          path="/AddItem"
          element={
            <Protected role="owner">
              <AddItem />
            </Protected>
          }
        />
        <Route
          path="/EditItem/:itemId"
          element={
            <Protected role="owner">
              <EditItem />
            </Protected>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <Protected role="owner">
              <OwnerDashboard />
            </Protected>
          }
        />
        <Route
          path="/owner/earnings"
          element={
            <Protected role="owner">
              <OwnerEarnings />
            </Protected>
          }
        />

        {/* USER */}
        <Route
          path="/cart"
          element={
            <Protected>
              <Cartpage />
            </Protected>
          }
        />
        <Route
          path="/CheckOut"
          element={
            <Protected>
              <CheckOut />
            </Protected>
          }
        />
        <Route
          path="/order-success"
          element={
            <Protected>
              <OrderSuccess />
            </Protected>
          }
        />
        <Route
          path="/my-orders"
          element={
            <Protected>
              <MyOrders />
            </Protected>
          }
        />
        <Route
          path="/category/:catName"
          element={
            <Protected>
              <CategoryPage />
            </Protected>
          }
        />
        <Route
          path="/shop/:shopId"
          element={
            <Protected>
              <ShopPage />
            </Protected>
          }
        />
        <Route
          path="/track-order/:orderId"
          element={
            <Protected>
              <TrackOrderPage />
            </Protected>
          }
        />

        {/* RIDER */}
        <Route
          path="/rider/dashboard"
          element={
            <Protected role="deliveryboy">
              <DelevryBoyDeshboard />
            </Protected>
          }
        />
        <Route
          path="/rider/earnings"
          element={
            <Protected role="deliveryboy">
              <RiderEarnings />
            </Protected>
          }
        />
        <Route
          path="/rider/history"
          element={
            <Protected role="deliveryboy">
              <RiderHistory />
            </Protected>
          }
        />
        <Route
          path="/rider/profile"
          element={
            <Protected role="deliveryboy">
              <RiderProfile />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default App;
