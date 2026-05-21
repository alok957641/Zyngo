import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setUserData, setLoading } from "../redux/userSlice"; 

export const serverurl = "import.meta.env.VITE_API_URL";

function useGetCurruser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      // Refresh par pehle loading true karo taaki redirect na ho
      dispatch(setLoading(true));
      
      try {
        const result = await axios.get(`${serverurl}/api/user/getcurruser`, {
          withCredentials: true,
        });

        if (result.data) {
          const finalUserData = result.data.user || result.data;
          dispatch(setUserData(finalUserData));
        }
      } catch (error) {
        console.log("🔒 User not logged in.");
        dispatch(setUserData(null)); 
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    fetchUser();
    // Dependency array sirf dispatch rakho, userData nahi!
  }, [dispatch]); 
}

export default useGetCurruser;