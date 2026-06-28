import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";
import { serverurl } from "../config/api.js";
// 🔥 FIX: apiClient yahan bana lo taaki hamesha same config use ho
const apiClient = axios.create({
  baseURL: serverurl,
  withCredentials: true,
});

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // 🛡️ Guard Clause: Agar userData nahi hai, toh request mat bhejo
    if (!userData?._id) return;

    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get(`/api/order/my-orders`);
        dispatch(setMyOrders(data || []));
      } catch (error) {
        const status = error.response?.status;
        
        // 🛡️ Agar 401 hai, toh interceptor handle karega (App.jsx mein)
        if (status === 401) {
          console.warn("Session expired in useGetMyOrders");
          return; 
        }
        
        if (status === 404) dispatch(setMyOrders([]));
        console.error(`❌ Fetch Error (${status}):`, error.message);
      }
    };

    fetchOrders();
  }, [userData?._id, dispatch]); // 🔥 Dependency mein sirf ID rakho
}

export default useGetMyOrders;