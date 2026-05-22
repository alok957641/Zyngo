import React from "react";
import { FiMapPin } from "react-icons/fi";

const LocationRestricted = () => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-orange-100 p-6 rounded-full mb-6">
        <FiMapPin className="text-5xl text-orange-600" />
      </div>
      <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Not in range</h1>
      <p className="text-sm font-bold text-slate-500 mt-3 max-w-xs">
        Currently, our nodes are not active in your location. We are expanding rapidly, stay tuned!
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all"
      >
        Retry Location
      </button>
    </div>
  );
};
export default LocationRestricted;