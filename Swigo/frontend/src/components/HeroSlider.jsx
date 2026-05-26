import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef(null);

  // Banner Data (Yahan tu apna real data daal sakta hai backend se)
  const banners = [
    {
      id: 1,
      title: "Feast On Your",
      subtitle: "Cravings",
      cta: "ORDER NOW",
      bgColor: "from-orange-500 to-orange-600",
      image: "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600",
      offer: "BUY ONE GET ONE FREE"
    },
    {
      id: 2,
      title: "50% OFF",
      subtitle: "on your first order",
      cta: "GRAB DEAL",
      bgColor: "from-red-500 to-red-600",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
      offer: "USE CODE: ZYNGO50"
    }
  ];

  // Auto slide
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [banners.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left - next
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right - previous
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset auto timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 4000);
    }
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 mt-4 sm:mt-6">
      <div 
        className="relative w-full rounded-2xl overflow-hidden shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slider Container */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              <div className={`relative h-44 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r ${banner.bgColor} overflow-hidden`}>
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-center px-6 sm:px-8 md:px-12">
                  {/* Offer Badge */}
                  {banner.offer && (
                    <span className="inline-block bg-yellow-500 text-black font-black text-[10px] sm:text-xs uppercase tracking-wider px-2 py-1 rounded-full mb-2 sm:mb-3 w-fit">
                      {banner.offer}
                    </span>
                  )}
                  
                  {/* Title */}
                  <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter leading-tight">
                    {banner.title}
                  </h2>
                  
                  {/* Subtitle */}
                  <h3 className="text-orange-300 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black italic tracking-tight mt-1">
                    {banner.subtitle}
                  </h3>
                  
                  {/* CTA Button */}
                  <button className="mt-3 sm:mt-4 md:mt-5 bg-orange-500 text-white text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full hover:bg-orange-600 transition-all w-fit shadow-lg">
                    {banner.cta} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button 
          onClick={goPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all z-10"
        >
          <FiChevronLeft className="text-sm sm:text-lg" />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={goNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all z-10"
        >
          <FiChevronRight className="text-sm sm:text-lg" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx 
                  ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-orange-500' 
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;