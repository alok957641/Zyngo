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
        selectedCategory: "All", // ✅ 1. Naya state: Default "All" rakha hai
        cartItems: [],
        totalAmount: 0,
        myOrders: [],
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.loading = false; 
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCity: (state, action) => { state.City = action.payload; },
        setShopsOfMyCity: (state, action) => { state.ShopsOfMyCity = action.payload; },
        setItemsInMyCity: (state, action) => { state.itemsInMyCity = action.payload; },
        
        setSearchTerm: (state, action) => { 
            state.searchTerm = action.payload; 
        },

        // ✅ 2. Category update karne ke liye reducer
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },

        addToCart: (state, action) => {
            const cartItem = action.payload;
            const existingItem = state.cartItems.find(i => (i._id || i.id) === (cartItem._id || cartItem.id));
            if (existingItem) { existingItem.quantity = cartItem.quantity; } 
            else { state.cartItems.push(cartItem); }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        },
        updateQuantity: (state, action) => { 
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(i => (i._id || i.id) === id);
            if (item) { item.quantity = quantity; }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        },
        removecartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(i => (i._id || i.id) !== action.payload);
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        },
        setMyOrders: (state, action) => { state.myOrders = action.payload; },
        addMyOrder: (state, action) => {
            if (action.payload) { state.myOrders = [action.payload, ...state.myOrders]; }
        }
    }
});

// ✅ 3. setSelectedCategory ko export karna mat bhulna
export const { 
    setUserData, setLoading, setCity, setShopsOfMyCity, 
    setItemsInMyCity, setSearchTerm, setSelectedCategory, 
    addToCart, updateQuantity, 
    removecartItem, setMyOrders, addMyOrder 
} = userSlice.actions;

export default userSlice.reducer;