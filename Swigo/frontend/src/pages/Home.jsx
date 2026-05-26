import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ✅ Lazy load dashboards (fast)
const UserDeshboard = lazy(() => import("../components/UserDeshboard"));
const DelevryBoyDeshboard = lazy(() => import("../components/DelevryBoyDeshboard"));
const OwnerDeshboard = lazy(() => import("../components/OwnerDeshboard"));

// ✅ Loading component
const DashboardLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#fcfcfc]">
    <div className="text-center">
      <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-500 text-sm">Loading dashboard...</p>
    </div>
  </div>
);

function Home() {
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="min-h-screen w-full bg-[#fcfcfc] relative">
        <div className="relative z-10">
          <Suspense fallback={<DashboardLoader />}>
            {userData.role === "user" && <UserDeshboard />}
            {userData.role === "owner" && <OwnerDeshboard />}
            {userData.role === "deliveryboy" && <DelevryBoyDeshboard />}
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      <video autoPlay loop muted playsInline className="absolute z-0 w-full h-full object-cover">
        <source src="frontvideo.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 text-center">
        <h1 className="text-white text-8xl font-black italic">Zyngo</h1>
        <Link to="/signin" className="inline-block mt-5 bg-orange-500 text-white px-10 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default Home;