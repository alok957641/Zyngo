import React from "react";
import { useSelector } from "react-redux";
import UserDeshboard from "../components/UserDeshboard";
import DelevryBoyDeshboard from "../components/DelevryBoyDeshboard";
import OwnerDeshboard from "../components/OwnerDeshboard";
import { Link } from "react-router-dom"; 

function Home() {
  const { userData, loading } = useSelector((state) => state.user);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Agar user logged in hai, toh uska Dashboard dikhao
  if (userData) {
    if (userData.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userData.role === "deliveryboy") return <Navigate to="/rider/dashboard" replace />;
    return <UserDeshboard />; // Default User Dashboard
  }

  // Agar user logged out hai, tabhi Video dikhao
  return (
    <div className="relative h-screen w-full">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/frontvideo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-black/40">
        <h1 className="text-8xl font-black italic">Zyngo</h1>
        <Link to="/signin" className="mt-5 bg-orange-500 px-10 py-3 rounded-xl font-bold">Go to Login</Link>
      </div>
    </div>
  );
}

export default Home;