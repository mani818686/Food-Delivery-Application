
import './App.css';
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Navbar from './components/navbar';
import Home from './pages/home/home';
import { useState } from 'react';
import Products from './pages/products/products';
import Addproducts from './pages/addProducts/addproducts';


function App() {
  const [Category, setCategory] = useState("")

  const handleCategory = (category) => {
    setCategory(category)
  }

  return (
    <div className="App">
      <Navbar/>
      <Router>
        <Routes>
        <Route exact path="/" element={<Home handleSelectedCategory = {handleCategory}/>}></Route>
        <Route exact path="/register" element={<Register/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/products" element={<Products category={Category}/>}></Route>
        <Route exact path="/addProducts" element={<Addproducts/>}></Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;



// Users -> Should Order, Should show the orders, should save the payments 
//Admin -> Add product -> Done