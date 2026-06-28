import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import { serverurl } from "../config/api.js";
// ✅ Global instance
const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true,
});

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🚀 Logic: Sirf Owner ke liye call karo
    if (!userData || userData.role !== "owner") {
      setIsLoading(false);
      return;
    }
    
    // ✅ Agar already data loaded hai, toh dubara fetch mat karo
    if (myShopData !== undefined && myShopData !== null) {
      setIsLoading(false);
      return;
    }

    const fetchShop = async () => {
      try {
        console.log("🔍 Fetching shop for owner...");
        const result = await apiClient.get(`/api/shop/getMyShop`);
        if (result.data) {
          console.log("✅ Shop found:", result.data.name);
          dispatch(setMyShopData(result.data));
        } else {
          dispatch(setMyShopData(null));
        }
      } catch (error) {
        // 🛡️ Error 404 ka matlab hai shop abhi tak bani nahi hai
        if (error.response?.status === 404) {
          console.log("📛 No shop found (404) - setting null");
          dispatch(setMyShopData(null));
        } else {
          console.error("Error fetching shop:", error);
          dispatch(setMyShopData(null));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [userData?._id, dispatch, myShopData]); 

  return { myShopData, isLoading };
}

export default useGetMyShop;