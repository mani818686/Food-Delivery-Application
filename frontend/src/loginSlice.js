import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    details: {
        authToken:null,
        isLoggedIn:false,
        isAdmin:false
    },
  },
  reducers: {
    setAuthToken:(state,action) =>{
        state.details.authToken=action.payload
    },
    setLoggedIn:(state,action) =>{
        state.details.isLoggedIn = action.payload
    },
    setisAdmin:(state,action) =>{
        state.details.isAdmin = action.payload
    }
  },
})

export const { setAuthToken, setLoggedIn, setisAdmin } = loginSlice.actions

export default loginSlice.reducer