import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {

    addProduct:(state,action) =>{
        state.items.push(action.payload)
    },
    deleteProduct:(state,action) =>{
        state.items.filter((item)=>(item._id !== action.payload))
    }
  },
})

export const { addProduct, deleteProduct } = cartSlice.actions

export default cartSlice.reducer