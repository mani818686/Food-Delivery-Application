import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    price:0,
    deliveryType:''
  },
  reducers: {
    addProduct:(state,action) =>{
      console.log(action.payload,"slice")
      const data = action.payload;
      let product = {...data.product};
      product["foodItemId"] = product._id
      const quantity = state.items[product._id]?.quantity ?? 0
      if(quantity>0)
        state.items[product._id] =  {...state.items[product._id],"quantity":quantity+1}
      else 
        state.items[product._id] = {product:product,"quantity":1}
      },
    deleteProduct:(state,action) =>{
      const variant = action.payload;
      const quantity = state.items[variant._id]?.quantity ?? 0
      if(quantity>1)
      state.items[variant._id].quantity = quantity-1
      else
        delete state.items[variant._id]
    },
    setTotalPrice : (state,action)=>{
      state.price = action.payload
    },
    addAllproducts:(state,action)=>{
      const foodItems=action.payload
      // console.log()
      console.log(foodItems)
      const result={}
      let price = 0
      foodItems.forEach(product => {
         result[product.FoodItemId._id] = {product:product.FoodItemId,"quantity":product.quantity}
         price += product.price * product.quantity
      });
      state.items = result
      state.price =price
    },
    deleteAllProducts:(state)=>{
      state.items ={}
      state.price =0
    },
    setDeliveryType: (state,action)=>{
      state.deliveryType = action.payload
    }
  },
})

export const { addProduct, deleteProduct,setTotalPrice ,addAllproducts,deleteAllProducts,setDeliveryType} = cartSlice.actions

export default cartSlice.reducer