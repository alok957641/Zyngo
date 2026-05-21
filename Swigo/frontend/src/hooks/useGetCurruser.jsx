import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setUserData, setLoading } from "../redux/userSlice"; 

// 1. Quotes hata diye! Ab ye asli environment variable lega
// Aise likho (Bina quotes ke)
export const serverurl = import.meta.env.VITE_API_URL;

function useGetCurruser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        // Yahan baseURL direct use karo ya `${serverurl}`
        const result = await axios.get(`${serverurl}/api/user/getcurruser`);
        if (result.data) {
          dispatch(setUserData(result.data.user || result.data));
        }
      } catch (error) {
        console.log("🔒 User not logged in.");
        dispatch(setUserData(null)); 
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, [dispatch]); 
}

export default useGetCurruser;