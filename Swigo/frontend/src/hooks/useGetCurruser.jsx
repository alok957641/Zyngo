import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";
import { serverurl } from "../config/api.js";

function useGetCurruser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      const cachedUser = localStorage.getItem("user");

      if (cachedUser && !userData) {
        try {
          const user = JSON.parse(cachedUser);
          dispatch(setUserData({ ...user, profileReviewRequired: false }));
        } catch (error) {
          localStorage.removeItem("user");
        }
      }

      dispatch(setLoading(!cachedUser && !userData));

      try {
        const result = await axios.get(`${serverurl}/api/auth/me`, {
          withCredentials: true,
          timeout: 5000,
        });

        dispatch(setUserData(result.data || null));
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
        }
        dispatch(setUserData(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurruser;
