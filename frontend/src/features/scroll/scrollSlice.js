import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
const scrollSlice = createSlice({
  name: 'scroll',
  initialState: {
    shouldScrollToTop: false,
  },
  reducers: {
    requestScrollToTop: (state) => {
      state.shouldScrollToTop = true;
    },
    resetScrollToTop: (state) => {
      state.shouldScrollToTop = false;
    },
  },
});
/* eslint-enable no-param-reassign */

export const { requestScrollToTop, resetScrollToTop } = scrollSlice.actions;

export default scrollSlice.reducer;
