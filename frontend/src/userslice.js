import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    selectedAddress:{}
  },
  reducers: {
    saveUser:(state,action) =>{
        state.user=action.payload
    },
    deleteUser:(state,action) =>{
        delete state.user
    },
    addUserAddress: (state,action) =>{
      state.user.address = state.user.address ? [...state.user.address, action.payload] : [action.payload];
    },
    saveSelectedAddress: (state,action)=>{
      state.selectedAddress = action.payload
    }
  },
})

export const { saveUser, deleteUser,addUserAddress ,saveSelectedAddress} = userSlice.actions

export default userSlice.reducer