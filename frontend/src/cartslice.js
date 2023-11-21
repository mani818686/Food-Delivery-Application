import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    price:0
  },
  reducers: {
    addProduct:(state,action) =>{
      const product = action.payload
      const quantity = state.items[product._id]?.quantity ?? 0
      console.log(state.items[product._id])
      if(quantity>0)
        state.items[product._id] =  {...state.items[product._id],"quantity":quantity+1}
      else 
        state.items[product._id] = {...product,"quantity":1}
      },
    deleteProduct:(state,action) =>{
      const product = action.payload
      const quantity = state.items[product._id]?.quantity ?? 0
      if(quantity>0)
      state.items[product._id].quantity =quantity-1
      else
        delete state.items[action.payload._id]
    },
    setTotalPrice : (state,action)=>{
      state.price = action.payload
    },
    addAllproducts:(state,action)=>{
      const products=action.payload
      console.log(products)
      const result={}
      let price =0 
      products.forEach(product => {
         result[product.productId._id] = {...product.productId,"quantity":product.quantity}
         price += product.productId.price * product.quantity
      });
      state.items = result
      state.price =price
    },
    deleteAllProducts:(state)=>{
      state.items ={}
      state.price =0
    }
  },
})

export const { addProduct, deleteProduct,setTotalPrice ,addAllproducts,deleteAllProducts} = cartSlice.actions

export default cartSlice.reducer