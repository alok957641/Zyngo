import { createSlice } from "@reduxjs/toolkit";

// ✅ Load user from localStorage on app start
const loadUserFromStorage = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error loading user from storage:", error);
        return null;
    }
};

// ✅ Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error("Error loading cart from storage:", error);
        return [];
    }
};

// ✅ Load total amount from localStorage
const loadTotalAmountFromStorage = () => {
    try {
        const storedAmount = localStorage.getItem('totalAmount');
        return storedAmount ? JSON.parse(storedAmount) : 0;
    } catch (error) {
        return 0;
    }
};

const initialState = {
    userData: loadUserFromStorage(),
    loading: false, // ✅ Already false because we have cached data
    City: null,
    ShopsOfMyCity: null,
    itemsInMyCity: null,
    searchTerm: "",
    selectedCategory: "All",
    cartItems: loadCartFromStorage(),
    totalAmount: loadTotalAmountFromStorage(),
    myOrders: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.loading = false;
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            } else {
                localStorage.removeItem('user');
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCity: (state, action) => { 
            state.City = action.payload; 
        },
        setShopsOfMyCity: (state, action) => { 
            state.ShopsOfMyCity = action.payload; 
        },
        setItemsInMyCity: (state, action) => { 
            state.itemsInMyCity = action.payload; 
        },
        setSearchTerm: (state, action) => { 
            state.searchTerm = action.payload; 
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        addToCart: (state, action) => {
            const cartItem = action.payload;
            const existingItem = state.cartItems.find(i => (i._id || i.id) === (cartItem._id || cartItem.id));
            if (existingItem) { 
                existingItem.quantity = cartItem.quantity; 
            } else { 
                state.cartItems.push(cartItem); 
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
            localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
        },
        updateQuantity: (state, action) => { 
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(i => (i._id || i.id) === id);
            if (item) { 
                item.quantity = quantity; 
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
            localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
        },
        removecartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(i => (i._id || i.id) !== action.payload);
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
            localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.totalAmount = 0;
            localStorage.removeItem('cart');
            localStorage.removeItem('totalAmount');
        },
        setMyOrders: (state, action) => { 
            state.myOrders = action.payload; 
        },
        addMyOrder: (state, action) => {
            if (action.payload) { 
                state.myOrders = [action.payload, ...state.myOrders]; 
            }
        },
        // ✅ Reset entire state on logout
        resetUserState: () => initialState,
    }
});

export const { 
    setUserData, 
    setLoading, 
    setCity, 
    setShopsOfMyCity, 
    setItemsInMyCity, 
    setSearchTerm, 
    setSelectedCategory, 
    addToCart, 
    updateQuantity, 
    removecartItem,
    clearCart,
    setMyOrders, 
    addMyOrder,
    resetUserState  // ✅ New action for logout
} = userSlice.actions;

export default userSlice.reducer;