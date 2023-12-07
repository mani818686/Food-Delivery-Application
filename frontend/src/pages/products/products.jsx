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

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("authToken");
  const [sizes,setSizes] = useState("")
  const [color,setColor] = useState("")

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);
  const cart = useSelector((state) => state.cart.items);
  console.log(cart);

  const dispatch = useDispatch();

 

  
const handleView = async (productId)=>{
  navigate("/productDetails/"+productId)
}

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

  useEffect(() => {
    const fetchData = async () => {
      let url = "/product/products";
      if (category) {
        url += "?categoryName=" + category;
      }
      try {
        const result = await getData(url);
        setProducts(result.products);

        const sizes = result.products[0].variantId.map(v=>v.size)
        const uniqueSizes = [...new Set(sizes)];
        const colors =result.products[0].variantId.map(v=>v.color)
        const uniqueColors = [...new Set(colors)];
        const joinedSizes = uniqueSizes.join(',');
        const joinedColors = uniqueColors.join(',');
        setSizes(joinedSizes)
        setColor(joinedColors)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="products-container">
      <div className="filters">filter</div>
      <div className="products mt-5">
        {cart &&
          products &&
          products?.map((product) => (
            <div key={product._id} className="Card">
              <div className="image imgText">
                <img
                  width="300px"
                  height="300px"
                  alt={product.name}
                  src={"/uploads/" + product.image}
                />
              </div>
              <div className="productBrand">
                <div className="product">
                  <h5 className="brand-name">{product.brandId.brandName}</h5>
                  <div className="product-name">{product.name}</div>
                </div>
                <div style={{float:'right'}}>
                  <button className="btn btn-primary" onClick={()=>handleView(product._id)}>View Details</button>
                  </div>
                {/*
                    <button
                      className='add-product-btn btn btn-primary'
                      onClick={() => handleAddCart(product)}
                    >
                     Add to Cart
                    </button>
                    {cart[product._id]?.quantity > 0 && <div>Quantity : {cart[product._id]?.quantity ?? 0}</div>}
                  </div>
                </div>
              </div> */}
              <div  style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <div  className="color">Size(s) Available: {sizes}</div>
              <div  style={{display:'flex', flexDirection:'row'}} className="color">Colors(s) Available: {color}</div>
              <div  style={{display:'flex', flexDirection:'row'}} className="color">Price : {product.variantId[0].price}</div>
             </div>
             </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Products;
