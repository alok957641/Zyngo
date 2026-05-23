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

        // ✅ USER DATA
        setUserData: (state, action) => {

            state.userData = action.payload;

        },

        // ✅ LOADING
        setLoading: (state, action) => {

            state.loading = action.payload;

        },

        // ✅ CITY
        setCity: (state, action) => {

            state.City = action.payload;

        },

        // ✅ SHOPS
        setShopsOfMyCity: (state, action) => {

            state.ShopsOfMyCity = action.payload;

        },

        // ✅ ITEMS
        setItemsInMyCity: (state, action) => {

            state.itemsInMyCity = action.payload;

        },

        // ✅ SEARCH
        setSearchTerm: (state, action) => {

            state.searchTerm = action.payload;

        },

        // ✅ CATEGORY
        setSelectedCategory: (state, action) => {

            state.selectedCategory = action.payload;

        },

        // ✅ ADD TO CART
        addToCart: (state, action) => {

            const cartItem = action.payload;

            const existingItem = state.cartItems.find(

                i => (i._id || i.id) === (cartItem._id || cartItem.id)

            );

            if (existingItem) {

                existingItem.quantity = cartItem.quantity;

            } else {

                state.cartItems.push(cartItem);

            }

            state.totalAmount = state.cartItems.reduce(

                (sum, i) => sum + (i.price * i.quantity),

                0

            );

        },

        // ✅ UPDATE QUANTITY
        updateQuantity: (state, action) => {

            const { id, quantity } = action.payload;

            const item = state.cartItems.find(

                i => (i._id || i.id) === id

            );

            if (item) {

                item.quantity = quantity;

            }

            state.totalAmount = state.cartItems.reduce(

                (sum, i) => sum + (i.price * i.quantity),

                0

            );

        },

        // ✅ REMOVE ITEM
        removecartItem: (state, action) => {

            state.cartItems = state.cartItems.filter(

                i => (i._id || i.id) !== action.payload

            );

            state.totalAmount = state.cartItems.reduce(

                (sum, i) => sum + (i.price * i.quantity),

                0

            );

        },

        // ✅ MY ORDERS
        setMyOrders: (state, action) => {

            state.myOrders = action.payload;

        },

        addMyOrder: (state, action) => {

            if (action.payload) {

                state.myOrders = [

                    action.payload,

                    ...state.myOrders

                ];

            }

        }

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

    setMyOrders,

    addMyOrder

} = userSlice.actions;

export default userSlice.reducer;