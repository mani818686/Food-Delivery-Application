import { useState ,useEffect} from 'react'
import "./index.css"
import {getData, postData} from '../../http-post-service'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAuthToken, setLoggedIn } from '../../loginSlice'
import { saveUser } from '../../userslice'
import { addAllproducts, deleteAllProducts } from '../../cartslice'

function Payment( {handleOrderDetails}) {

    const [paymentMethod, setPaymentMethod] = useState('Debit Card')
    const [cardNumber, setcardNumber] = useState('')
    const [cardCode, setcardCode] = useState('')
    const [error,setError] = useState();
    const cart = Object.values(useSelector(state => state.cart.items));
    const selectedAddress = useSelector((state)=>state.user.user.selectedAddress)
    const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const token = localStorage.getItem("authToken")

    const totalPrice = useSelector((state)=>state.cart.price)

    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value)
    }
    const handleCardDetails = (e) => {
        setcardNumber(e.target.value)
    }
    const handleCardCode = (e) => {
        setcardCode(e.target.value)
    }

    const handlePayment = async () =>{
        const Items = Object.values(cart).map((product)=>({productId:product._id,quantity:product.quantity}))
        let orderData ={
            "price":totalPrice,
            "paymentMethod":paymentMethod,
            "paymentDetails":cardNumber+"-"+cardCode,
            "items":Items,
            "address":selectedAddress,
            "type":"Express Delivery"
        }
        try {
            const result = await postData('/customer/createOrder',JSON.stringify(orderData) );
            console.log('POST request successful:', result);
            if(result.message == "Order created successfully"){
                orderData.items = cart
                handleOrderDetails(result)
                dispatch(deleteAllProducts())
                navigate("/confirmation")
            }

          } catch (error) {
            console.error('Error during POST request:', error);
            setError('An error occurred during the POST request');

          }
    }

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


    if(error)
    return <p>{error}</p>
  
    return (
        <div className="payment-container">
            <div className="payment-header">
                <div className="title">
                    Payment Options
                </div>
            </div>
            <div className="payment mt-3">
                <label>Choose your type of Payment</label>
                <select class="form-select" onChange={handlePaymentMethod} value={paymentMethod}>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Credit Card">Credit Card</option>
                </select>
            </div>
            <div className="payment-details mb-5 mt-3">
                <h5>Enter your {paymentMethod} Details</h5>
                <div className='card-details'>
                    <div class="mb-3 row">
                        <div class="col-5 flex-column">
                            <label htmlFor="cardNumber"> Card Number</label>
                            <input type="text" class="form-control" id="cardNumber" maxLength={13} minLength={10} value={cardNumber} pattern="[0-9]+" onChange={handleCardDetails} />
                        </div>
                        <div class="col-5 flex-column">
                        <label htmlFor="code">Security Code</label>
                        <input type="text" class="form-control" id="code" value={cardCode} maxLength={3} minLength={3} pattern="[0-9]+" onChange={handleCardCode} />
                    </div>
                    </div>
                   
                </div>
            </div>
            <div>
                <button className='btn' onClick={handlePayment}>Proceed to Pay ${totalPrice.toFixed(2)}</button>
            </div>
        </div>
    )
}

export default Payment
