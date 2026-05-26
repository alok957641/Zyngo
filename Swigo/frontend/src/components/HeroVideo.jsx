import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroVideo = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // ✅ Ensure video plays automatically on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Video autoplay failed:", err);
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        {/* ✅ Replace with your video URL */}
        <source src="/videos/zyngo-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter">
              Zyngo<span className="text-orange-500">.</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-white/80 text-sm sm:text-base md:text-lg font-medium max-w-md mx-auto mb-8">
            Fastest food delivery in your city
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base uppercase tracking-wider px-8 py-3 rounded-full transition-all shadow-lg"
            >
              Get Started
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signin')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 text-white font-black text-sm sm:text-base uppercase tracking-wider px-8 py-3 rounded-full transition-all"
            >
              Sign In
            </motion.button>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-bounce" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroVideo;