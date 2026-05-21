import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

function Home() {
  const { userData, loading } = useSelector((state) => state.user);

  // 1. Loading state (Spinners)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Agar user logged-in hai, toh yahan rukna hi nahi hai, 
  // App.jsx ka gateway automatically use dashboard bhej dega.
  if (userData) {
    return <Navigate to="/" replace />;
  }

  // 3. Landing Page (Video + Login Button) - Yeh tabhi dikhega jab user logged out hai
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="frontvideo.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      
      <div className="relative z-10 text-center text-white">
        <h1 className="text-8xl font-black italic tracking-tighter">Zyngo</h1>
        <p className="mt-2 text-lg font-medium">Fastest Food Delivery in Your City</p>
        
        <Link 
          to="/signin" 
          className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 transition-all text-white px-10 py-3 rounded-xl font-bold text-lg"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default Home;