import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/userSlice";
import { setLocation, setAddress } from "../redux/mapSlice"; // setAddress bhi import karle

// ... existing imports
function useGetCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
            { headers: { 'User-Agent': 'Zyngo-App' } }
          );
          const data = await response.json();

          if (data?.address) {
            // Priority list for city detection
            const city = data.address.city || data.address.town || data.address.village || data.address.state_district;
            
            // Dispatch city & full address
            dispatch(setCity(city)); 
            dispatch(setAddress(data.display_name));
          }
        } catch (error) {
          console.error("Nominatim API error:", error);
          dispatch(setCity("Unknown")); // Fallback
        }
      },
      (error) => {
        console.error("GPS Error:", error.message);
        dispatch(setCity("Unknown"));
      },
      { enableHighAccuracy: true }
    );
  }, [dispatch]);
}

export default useGetCity;