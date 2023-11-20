import { useEffect, useState } from 'react';
import axios from 'axios';
import "./products.css";
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct } from '../../cartslice';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setLoggedIn } from '../../loginSlice';
import { getData } from '../../http-post-service';
import { saveUser } from '../../userslice';

function Products({ category }) {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleAddCart = (product) => {
    
    if (isLoggedIn && token) {
      if (!(product._id in cart)) {
        dispatch(addProduct(product));
      } else {
        dispatch(deleteProduct(product._id));
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
        {products && products?.map((product) => (
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
                    <button
                      className='add-product-btn btn btn-primary'
                      onClick={() => handleAddCart(product)}
                    >
                      {product._id in cart ? <DeleteIcon /> : "Add to Cart"}
                    </button>
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
