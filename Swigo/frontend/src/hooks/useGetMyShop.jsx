import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

export const serverurl = "https://zyngo.onrender.com";

// ✅ Global instance
const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true,
});

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const myShopData = useSelector((state) => state.owner?.myShopData);

  useEffect(() => {
    // 🚀 Logic: Sirf Owner ke liye call karo
    if (!userData || userData.role !== "owner") return;
    
    // ✅ Agar already data loaded hai, toh dubara fetch mat karo
    if (myShopData !== undefined && myShopData !== null) return;

    const fetchShop = async () => {
      try {
        const result = await apiClient.get(`/api/shop/getMyShop`);
        if (result.data) {
          dispatch(setMyShopData(result.data));
        }
      } catch (error) {
        // 🛡️ Error 404 ka matlab hai shop abhi tak bani nahi hai, jo normal hai
        if (error.response?.status === 404) {
          dispatch(setMyShopData(null));
        }
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
    // ✅ Dependency mein sirf userData aur dispatch rakho
  }, [userData?._id, dispatch]); 

  return myShopData;
}

export default useGetMyShop;