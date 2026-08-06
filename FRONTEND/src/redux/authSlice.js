import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false; // Reset loading state when user is set
        },
    },
    // Reset loading state back to false whenever state rehydrates from storage
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state) => {
            state.loading = false;
        });
    },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;