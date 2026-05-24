import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"; // ✅ Add useSelector
import { setUserData, setLoading } from "../redux/userSlice"; 

export const serverurl = "https://zyngo.onrender.com"; // ✅ Your Render URL

function useGetCurruser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user); // ✅ Get current user

  useEffect(() => {
    const fetchUser = async () => {
      // ✅ Agar already user hai toh API call mat karo (performance improve)
      if (userData) {
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));
      
      try {
        // ⚠️ Route match karo - tera backend route "/api/auth/me" hai
        const result = await axios.get(`${serverurl}/api/auth/me`, {
          withCredentials: true,
        });

        if (result.data) {
          dispatch(setUserData(result.data));
        } else {
          dispatch(setUserData(null));
        }
      } catch (error) {
        console.log("🔒 User not logged in:", error.response?.status);
        dispatch(setUserData(null)); 
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    fetchUser();
  }, [dispatch, userData]); // ✅ userData dependency add kiya
}

export default useGetCurruser;