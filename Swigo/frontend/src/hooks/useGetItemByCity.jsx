import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice"; 

export const serverurl = "http://localhost:8000";

function useGetItemByCity() {
  // 🔥 Redux se exact Capital 'City' field nikali
  const { City } = useSelector((state) => state.user); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItems = async () => {
      // Shehar missing hai ya location unknown hai toh return karo
      if (!City || City === "Unknown Location") return;

      try {
        const result = await axios.get(`${serverurl}/api/item/getbycity/${City}`, {
          withCredentials: true,
        });
        
        dispatch(setItemsInMyCity(result.data));
        console.log(`🍔 Items aa gaye for ${City}:`, result.data); 
        
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("🔒 User is not logged in. (This is normal)");
        } else {
          console.log("❌ Server Error:", error.message);
        }
      }
    };
    
    fetchItems();
  }, [City, dispatch]);
}

export default useGetItemByCity;