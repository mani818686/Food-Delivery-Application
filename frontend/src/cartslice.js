import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    price:0
  },
  reducers: {
    addProduct:(state,action) =>{
      console.log(action.payload)
      const data = action.payload;
      let variant = {...data.variant};
      let product = {...data.product};
      product["productId"] = product._id
      variant["variantId"] = variant._id
      const quantity = state.items[variant._id]?.quantity ?? 0
      if(quantity>0)
        state.items[variant._id] =  {...state.items[variant._id],"quantity":quantity+1}
      else 
        state.items[variant._id] = {product:product,variant:variant,"quantity":1}
      },
    deleteProduct:(state,action) =>{
      const variant = action.payload;
      const quantity = state.items[variant._id]?.quantity ?? 0
      if(quantity>0)
      state.items[variant._id].quantity = quantity-1
      else
        delete state.items[variant._id]
    },
    setTotalPrice : (state,action)=>{
      state.price = action.payload
    },
    addAllproducts:(state,action)=>{
      const products=action.payload
      // console.log()
      console.log(products)
      const result={}
      let price = 0
      products.forEach(product => {
         result[product.variantId._id] = {product:product.productId, variant:product.variantId,"quantity":product.quantity}
         price += product.variantId.price * product.quantity
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