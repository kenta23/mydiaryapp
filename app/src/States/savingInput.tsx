import { createSlice } from "@reduxjs/toolkit";

type inputType = {
    value: {
        title: string,
        diary: string
    }
}

const initialState: inputType = {
    value: {
        title: '',
        diary: ''
    }
}

export const saveInput = createSlice( {
    name: 'saveInput',
    initialState,
    reducers: {
        saveTitleAndContext: (state, action) => {
            state.value = {title: action.payload.title, diary: action.payload.diary}
        },
        
     }
})


export const { saveTitleAndContext } = saveInput.actions
export default saveInput.reducer;