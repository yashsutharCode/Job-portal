import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: [],
    },
    reducers: {
        // setAllApplicants is used to store the list of applicants for a specific job
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;