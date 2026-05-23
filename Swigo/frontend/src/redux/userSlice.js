import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        loading: true,
        City: null,
        ShopsOfMyCity: null,
        itemsInMyCity: null,
        searchTerm: "",
        selectedCategory: "All",
        cartItems: [],
        totalAmount: 0,
        myOrders: [],
    },
    reducers: {
        // ✅ USER & SESSION MANAGEMENT
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        // IMPORTANT: Logout par pura state clear karo
        clearUserSession: (state) => {
            state.userData = null;
            state.cartItems = [];
            state.totalAmount = 0;
            state.myOrders = [];
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // ✅ CITY & DATA
        setCity: (state, action) => { state.City = action.payload; },
        setShopsOfMyCity: (state, action) => { state.ShopsOfMyCity = action.payload; },
        setItemsInMyCity: (state, action) => { state.itemsInMyCity = action.payload; },
        setSearchTerm: (state, action) => { state.searchTerm = action.payload; },
        setSelectedCategory: (state, action) => { state.selectedCategory = action.payload; },

        // ✅ CART LOGIC (With Safety Checks)
        addToCart: (state, action) => {
            const cartItem = action.payload;
            const existingItem = state.cartItems.find(i => (i._id || i.id) === (cartItem._id || cartItem.id));
            
            if (existingItem) {
                existingItem.quantity = cartItem.quantity;
            } else {
                state.cartItems.push({ ...cartItem, quantity: cartItem.quantity || 1 });
            }
            // Recalculate Total
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(i => (i._id || i.id) === id);
            if (item) {
                // Quantity 0 se neeche nahi jayegi
                item.quantity = Math.max(1, quantity); 
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        },

        removecartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(i => (i._id || i.id) !== action.payload);
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        },

        // ✅ ORDERS
        setMyOrders: (state, action) => { state.myOrders = action.payload; },
        addMyOrder: (state, action) => {
            if (action.payload) {
                state.myOrders = [action.payload, ...state.myOrders];
            }
        }
    }
});

export const {
    setUserData,
    clearUserSession, // Naya export
    setLoading,
    setCity,
    setShopsOfMyCity,
    setItemsInMyCity,
    setSearchTerm,
    setSelectedCategory,
    addToCart,
    updateQuantity,
    removecartItem,
    setMyOrders,
    addMyOrder
} = userSlice.actions;

export default userSlice.reducer;