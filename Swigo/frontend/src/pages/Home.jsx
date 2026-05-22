import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import UserDeshboard from "../components/UserDeshboard";
import LocationRestricted from "../components/LocationRestricted";

function Home() {
  const { userData, loading, City } = useSelector((state) => state.user);
  
  // 1. Syncing State (Loading)
  if (loading) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[4px] text-orange-500 animate-pulse font-mono">Syncing Node...</p>
    </div>
  );

  // 2. Gateway: Agar user login hai, seedha dashboard bhej do
  if (userData) {
    const supportedCities = ["Bhagalpur", "Patna", "Delhi"];
    const isCitySupported = City && supportedCities.includes(City);

    // Location check (sirf tab jab location mil chuki ho)
    if (City && City !== "Locating..." && !isCitySupported) {
      return <LocationRestricted />;
    }
    
    // Role based routing
    if (userData.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (userData.role === "deliveryboy") return <Navigate to="/rider/dashboard" replace />;
    if (userData.role === "owner") return <Navigate to="/owner/dashboard" replace />;
    
    return <UserDeshboard />;
  }

  // 3. Guest User: Ye screen sirf tab dikhegi jab user LOGIN NAHI HAI
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video 
        autoPlay loop muted playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/frontvideo.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-6">
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase mb-2 drop-shadow-2xl">Zyngo</h1>
        <p className="text-sm font-black uppercase tracking-[0.4em] text-orange-500 mb-10">Fast. Fresh. Digital.</p>
        
        <Link 
          to="/signin" 
          className="group relative bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <span className="relative z-10 group-hover:text-orange-600 transition-colors">Initialize Login</span>
        </Link>
      </div>
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
    </div>
  );
}

export default Home;