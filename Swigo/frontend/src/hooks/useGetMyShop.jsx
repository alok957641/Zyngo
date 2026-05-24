import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

export const serverurl = "https://zyngo.onrender.com";

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner || {});

  useEffect(() => {
    // 🚀 Logic: Sirf Owner ke liye call karo aur tabhi jab data na ho
    if (!userData || userData.role !== "owner") return;
    
    // ✅ Agar already data hai ya false set hai toh dubara mat call karo
    if (myShopData !== undefined && myShopData !== null) return;

    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/shop/getMyShop`, {
          withCredentials: true,
        });
        if (result.data && result.data._id) {
          dispatch(setMyShopData(result.data));
        } else {
          dispatch(setMyShopData(null)); // ✅ null set karo, false nahi
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No shop found for this owner");
          dispatch(setMyShopData(null)); // ✅ null set karo
        } else {
          console.error("Error fetching shop:", error);
          dispatch(setMyShopData(null));
        }
      }
    };

    fetchShop();
  }, [userData, dispatch, myShopData]); // ✅ myShopData dependency daalo taaki ek baar fetch ho

  return myShopData; // ✅ Return bhi karo for convenience
}

export default useGetMyShop;