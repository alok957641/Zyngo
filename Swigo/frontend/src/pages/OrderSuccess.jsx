import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiPackage, FiMapPin, FiArrowRight, FiHome, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti"; // Optional: Ek baar 'npm install canvas-confetti' kar lena

function OrderSuccess() {
  const navigate = useNavigate();

  // 🎉 Surprise Party: Page load hote hi hara confetti udega
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#22c55e", "#16a34a", "#bbf7d0"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#22c55e", "#16a34a", "#bbf7d0"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0FAF5] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* 🌿 Floating Elements (Crash-Safe Optimized) */}
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 text-[12rem] opacity-20 pointer-events-none"
      >
        🍃
      </motion.div>
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 -right-10 text-[10rem] opacity-20 pointer-events-none"
      >
        🌿
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-[50px] p-8 md:p-12 shadow-[0_30px_100px_-20px_rgba(34,197,94,0.3)] border border-white text-center">
          
          {/* ✅ The Success Circle (Hara Bhara Animation) */}
          <div className="relative mb-8 flex justify-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, times: [0, 0.7, 1] }}
              className="w-28 h-28 bg-green-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-200 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FiCheck className="text-white text-6xl stroke-[4]" />
              </motion.div>
            </motion.div>
            
            {/* Animated Rings around Checkmark */}
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-green-200 rounded-full z-0"
            ></motion.div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
            SUCCESS <span className="text-green-600">!</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mb-8">
            Your Order has been placed
          </p>

          {/* 📦 Info Box */}
          <div className="bg-slate-50 rounded-[35px] p-6 mb-8 border border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                <FiPackage className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Preparation</p>
                <h4 className="text-xs font-black text-slate-800 uppercase mt-1">Starting in Surajgarha</h4>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                <FiMapPin className="text-xl" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Estimate</p>
                <h4 className="text-xs font-black text-slate-800 uppercase mt-1">30 Minutes Arrival</h4>
              </div>
            </div>
          </div>

          {/* 🚀 Action Buttons */}
          <div className="space-y-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/my-orders")}
              className="w-full bg-green-600 text-white h-16 rounded-[25px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-700 transition-colors"
            >
              <span>Back to Order</span>
              <FiArrowRight />
            </motion.button>

            <button 
              onClick={() => navigate("/")}
              className="w-full bg-transparent text-slate-400 h-12 rounded-[25px] font-black uppercase tracking-widest text-[9px] hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <FiHome />
              Back to Home
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2 text-green-700/40">
              <FiShoppingBag />
              <span className="text-[8px] font-black uppercase tracking-[5px]">Swigo Express Surajgarha</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;