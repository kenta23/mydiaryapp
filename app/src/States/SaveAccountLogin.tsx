import { createSlice } from "@reduxjs/toolkit";
import { accountInfoState } from '../utils/reduxTypes'

const initialState: accountInfoState = {
    value: {
      FirstName: '',
      LastName: '',
      Email: '',
      ProfileDisplay: '', // Initialize with default value
    },
  };


export const saveAccountInput = createSlice( {
    name: 'saveAccount',
    initialState,
    reducers: {
        saveAccount: (state, action) => {
             state.value = action.payload
        },
        updateProfileDisplay: (state, action) => {
           state.value.ProfileDisplay = action.payload
        }
     }
})


export const { saveAccount, updateProfileDisplay } = saveAccountInput.actions
export default saveAccountInput.reducer;