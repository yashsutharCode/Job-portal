import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    SetAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    }
  },
});

export const { setAllJobs, setSingleJob, SetAllAdminJobs } = jobSlice.actions;
export default jobSlice.reducer;
