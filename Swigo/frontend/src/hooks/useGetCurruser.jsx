import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setUserData, setLoading } from "../redux/userSlice"; 

function useGetCurruser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        // 🔥 YE RAHA FIX: { withCredentials: true } zaroor daal
        const result = await axios.get("https://zyngo.onrender.com/api/user/getcurruser", { 
            withCredentials: true 
        });
        
        if (result.data) {
          dispatch(setUserData(result.data.user || result.data));
        }
      } catch (error) {
        console.log("🔒 User not logged in.");
        // Logout mat kar, bas loading false kar de
        dispatch(setLoading(false)); 
      } finally {
        // Finally mein sirf loading false rakh, user null mat kar
      }
    };
    fetchUser();
  }, [dispatch]); 
}

export default useGetCurruser;