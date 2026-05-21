import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

export const serverurl = import.meta.env.VITE_API_URL;

function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner || {});

  useEffect(() => {
    // 🚀 Logic: Sirf Owner ke liye call karo aur tabhi jab data na ho
    if (!userData || userData.role !== "owner" || myShopData) return;

    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/shop/getMyShop`, {
          withCredentials: true,
        });
        if (result.data) {
          dispatch(setMyShopData(result.data));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(setMyShopData(false)); // Confirm shop nahi hai
        }
      }
    };

    fetchShop();
  }, [userData, dispatch]); 
}

export default useGetMyShop;