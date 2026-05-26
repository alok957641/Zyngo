import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice"; 

export const serverurl = "https://zyngo.onrender.com";

function useGetCurruser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      // ✅ Pehle localStorage check karo (fast)
      const cachedUser = localStorage.getItem("user");
      if (cachedUser && !userData) {
        try {
          const user = JSON.parse(cachedUser);
          dispatch(setUserData(user));
          dispatch(setLoading(false));
          return; // ✅ API call bhi mat karo
        } catch (e) {}
      }

      // ✅ Agar userData already hai toh API call skip
      if (userData) {
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));
      
      try {
        const result = await axios.get(`${serverurl}/api/auth/me`, {
          withCredentials: true,
          timeout: 5000, // ✅ 5 second timeout
        });

        if (result.data) {
          localStorage.setItem("user", JSON.stringify(result.data)); // ✅ Cache
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
  }, [dispatch, userData]);
}

export default useGetCurruser;