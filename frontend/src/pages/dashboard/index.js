import { useEffect, useState } from "react";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteData, getData, postData } from "../../http-post-service";
import EditIcon from '@mui/icons-material/Edit';
import { setAuthToken, setLoggedIn } from "../../loginSlice";
import { saveUser } from "../../userslice";
import { addAllproducts } from "../../cartslice";

function Dashboard() {
  const token = localStorage.getItem("authToken");
  const [category, setCategory] = useState([]);
  const [selectedCategory,setSelectedCategory] = useState('')
  const [foodItemsMap,setFoodItemsMap] = useState(new Map());
  const [foodItems,setFoodItems] = useState([]);

  const dispatch = useDispatch()
  
  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);

  const navigate = useNavigate();

  const handleDelete = async (productId) => {

    try {
      const response = await deleteData("/foodItem/" + productId);
      if (response.message == "Product deleted successfully") {
        setFoodItems((products) => products.filter((p) => p._id !== productId));

        let map = new Map(foodItemsMap)
        console.log(map)
        let k = [...map.get(selectedCategory)]
        console.log(k)
        let updated = k.filter((p)=>p._id != productId)
        console.log(updated)
        map.set(selectedCategory,updated)
        console.log(map)
        setFoodItemsMap(map)
      } else console.error(response);
    } catch (e) {
      console.error("Error" + e);
    }
  };

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


  useEffect(() => {
    const getProfile = async () =>{
      if (!isLoggedIn && token) {
        dispatch(setAuthToken(token))
        dispatch(setLoggedIn(true))
        try {
          const data = await getData("/admin/checkUser")
          dispatch(saveUser(data.result[0]))
          dispatch(addAllproducts(data.result[0].wishlist))
        }
        catch (error) {
          console.error(error)
        }
      }
    }
    getProfile()
  },[isLoggedIn])

  const handleEdit = (productId)=>{
    navigate("/admin/productUpdate/"+productId)
  }


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
      { foodItems &&
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
              <div className="product-edit">
                  <button
                      className='test'
                      style={{float:'right',marginRight:'5px'}}
                      onClick={() => handleEdit(product._id)}
                    ><EditIcon /> 
                    </button>
                    <button
                      className='test'
                      style={{float:'right'}}
                      onClick={() => handleDelete(product._id)}
                    ><DeleteIcon /> 
                    </button>
                  </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }} className="color">Price : {product.price}</div>
            </div>
          </div>
        ))}
      </div>
  );
}

export default Dashboard;