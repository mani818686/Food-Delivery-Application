import { useEffect, useState } from 'react';
import "./index.css";
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteData, getData, postData } from '../../http-post-service';


function Dashboard({ category }) {
 
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();
  
  const handleDelete = async (productId)=>{

    try{
      const response = await deleteData("/product/products/"+productId)
      if(response.message == "Product deleted successfully"){

        setProducts((products) => products.filter(p => p._id !== productId))
      }
      else
      console.error(response)
    }
    catch(e){
      console.error("Error"+e)
    }

  }

  // useEffect(() => {
  //   const getProfile = async () =>{
  //     if (!isLoggedIn && token) {
  //       dispatch(setAuthToken(token))
  //       dispatch(setLoggedIn(true))
  //       try {
  //         const data = await getData("/admin/checkUser")
  //         dispatch(saveUser(data.result[0]))
  //         dispatch(addAllproducts(data.result[0].wishlist))
  //       }
  //       catch (error) {
  //         console.error(error)
  //       } 
  //     }
  //   }
  //   getProfile()
  // },[isLoggedIn])

  useEffect(() => {
    const fetchData = async () => {
      let url = "/product/products/admin";
      try {
       const result = await getData(url)
        setProducts(result.products);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className='products-container'>
      <div className="filters">
        filter
      </div>
      <div className="products mt-5">
        { products && products?.map((product) => (
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
                      onClick={() => handleDelete(product._id)}
                    ><DeleteIcon /> 
                    </button>
                    
                    {/* {cart[product._id]?.quantity > 0 && <div>Quantity : {cart[product._id]?.quantity ?? 0}</div>} */}
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

export default Dashboard;
