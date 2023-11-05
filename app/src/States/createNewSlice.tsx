import { createSlice } from "@reduxjs/toolkit";

type initialStateType = {
    value: boolean | undefined | null;
}
const initialState: initialStateType = {
    value: false
}

export const createPostReducer = createSlice({
    name: 'createPostReducer',
    initialState,
    reducers: {
          newPostStatus: (state, action) => {
            state.value = action.payload
          }
    }
}) 

export const { newPostStatus } = createPostReducer.actions
export default createPostReducer.reducer