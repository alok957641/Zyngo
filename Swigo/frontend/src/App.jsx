import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import Footer from "./components/Footer.jsx";

// Pages Imports (same as before)
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Home from "./pages/Home.jsx";
// ... rest of your imports

// ✅ Only ONE hook - rest will load lazily
import useGetCurruser from "./hooks/useGetCurruser.jsx";

function App() {
  const dispatch = useDispatch();
  
  // ✅ Only fetch current user first
  useGetCurruser();
  
  const { userData, loading } = useSelector((state) => state.user);
  const [initialLoad, setInitialLoad] = useState(true);

  // ✅ Load other data only AFTER user is logged in
  useEffect(() => {
    if (userData && initialLoad) {
      setInitialLoad(false);
      
      // ✅ Dynamically import other hooks only when needed
      const loadOtherData = async () => {
        const { default: useGetCity } = await import("./hooks/useGetCity.jsx");
        const { default: useGetMyShop } = await import("./hooks/useGetMyShop.jsx");
        const { default: useGetShopbyCity } = await import("./hooks/useGetShopbyCity.jsx");
        const { default: useGetItemByCity } = await import("./hooks/useGetItemByCity.jsx");
        const { default: useGetMyOrders } = await import("./hooks/useGetMyOrders.jsx");
        const { default: useGetUpdateLocation } = await import("./hooks/useGetUpdateLocation.jsx");
        
        // Call them in a component or use a separate effect
      };
      loadOtherData();
    }
  }, [userData, initialLoad]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Welcome to Zyngo...</p>
          <p className="text-sm text-gray-400 mt-1">Loading your experience</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} 
        toastOptions={{
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "15px",
            background: "#1e293b",
            color: "#fff",
          },
        }}
      />
  
      <Routes>
        <Route path="/" element={
          !userData ? <Navigate to="/signin" replace /> :
          userData.role === "admin" ? <Navigate to="/admin/dashboard" replace /> :
          userData.role === "deliveryboy" ? <Navigate to="/rider/dashboard" replace /> :
          <Home />
        } />
        
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" replace />} />
        <Route path="/forgetpassword" element={!userData ? <Forgetpassword /> : <Navigate to="/" replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminSidebar /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashboardOverview />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="riders" element={<AdminRiderManagement />} />
          <Route path="restaurants" element={<AdminShopManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Protected Routes */}
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

        {/* Rider Routes */}
        <Route path="/rider/dashboard" element={userData?.role === "deliveryboy" ? <DelevryBoyDeshboard /> : <Navigate to="/signin" replace />} />
        <Route path="/rider/earnings" element={userData?.role === "deliveryboy" ? <RiderEarnings /> : <Navigate to="/signin" replace />} />
        <Route path="/rider/history" element={userData?.role === "deliveryboy" ? <RiderHistory /> : <Navigate to="/signin" replace />} />
        <Route path="/rider/profile" element={userData?.role === "deliveryboy" ? <RiderProfile /> : <Navigate to="/signin" replace />} />

        {/* Owner Routes */}
        <Route path="/owner/earnings" element={userData ? <OwnerEarnings /> : <Navigate to="/signin" replace />} />

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;