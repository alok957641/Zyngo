import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

export const serverurl = "import.meta.env.VITE_API_URL";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData) return;

      try {
        const { data } = await axios.get(`${serverurl}/api/order/my-orders`, {
          withCredentials: true,
        });

        dispatch(setMyOrders(data || []));
        console.log("📦 Orders Loaded:", data);

      } catch (error) {
       
        const status = error.response?.status;
        
        if (status === 404) dispatch(setMyOrders([]));
        
        console.log(`❌ Fetch Error (${status}):`, error.message);
      }
    };

    fetchOrders();
  }, [userData, dispatch]);
}

export default useGetMyOrders;