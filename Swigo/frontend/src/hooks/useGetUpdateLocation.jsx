import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export const serverurl = "https://zyngo.onrender.com";

function useGetUpdateLocation() {
  const { userData } = useSelector((state) => state.user);
  const lastUpdate = useRef(0); // API spam rokne ke liye

  useEffect(() => {
    if (!userData) return;

    const updateLocation = async (latitude, longitude) => {
      const now = Date.now();
      // Har 15 second se pehle dobara call nahi karega
      if (now - lastUpdate.current < 15000) return; 

      try {
        const res = await axios.post(
          `${serverurl}/api/user/update-location`,
          { lat: latitude, lon: longitude },
          { withCredentials: true }
        );
        if(res.status === 200) {
            lastUpdate.current = now;
            console.log("📍 Location Synced with DB");
        }
      } catch (error) {
        console.error("📍 Update Fail:", error.response?.data?.message || error.message);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => console.error("GPS Error:", err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData]);
}


export default useGetUpdateLocation;