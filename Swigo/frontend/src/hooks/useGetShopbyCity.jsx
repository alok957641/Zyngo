import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setShopsOfMyCity } from "../redux/userSlice";

export const serverurl = "import.meta.env.VITE_API_URL";

function useGetShopbyCity() {
  // ⚠️ DHYAN RAKHNA: Redux me tune 'City' (Capital C) rakha hai ya 'city' (Small c). 
  // Agar pehle 'city' tha, toh isko small kar lena.
  const { City } = useSelector((state) => state.user); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchshops = async () => {
     
      if (!City || City === "Unknown Location") return;

      try {
      
        const result = await axios.get(`${serverurl}/api/shop/getShopByCity/${City}`, {
          withCredentials: true,
        });
        
        dispatch(setShopsOfMyCity(result.data));
        console.log("🏪 Shops aa gayi:", result.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("🔒 User is not logged in. (This is normal)");
        } else {
          console.log("❌ Server Error:", error.message);
        }
      }
    };
    
    fetchshops();
  }, [City, dispatch]);
}

export default useGetShopbyCity;