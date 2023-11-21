import { useSelector, useDispatch } from 'react-redux';
import { addAllproducts, addProduct, deleteProduct, setTotalPrice } from '../../cartslice';
import "./cart.css";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { setAuthToken, setLoggedIn } from '../../loginSlice';
import { getData, postData } from '../../http-post-service';
import { useEffect } from 'react';
import { saveUser } from '../../userslice';

const Cart = () => {

  const cart = useSelector(state => state.cart.items);

  const cartItems = Object.values(cart)

  const Totalprice = cartItems?.reduce((acc, product) => acc + (product.price*product.quantity), 0);

  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);

  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken")

  const navigate = useNavigate();

  const handleDeleteProduct = async(product) => {
    console.log(product,cart , product._id in cart)
      try {
        if (cart && product._id in cart) {
          const response = await postData("/customer/wishlist/delete/" + product._id);
          if (response.message === "Product removed from wishlist successfully") {
            dispatch(deleteProduct(product));
          } else {
            console.error(response);
          }
        }
        console.log("RTYUIO")
      } catch (error) {
        console.error("Error deleting product:", error);
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

  const handleOrder = () => {
    dispatch(setTotalPrice(Totalprice))
    navigate("/checkout");  // Use the navigate function directly
  };

  if (cartItems && cartItems?.length === 0) {
    return <h1 style={{ marginTop: '8%' }}>Cart is empty</h1>;
  } 
  return  (
    <div className='cart-container'>
      <div className="cart-items">
        {cartItems &&
          cartItems
            .filter((product) => product.quantity > 0)
            .map((product) => (
              <div className="item" key={product._id}>
                <div className="details">
                  <div className="left">
                    <img width="100px" height="100px" alt={product.name} src={"/uploads/" + product.image} />
                    <div className='delete'>
                      <DeleteIcon onClick={() => handleDeleteProduct(product)} />
                    </div>
                  </div>
                  <div className="right">
                    <div className='product-name'>{product.name}</div>
                    <div className='size'>Size: {product.variantId.size}</div>
                    <div className="color">Color: {product.variantId.color}</div>
                  </div>
                </div>
                <div className="price">Price: $ {product.price}</div>
                <div className="price">Quantity: {product.quantity}</div>
              </div>
            ))}
        {cartItems && cartItems.length > 0 && (
          <div>
            <div className='summary'>
              <div className="left">
                Total items: {cartItems.length}
              </div>
              <div className="right"> Total Price: $ {Totalprice.toFixed(2)}</div>
            </div>
            <div className='place-order'>
              <button className="btn btn-primary" onClick={handleOrder}>Place your Order</button>
            </div>
          </div>
        )}
      </div>
    </div>
)};
  

export default Cart;
