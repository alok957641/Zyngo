import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setUserData,
  setLoading
} from "../redux/userSlice";

function useGetCurruser() {

  const dispatch = useDispatch();

  useEffect(() => {

    const fetchUser = async () => {

      dispatch(setLoading(true));

      try {

        const res = await axios.get(
          "/api/user/getcurruser"
        );

        dispatch(setUserData(res.data.user));

      } catch (err) {

        dispatch(setUserData(null));

      } finally {

        dispatch(setLoading(false));

      }

    };

    fetchUser();

  }, []);

}

export default useGetCurruser;