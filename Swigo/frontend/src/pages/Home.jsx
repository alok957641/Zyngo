import React from "react";
import { useSelector } from "react-redux";
import UserDeshboard from "../components/UserDeshboard";
import DelevryBoyDeshboard from "../components/DelevryBoyDeshboard";
import OwnerDeshboard from "../components/OwnerDeshboard";
import { Link } from "react-router-dom"; 

function Home() {
  const { userData, loading } = useSelector((state) => state.user);

  // 🛡️ STEP 1: Jab tak backend se jawaab na aaye (White Screen ya Spinner)
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🛡️ STEP 2: Agar User mil gaya (Dashboard)
  if (userData) {
    return (
      <div className="min-h-screen w-full bg-[#fcfcfc] relative">
         <div className="relative z-10">
            {userData.role === "user" && <UserDeshboard />}
            {userData.role === "owner" && <OwnerDeshboard />}
            {userData.role === "deliveryboy" && <DelevryBoyDeshboard />}
         </div>
      </div>
    );
  }

  // 🛡️ STEP 3: Sirf tab dikhao jab loading band ho aur user na mile (Splash/Video)
  return (
    <div className="relative h-screen w-full flex items-center justify-center">
       {/* Tera Video wala poora code... */}
       <video autoPlay loop muted playsInline className="absolute z-0 w-full h-full object-cover">
          <source src="frontvideo.mp4" type="video/mp4" />
       </video>
       <div className="relative z-10 text-center">
          <h1 className="text-white text-8xl font-black italic">Swigo</h1>
          <Link to="/signin" className="mt-5 bg-orange-500 text-white px-10 py-3 rounded-xl font-bold">Go to Login</Link>
       </div>
    </div>
  );
}

export default Home;