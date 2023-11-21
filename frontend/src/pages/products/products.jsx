import { useEffect, useState } from 'react';
import axios from 'axios';
import "./products.css";
import { useSelector, useDispatch } from 'react-redux';
import { addAllproducts, addProduct, deleteProduct } from '../../cartslice';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setLoggedIn } from '../../loginSlice';
import { getData, postData } from '../../http-post-service';
import { saveUser } from '../../userslice';

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);
  const cart = useSelector((state) => state.cart.items);
  console.log(cart)

  const dispatch = useDispatch();

  const handleDeleteCart = async (product) => {
    try {
      if (cart && product._id in cart) {
        const response = await postData("/customer/wishlist/delete/" + product._id);
        if (response.message === "Product removed from wishlist successfully") {
          dispatch(deleteProduct(product));
        } else {
          console.error(response);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  

  const handleAddCart = async(product) => {
    
    if (isLoggedIn && token) {
        const response = await postData("/customer/wishlist/add/"+product._id)
        if(response.message == "Product added to wishlist successfully"){
          dispatch(addProduct(product));
        }
        else{
          console.error(response)
        }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const getProfile = async () =>{
      if (!isLoggedIn && token) {
        dispatch(setAuthToken(token))
        dispatch(setLoggedIn(true))
        try {
          const data = await getData("/customer/checkUser")
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

  useEffect(() => {
    const fetchData = async () => {
      let url = "/product/products";
      if (category) {
        url += "?categoryName=" + category;
      }
      try {
       const result = await getData(url)
        setProducts(result.products);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [category]);
  

  return (
    <div className='products-container'>
      <div className="filters">
        filter
      </div>
      <div className="products mt-5">
        {cart && products && products?.map((product) => (
          <div key={product._id} className="Card">
            <div className="image imgText">
              <img width="300px" height="300px" alt={product.name} src={"/uploads/" + product.image} />
            </div>
            <div className="productBrand">
              <div className="product">
                <h5 className='brand-name'>{product.brandId.brandName}</h5>
                <div className='product-name'>{product.name}</div>
              </div>
              <div className='info'>
                <div className="left">
                  <div>Price: $ {product.price}</div>
                  <div className='color'>Color: {product.variantId.color}</div>
                </div>
                <div className="right">
                  <div className='size'>Size: {product.variantId.size}</div>
                  <div>
                  { product && product?._id in cart && <button
                      className='add-product-btn btn btn-primary'
                      onClick={() => handleDeleteCart(product)}
                    ><DeleteIcon /> 
                    </button>
                    }
                    <button
                      className='add-product-btn btn btn-primary'
                      onClick={() => handleAddCart(product)}
                    >
                     Add to Cart
                    </button>
                    {cart[product._id]?.quantity > 0 && <div>Quantity : {cart[product._id]?.quantity ?? 0}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
