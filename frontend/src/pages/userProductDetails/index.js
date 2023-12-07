import { useEffect, useState } from "react";
import "./index.css";
import { useParams } from "react-router-dom";
import { getData, postData } from "../../http-post-service";
import { addAllproducts, addProduct, deleteProduct } from "../../cartslice";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../../userslice";
import DeleteIcon from '@mui/icons-material/Delete';

function UserProductDetails() {
  const { productId } = useParams(); // Get the order ID from the URL parameter
  const [productDetails, setProductDetails] = useState([]);
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.items);
  console.log(cart)
  const handleAddCart = async (product,variant) => {

      const response = await postData("/customer/wishlist/add/" + product._id+"/"+variant._id);
      if (response.message === "Product added to wishlist successfully") {
       let data ={
        "product":product,
        "variant":variant
       }
        dispatch(addProduct(data))
      } else {
        console.error(response);
      }
    }
    const handleDeleteCart = async (variant) => {
      try {
      
          const response = await postData(
            "/customer/wishlist/delete/" + productDetails._id + "/"+variant._id
          );
          if (response.message === "Product removed from wishlist successfully") {
            dispatch(deleteProduct(variant));
          } else {
            console.error(response);
          }
        }
       catch (error) {
        console.error("Error deleting product:", error);
      }
    };

    useEffect(() => {
      const getProfile = async () =>{
          try {
            const data = await getData("/customer/checkUser")
            dispatch(saveUser(data.result[0]))
            dispatch(addAllproducts(data.result[0].wishlist))
            getOrderDetails()
          }
          catch (error) {
            console.error(error)
          }
      }
      const getOrderDetails = async () => {
        try {
          const data = await getData(`/product/${productId}`);
          setProductDetails(data.products[0]);
          console.log(data.products[0]);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };
      getProfile()
    },[])
  


 

  return (
    <div className="product-container">
      <h2>Product Details</h2>
      <h2>Name : {productDetails.name}</h2>
      <img
        width="300px"
        height="300px"
        src={"/uploads/" + productDetails.image}
        alt={productDetails.name}
      />
      <p>Description: {productDetails.description}</p>
      <p>Category: {productDetails.categoryId?.categoryName}</p>
      <p>Brand: {productDetails.brandId?.brandName}</p>
      <h3>Variants:</h3>
      <div>
        {productDetails?.variantId &&
          productDetails?.variantId.map((variant, index) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div key={variant._id}>
                {index + 1} : Size: {variant.size}, Color: {variant.color},
                Price: ${variant.price}
              </div>
              <div>
                <button
                className="btn btn-primary"
                  style={{ marginLeft: "30px" }}
                  onClick={() => handleAddCart(productDetails,variant)}
                >
                 Add to Cart
                </button>
                {cart[variant._id]?.quantity > 0 && <div>Quantity : {cart[variant._id]?.quantity ?? 0}</div>}
                { variant && variant?._id in cart && cart[variant._id]?.quantity > 0 && <button
                      className='add-product-btn btn btn-primary'
                      onClick={() => handleDeleteCart(variant)}
                    ><DeleteIcon /> 
                    </button>
                    }
              </div>
            </div>
          ))}
          </div>
    </div>
  );
}

export default UserProductDetails;
