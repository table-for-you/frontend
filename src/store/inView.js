import { createSlice } from "@reduxjs/toolkit";

export const inViewSlice = createSlice({
  name: "inView",
  initialState: false,
  reducers: {
    setInview: (state, action) => action.payload,
  },
});

export const { setInview } = inViewSlice.actions;
export default inViewSlice.reducer;
