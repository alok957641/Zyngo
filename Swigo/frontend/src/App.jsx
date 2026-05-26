import React, { useEffect, useState, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

// ✅ Components
import Footer from "./components/Footer.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// ✅ Lazy Load Heavy Pages (Fast Loading)
const Home = lazy(() => import("./pages/Home.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Signin = lazy(() => import("./pages/Signin.jsx"));
const Forgetpassword = lazy(() => import("./pages/Forgetpassword.jsx"));
const CreateAndEditShop = lazy(() => import("./pages/CreateAndEditShop.jsx"));
const AddItem = lazy(() => import("./pages/AddItem.jsx"));
const EditItem = lazy(() => import("./pages/EditItem.jsx"));
const Cartpage = lazy(() => import("./pages/Cartpage.jsx"));
const CheckOut = lazy(() => import("./pages/CheckOut.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const TrackOrderPage = lazy(() => import("./pages/TrackOrderPage.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const ShopPage = lazy(() => import("./pages/ShopPage.jsx"));

// Rider Panel Pages
const DelevryBoyDeshboard = lazy(() => import("./components/DelevryBoyDeshboard.jsx"));
const RiderEarnings = lazy(() => import("./pages/RiderEarnings"));
const RiderHistory = lazy(() => import("./pages/RiderHistory"));
const RiderProfile = lazy(() => import("./pages/RiderProfile"));

// Owner & Billing Pages
const OwnerEarnings = lazy(() => import("./pages/OwnerEarnings.jsx"));
const AdminPayouts = lazy(() => import("./pages/AdminPayouts.jsx"));

// Admin Pages
const AdminDashboardOverview = lazy(() => import("./pages/AdminDashboardOverview.jsx"));
const AdminRiderManagement = lazy(() => import("./pages/AdminRiderManagement.jsx"));
const AdminShopManagement = lazy(() => import("./pages/AdminShopManagement.jsx"));
const AdminSettings = lazy(() => import("./pages/AdminSettings.jsx"));
import AdminRoute from "./components/AdminRoute.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";

// ✅ Only Essential Hooks
import useGetCurruser from "./hooks/useGetCurruser.jsx";

function App() {
  const dispatch = useDispatch();
  
  // ✅ Only fetch current user first
  useGetCurruser();
  
  const { userData, loading } = useSelector((state) => state.user);
  const [otherDataLoaded, setOtherDataLoaded] = useState(false);

  // ✅ Load other data AFTER user is logged in (Background)
  useEffect(() => {
    if (userData && !otherDataLoaded) {
      setOtherDataLoaded(true);
      
      // ✅ Lazy load other hooks dynamically
      const loadOtherData = async () => {
        const modules = await Promise.all([
          import("./hooks/useGetCity.jsx"),
          import("./hooks/useGetMyShop.jsx"),
          import("./hooks/useGetShopbyCity.jsx"),
          import("./hooks/useGetItemByCity.jsx"),
          import("./hooks/useGetMyOrders.jsx"),
          import("./hooks/useGetUpdateLocation.jsx")
        ]);
        
        // Execute each hook
        modules.forEach(module => {
          const hook = module.default;
          if (typeof hook === 'function') {
            // Call the hook in a separate microtask
            setTimeout(() => hook(), 0);
          }
        });
      };
      
      loadOtherData();
    }
  }, [userData, otherDataLoaded]);

  // ✅ Fast loading spinner
  if (loading) {
    return <LoadingSpinner />;
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
  
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Home Route */}
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

          {/* Public Auth Routes */}
          <Route path="/signup" element={!userData ? <Signup /> : <Navigate to="/" replace />} />
          <Route path="/signin" element={!userData ? <Signin /> : <Navigate to="/" replace />} />
          <Route path="/forgetpassword" element={!userData ? <Forgetpassword /> : <Navigate to="/" replace />} />

          {/* Admin Panel */}
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

          {/* Customer Routes */}
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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Suspense>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;