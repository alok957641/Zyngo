import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

export const serverurl = "https://zyngo.onrender.com";

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  
  useEffect(() => {
    // Sirf Owner ke liye aur tabhi jab user load ho gaya ho
    if (!userData || userData.role !== "owner") return;

    const fetchShop = async () => {
      try {
        const res = await axios.get(`${serverurl}/api/shop/getMyShop`, {
          withCredentials: true,
        });

        // Backend se { success: true, shop: ... } aa raha hai
        if (res.data && res.data.shop) {
          dispatch(setMyShopData(res.data.shop));
        } else {
          // Shop nahi mili toh null set karo
          dispatch(setMyShopData(null));
        }
      } catch (error) {
        console.error("Shop fetch error:", error);
        // Error aaye (jaise 404), toh null set karo
        dispatch(setMyShopData(null));
      }
    };

    fetchShop();
  }, [userData, dispatch]); 
}

export default useGetMyShop;