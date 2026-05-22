// hooks/useGetMyShop.js
export default function useGetMyShop() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Hook checking userData:", userData); // <--- DEBUG LOG
    if (!userData || userData.role !== "owner") return;

    const fetchShop = async () => {
      try {
        console.log("Fetching shop...");
        const res = await axios.get(`${serverurl}/api/shop/getMyShop`, { withCredentials: true });
        console.log("API Response:", res.data); // <--- DEBUG LOG
        
        if (res.data.success) {
           dispatch(setMyShopData(res.data.shop));
        } else {
           dispatch(setMyShopData(null)); // Shop nahi hai
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        dispatch(setMyShopData(null));
      }
    };
    fetchShop();
  }, [userData, dispatch]);
}