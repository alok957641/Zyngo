function useGetMyOrders(userData) {

  const dispatch = useDispatch();

  useEffect(() => {

    if (!userData) return;

    const fetchOrders = async () => {

      try {

        const res = await axios.get("/api/order/my-orders");

        dispatch(setMyOrders(res.data));

      } catch (err) {

        console.log(err);

      }

    };

    fetchOrders();

  }, [userData]);

}
export default useGetMyOrders;