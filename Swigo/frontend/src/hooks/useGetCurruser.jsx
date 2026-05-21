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
        // Yahan baseURL ki zaroorat nahi, kyuki App.jsx mein setup hai
    const result = await axios.get("https://zyngo.onrender.com/api/user/getcurruser");
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