import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-600 font-medium"
        >
          Loading Zyngo...
        </motion.p>
        <p className="text-sm text-gray-400 mt-1">Please wait</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;