import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverurl } from "../config/api.js";

const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function useGetUpdateLocation() {
  const { userData } = useSelector((state) => state.user);
  const lastUpdate = useRef(0);

  useEffect(() => {
    if (userData?.role !== "deliveryboy") return;

    const updateLocation = async (lat, lon) => {
      const now = Date.now();
      if (now - lastUpdate.current < 15000) return;

      try {
        await apiClient.post("/api/user/update-location", {
          latitude: lat,
          longitude: lon,
        });
        lastUpdate.current = now;
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Location sync failed:", error.response?.status, error.message);
        }
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => updateLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => console.error("GPS Error:", err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData?.role]);
}

export default useGetUpdateLocation;
