import { useSelector, useDispatch } from 'react-redux';
import { addProduct, deleteProduct, setTotalPrice } from '../../cartslice';
import "./cart.css";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { setAuthToken, setLoggedIn } from '../../loginSlice';
import { getData } from '../../http-post-service';
import { useEffect } from 'react';

const Cart = () => {

  const cart = Object.values(useSelector(state => state.cart.items));

  const Totalprice = cart?.reduce((acc, product) => acc + product.price, 0);

  const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);

  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken")

  const navigate = useNavigate();

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };



  const handleOrder = () => {
    dispatch(setTotalPrice(Totalprice))
    navigate("/checkout");  // Use the navigate function directly
  };

  if (cart && cart?.length === 0) {
    return <h1 style={{ marginTop: '8%' }}>Cart is empty</h1>;
  } 
  return (
    <div className='cart-container'>
      <div className="cart-items">
        {cart && cart?.map((product) => (
          <div className="item" key={product._id}>
            <div className="details">
              <div className="left">
                <img width="100px" height="100px" alt={product.name} src={"/uploads/" + product.image} />
                <div className='delete'>
                  <DeleteIcon onClick={() => handleDeleteProduct(product._id)} />
                </div>
              </div>
              <div className="right">
                <div className='product-name'>{product.name}</div>
                <div className='size'>Size: {product.variantId.size}</div>
                <div className="color">Color: {product.variantId.color}</div>
              </div>
            </div>
            <div className="price">Price: $ {product.price}</div>
          </div>
        ))}
        {cart && cart?.length > 0 && (
          <div>
            <div className='summary'>
              <div className="left">
                Total items: {cart.length}
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
  );
};

export default Cart;
