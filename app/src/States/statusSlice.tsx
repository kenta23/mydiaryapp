import { createSlice } from "@reduxjs/toolkit";

type statusType = {
    value: string
}

const initialState: statusType = {
    value: ''  //default value is empty string 
}

export const statusReducer = createSlice({
     name: 'status',
     initialState,
     reducers: {
         updateStatus: (state, action) => {
             state.value = action.payload
         },
         clearStatus: (state) => {
             state.value = ''; //clear status 
         }
     }
})


export const { updateStatus, clearStatus } = statusReducer.actions
export default statusReducer.reducer;  