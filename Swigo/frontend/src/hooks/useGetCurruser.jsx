import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setUserData, setLoading } from "../redux/userSlice"; 

// 1. Quotes hata diye! Ab ye asli environment variable lega
export const serverurl = import.meta.env.VITE_API_URL;

function useGetCurruser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      
      try {
  
        const result = await axios.get(`${serverurl}/api/user/getcurruser`);

        if (result.data) {
          const finalUserData = result.data.user || result.data;
          dispatch(setUserData(finalUserData));
        }
      } catch (error) {
        // 3. 401 error matlab token invalid/missing hai
        console.log("🔒 User not logged in or session expired.");
        dispatch(setUserData(null)); 
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    fetchUser();
  }, [dispatch]); 
}

export default useGetCurruser;