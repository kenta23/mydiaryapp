import { createSlice } from "@reduxjs/toolkit";

type urlType = {
    value: string
}

const initialState: urlType = {
    value: ''
}

export const imageUrlReducer = createSlice({
    name: 'imageUrl',
    initialState,
    reducers: {
          addUrl: (state, action) => {
            state.value = action.payload;
          } 
    }
})

export const { addUrl } = imageUrlReducer.actions
export default imageUrlReducer.reducer