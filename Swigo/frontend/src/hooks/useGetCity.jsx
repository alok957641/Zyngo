import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/userSlice";
import { setLocation, setAddress } from "../redux/mapSlice"; // setAddress bhi import karle

function useGetCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("⏳ Location maang raha hu browser se...");
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // 1. Lat/Lon Dispatch
          dispatch(setLocation({ lat: latitude, lon: longitude }));

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              {
                headers: {
                  'User-Agent': 'Swigo-App' // Nominatim ko User-Agent chahiye hota hai
                }
              }
            );
            const data = await response.json();

            if (data && data.address) {
              const address = data.address;
              
              // 🚀 FIX: Yahan currentCity ko data se assign karna zaroori hai
              // Nominatim kabhi city deta hai, kabhi town, toh sab check karna padta hai
              let currentCity = address.city || address.town || address.village || address.state_district || "Unknown Location";

              console.log("🏙️ Final Fetch Ki Gayi Jagah:", currentCity);
              
              // 2. City set karo userSlice mein
              dispatch(setCity(currentCity));
              
              // 3. Pura address set karo mapSlice mein
              dispatch(setAddress(data.display_name)); 
            }

          } catch (error) {
            console.error("❌ Free Map API Error:", error);
          }
        },
        (error) => {
          console.error("❌ Browser Location Error:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [dispatch]);
}

export default useGetCity;