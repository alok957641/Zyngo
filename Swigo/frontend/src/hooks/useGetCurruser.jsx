import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice";

function useGetCurruser() {

    const dispatch = useDispatch();

    useEffect(() => {

        const fetchUser = async () => {

            // ✅ START LOADING
            dispatch(setLoading(true));

            try {

                // ✅ API CALL
                const result = await axios.get(
                    "https://zyngo.onrender.com/api/user/getcurruser",
                    {
                        withCredentials: true,
                    }
                );

                // ✅ USER SAVE
                if (result.data) {

                    dispatch(
                        setUserData(result.data.user || result.data)
                    );

                }

            } catch (error) {

                console.log("🔒 User not logged in.");

                // ✅ IMPORTANT
                // Sirf user null karo
                // loading finally me false hoga
                dispatch(setUserData(null));

            } finally {

                // ✅ ALWAYS STOP LOADING
                dispatch(setLoading(false));

            }

        };

        fetchUser();

    }, [dispatch]);

}

export default useGetCurruser;