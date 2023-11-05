import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
  },
  reducers: {

    addProduct:(state,action) =>{
        state.items[action.payload._id]=action.payload
    },
    deleteProduct:(state,action) =>{
        delete state.items[action.payload]
    }
  },
})

export const { addProduct, deleteProduct } = cartSlice.actions

export default cartSlice.reducer