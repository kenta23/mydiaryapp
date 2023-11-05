import { createSlice } from "@reduxjs/toolkit";

type diaryUidType = {
   value: string | null | undefined
}

const initialState: diaryUidType = {
  value: ''
}

export const diaryReducer = createSlice({
    name: 'diaryData',
    initialState,
    reducers: { 
        putDiaryuid: (state, action) => {
          state.value = action.payload
        },
        
    }
})

export const { putDiaryuid } = diaryReducer.actions;

export default diaryReducer.reducer