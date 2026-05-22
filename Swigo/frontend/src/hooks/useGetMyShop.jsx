import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

export const serverurl = "https://zyngo.onrender.com";

export default function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  
  useEffect(() => {
    // 1. Agar user hi nahi hai, toh wait karo. Hook return kar jayega.
    if (!userData) {
      console.log("Hook waiting: No userData yet");
      return;
    }

    // 2. Sirf owner ke liye call karo
    if (userData.role !== "owner") {
      dispatch(setMyShopData(null));
      return;
    }

    const fetchShop = async () => {
      try {
        console.log("Hook: Calling API...");
        const res = await axios.get(`${serverurl}/api/shop/getMyShop`, { 
          withCredentials: true 
        });

        console.log("Hook: API Response:", res.data);
        
        // 3. Agar success true hai aur shop object mila
        if (res.data && res.data.success && res.data.shop) {
           dispatch(setMyShopData(res.data.shop));
        } else {
           // 4. Shop nahi mili (ya success false hai), toh explicitly null
           dispatch(setMyShopData(null));
        }
      } catch (error) {
        console.error("Hook: Fetch Error:", error);
        // Error par bhi null set karo taaki redirect kaam kare
        dispatch(setMyShopData(null));
      }
    };

    fetchShop();
  }, [userData, dispatch]);
}