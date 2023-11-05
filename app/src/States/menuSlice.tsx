import { createSlice } from "@reduxjs/toolkit";

type menuOpenType = {
   value: boolean;
}

const initialState: menuOpenType = {
  value: false
}

export const menuReducer = createSlice({
    name: 'menuClicked',
    initialState,
    reducers: { 
        open: (state) => {
          state.value = !state.value
        }
        
    }
})

export const { open } = menuReducer.actions;

export default menuReducer.reducer;