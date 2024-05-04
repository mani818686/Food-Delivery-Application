import { useEffect, useState } from "react";
import axios from "axios";
import "./products.css";
import { useSelector, useDispatch } from "react-redux";
import { addAllproducts, addProduct, deleteProduct } from "../../cartslice";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { setAuthToken, setLoggedIn } from "../../loginSlice";
import { getData, postData } from "../../http-post-service";
import { saveUser } from "../../userslice";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Products() {
  const [category, setCategory] = useState([]);
  const [selectedCategory,setSelectedCategory] = useState('')
  const [foodItemsMap,setFoodItemsMap] = useState(new Map());
  const [foodItems,setFoodItems] = useState([]);
  const token = localStorage.getItem("authToken");
  const [sizes, setSizes] = useState("");
  const [color, setColor] = useState("");

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);
  const cart = useSelector((state) => state.cart.items);
  // console.log(cart);

  const dispatch = useDispatch();


    const handleAddCart = async (foodItem) => {

      const response = await postData("/customer/wishlist/add/" + foodItem._id);
      if (response.message === "Food Item added to wishlist successfully") {
       let data ={
        "product":foodItem,
       }
       console.log(data);
        dispatch(addProduct(data))
      } else {
        console.error(response);
      }
    }
    const handleDeleteCart = async (foodItem) => {
      try {
      
          const response = await postData(
            "/customer/wishlist/delete/" + foodItem._id
          );
          if (response.message === "FoodItem removed from wishlist successfully") {
            dispatch(deleteProduct(foodItem));
          } else {
            console.error(response);
          }
        }
       catch (error) {
        console.error("Error deleting product:", error);
      }
    };

  useEffect(() => {
    const getProfile = async () => {
      if (!isLoggedIn && token) {
        dispatch(setAuthToken(token));
        dispatch(setLoggedIn(true));
        try {
          const data = await getData("/customer/checkUser");
          dispatch(saveUser(data.result[0]));
          dispatch(addAllproducts(data.result[0].wishlist));
        } catch (error) {
          console.error(error);
        }
      }
    };
    getProfile();
  }, [isLoggedIn]);

  const handleCategory = (c) =>{
    console.log(c)
    setSelectedCategory(c)
  }

  useEffect(()=>{
    setFoodItems(foodItemsMap.get(selectedCategory))
  },[selectedCategory])

  useEffect(() => {
    const fetchData = async () => {
      let url = "/foodItem/category";

      try {
        const result = await getData(url);
        console.log(result);
        setCategory(result.categories);
        const prevfoodItems = new Map(foodItemsMap);
       
        result.categories.forEach((c,index)=>{
          if(index === 0){
            console.log(c.categoryName)
             setSelectedCategory(c.categoryName)
             setFoodItems(c.foodItems)
          }
         
          prevfoodItems.set(c.categoryName,c.foodItems)
        })
        setFoodItemsMap(prevfoodItems)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="products-container">
      <div className="menu">
      <ul>
        {category &&
          category.map((c, index) => {
            return (
              <li className={`${selectedCategory == c.categoryName ? 'active':''}`} key={index} onClick={(e)=>handleCategory(c.categoryName)}>
               {c.categoryName}
              </li>
            );
          })}
           </ul>
      </div>
      {cart && foodItems &&
        foodItems.map((product) => (
          <div key={product._id} className="Card">
            <div className="image imgText">
              <img
                width="300px"
                height="300px"
                alt={product.name}
                src={"/uploads/" + product.image}
                // src="https://picsum.photos/seed/picsum/200/300"
              />
            </div>
            <div className="productBrand">
              <div className="product">
                <div className="product-name">{product.name}</div>
              </div>
              <div style={{ float: 'right' }}>
                <button
                  className=' btn'
                  onClick={() => handleAddCart(product)}
                >
                  <AddIcon/>
                </button>
                {cart[product._id]?.quantity > 0 && <button
                  className='btn'
                  onClick={() => handleDeleteCart(product)}
                >
                  <RemoveIcon/>
                </button>
                }
                {cart[product._id]?.quantity > 0 && <div>Quantity : {cart[product._id]?.quantity ?? 0}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }} className="color">Price : {product.price}</div>
            </div>
          </div>
        ))}
      </div>
  )      
}
export default Products;

