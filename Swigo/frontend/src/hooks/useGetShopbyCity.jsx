import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setShopsOfMyCity } from "../redux/userSlice";

export const serverurl = "https://zyngo.onrender.com";

function useGetShopbyCity() {
  const { City } = useSelector((state) => state.user); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchshops = async () => {
      // 1. Validation check
      if (!City || City === "Unknown Location" || City === "Locating...") return;

      try {
        const result = await axios.get(`${serverurl}/api/shop/getShopByCity/${City}`, {
          withCredentials: true,
        });
        
        // 2. Agar shops mili, toh set karo; nahi toh empty array
        dispatch(setShopsOfMyCity(result.data || []));
        console.log("🏪 Shops aa gayi:", result.data);
      } catch (error) {
        // 3. Agar 404 (No shops found), toh Redux mein empty array bhej do
        if (error.response?.status === 404) {
          dispatch(setShopsOfMyCity([]));
          console.log("🏪 Is shehar mein koi shop nahi hai.");
        } else {
          console.error("❌ Server Error:", error.message);
        }
      }
    };
    
    fetchshops();
  }, [City, dispatch]);
}

export default useGetShopbyCity;