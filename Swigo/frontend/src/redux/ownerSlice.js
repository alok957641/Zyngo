import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name: "owner",
    initialState: {
        // ✅ 'null' ki jagah 'undefined' rakho taaki loading handle ho sake
        myShopData: undefined, 
    },
    reducers: {
        setMyShopData: (state, action) => {
            // Ab agar action.payload mein 'null' aayega, toh woh 'No Shop Found' treat hoga
            // Aur agar 'undefined' hoga, toh woh 'Loading' treat hoga
            state.myShopData = action.payload;
        }
    }
});

export const { setMyShopData } = ownerSlice.actions;
export default ownerSlice.reducer;