import { configureStore } from '@reduxjs/toolkit'
import cartslice from './cartslice'
import userSlice  from './userslice'
import loginSlice from './loginSlice'

export default configureStore({
  reducer: {
    cart:cartslice,
    user:userSlice,
    login:loginSlice
},
})