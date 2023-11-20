import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    price:0
  },
  reducers: {
    addProduct:(state,action) =>{
        state.items[action.payload._id]=action.payload
    },
    deleteProduct:(state,action) =>{
        delete state.items[action.payload]
    },
    setTotalPrice : (state,action)=>{
      state.price = action.payload
    }
  },
})

export const { addProduct, deleteProduct,setTotalPrice } = cartSlice.actions

export default cartSlice.reducer