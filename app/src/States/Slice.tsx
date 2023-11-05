import { createSlice } from '@reduxjs/toolkit'

type stateType =  {
    value: boolean
}

const initialState: stateType = {
    value: false
} 



export const ReducerSlice = createSlice({
    name: 'reducer',
    initialState,
    reducers: {
        clicked: (state) => {
            state.value = true
        },
        notClicked: (state) => {
            state.value = false;
        }  
    }
})

export const { clicked, notClicked} = ReducerSlice.actions;

export default ReducerSlice.reducer