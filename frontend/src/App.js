import './App.css';
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Navbar from './components/navbar';
import Home from './pages/home/home';
import { useState } from 'react';
import Products from './pages/products/products';
import Addproducts from './pages/addProducts/addproducts';
import Cart from './pages/cart/cart';
import Checkout from './pages/checkout';
import Payment from './pages/payment';
import { useSelector } from 'react-redux';
import DeliveryLogin from './pages/DeliveryLogin';
import DeliveryRegister from './pages/DeliveryRegister';
import Confirmation from './pages/confirmation';
import Orders from './pages/orders';
import OrderDetails from './pages/orderDetails';
import AdminLogin from './pages/adminlogin';
import AdminRegister from './pages/adminregister';
import { RequireAdminAuth } from './adminauth';
import { RequireUserAuth } from './RequireAuth';
import Dashboard from './pages/dashboard';
 
 
function App() {
  const [Category, setCategory] = useState("")
 
  const [orderDetails,setOrderDetails] =useState({})
 
  const loginDetails = useSelector((state)=>state.login.details)
  console.log(loginDetails)
 
  const handleCategory = (category) => {
    setCategory(category)
  }
const handleOrderDetails = (details)=>{
  setOrderDetails(details)
}
 
  return (
    <div className="App">
      <Router>
      <Navbar loggedIn={loginDetails.isLoggedIn} />
        <Routes>
        <Route exact path="/" element={<Home handleSelectedCategory = {handleCategory}/>}></Route>
        <Route exact path="/register" element={<Register/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/products" element={<Products category={Category}/>}></Route>
        <Route exact path="/cart"
          element={<Cart/>}>
         </Route>
        <Route exact path="/checkout" element={<Checkout/>}></Route>
        <Route exact path="/payment" element={<Payment handleOrderDetails={handleOrderDetails} />}></Route>
        <Route exact path="/confirmation" element={<Confirmation orderDetails={orderDetails}/>}></Route>
        <Route exact path="/login/delivery" element={<DeliveryLogin/>}></Route>
        <Route exact path="/register/delivery" element={<DeliveryRegister/>}></Route>
        <Route exact path="/orders" element={<Orders/>}></Route>
        <Route exact path="/order/:orderId" element={<OrderDetails/>}></Route>
        <Route exact path="/login/admin" element={<AdminLogin/>}></Route>
        <Route exact path="/signup/admin" element={<AdminRegister/>}></Route>
        <Route
          path="/admin/dashboard"
          element={
            // <RequireAdminAuth>
              <Dashboard/>
            // </RequireAdminAuth>
          }
        />
        <Route
          path="/addProducts"
          element={
            <RequireAdminAuth>
              <Addproducts />
            </RequireAdminAuth>
          }
        />
        </Routes>
    </Router>
    </div>
  );
}
 
export default App;
 
 
 
