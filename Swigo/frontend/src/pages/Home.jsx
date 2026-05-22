import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import UserDeshboard from "../components/UserDeshboard";
import LocationRestricted from "../components/LocationRestricted"; // Tera new restricted screen

function Home() {
  const { userData, loading } = useSelector((state) => state.user);
  
  // Maan le tu yahan se check karta hai ki city supported hai ya nahi
  // Is logic ko apne city hook ya state se link kar lena
  const isCitySupported = true; // Yahan apna logic daal (e.g., city !== "Unknown")

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-orange-500">Syncing Node...</div>;

  // 1. Agar User Logged In hai
  if (userData) {
    if (!isCitySupported) return <LocationRestricted />;
    
    // Role based redirect (Gateway logic)
    if (userData.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userData.role === "deliveryboy") return <Navigate to="/rider/dashboard" replace />;
    if (userData.role === "owner") return <Navigate to="/owner/dashboard" replace />;
    
    return <UserDeshboard />;
  }

  // 2. Agar User Logged Out hai (Video Hero Section)
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/frontvideo.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-6">
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase mb-6 drop-shadow-2xl">Zyngo</h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500 mb-8">Fast. Fresh. Digital.</p>
        <Link 
          to="/signin" 
          className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl"
        >
          Initialize Login
        </Link>
      </div>
    </div>
  );
}

export default Home;