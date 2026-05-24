import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export const serverurl = "https://zyngo.onrender.com";

// Ek global API instance banao taaki headers/credentials baar baar na likhna pade
const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true, // Cookies automatically bhejega
  headers: {
    "Content-Type": "application/json"
  }
});

function useGetUpdateLocation() {
  const { userData } = useSelector((state) => state.user);
  const lastUpdate = useRef(0);

  useEffect(() => {
    if (!userData) return;

    const updateLocation = async (lat, lon) => {
      const now = Date.now();
      if (now - lastUpdate.current < 15000) return; // 15s delay

      try {
        // Backend ke model ke hisaab se key name match karo (lat/lon)
        const res = await apiClient.post("/api/user/update-location", { 
          latitude: lat,  // Backend ke `user.controller.js` mein jo field naam hai wo likho
          longitude: lon 
        });
        
        if (res.status === 200) {
          lastUpdate.current = now;
          console.log("✅ Location Synced");
        }
      } catch (error) {
        console.error("❌ Sync Failed:", error.response?.status, error.message);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error("GPS Error:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]);
}

export default useGetUpdateLocation;