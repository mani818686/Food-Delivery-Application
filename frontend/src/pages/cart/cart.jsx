import { useSelector, useDispatch } from 'react-redux'
import { addProduct,deleteProduct } from '../../cartslice'


const Cart = () => {

    const cart = Object.values(useSelector(state=>state.cart.items))
    console.log(cart)

  return (
    <div className='cart-container'>
      <div className="cart-items">
        <ul>
        {
            cart.map((product)=>{
                return(<li>{product.name}</li>)
            })
        }
        </ul>
      </div>
    </div>
  )
}

export default Cart
