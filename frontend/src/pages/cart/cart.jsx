import { useSelector, useDispatch } from 'react-redux'
import { addProduct, deleteProduct } from '../../cartslice'
import "./cart.css"
import { useNavigate} from "react-router-dom"
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {

    const cart = Object.values(useSelector(state => state.cart.items))
    const price = cart.reduce((acc,product)=>acc+product.price,0)
    console.log(price,cart)
    const dispatch = useDispatch()
    console.log(cart)
    const handleDeleteProduct = (id)=>{
        dispatch(deleteProduct(id))
    }

    const navigate = useNavigate();

    const handleorder=()=>{
        navigate("/checkout")
    }

    if(cart.length ==0)
        return (<h1 style={{marginTop:'8%'}}>Cart is empty</h1>)

    return (
        <div className='cart-container'>
            <div className="cart-items">
                {
                    cart.map((product) => {
                        return (
                            <div className="item">
                                <div className="details">
                                    <div className="left">
                                        <img width="100px" height="100px" alt={product.name} src={"/uploads/" + product.image} />
                                        <div className='delete'>
                                            <DeleteIcon onClick={(e)=>handleDeleteProduct(product._id)}/>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className='product-name'>{product.name}</div>
                                        <div className='size'>Size : {product.variantId.size}</div>
                                        <div className="color">Color: {product.variantId.color}</div>

                                    </div>
                                    <div>
                                    </div>
                                </div>
                                <div className="price">Price:  $ {product.price}</div>
                            </div> 
                        )
                    })
                }
                {cart.length >0 && 
                    <>
                     <div className='summary'>
                                <div className="left">  
                                    Total items : {cart.length}
                                </div>
                                <div className="right"> Total Price : $ {price.toFixed(2)}</div>
                            </div>
                            <div className='place-order'>
                    <button className="btn btn-primary" onClick={handleorder}>Place your Order</button>
                </div>
                    </>
                    }
            </div>
        </div>
    )
}

export default Cart
