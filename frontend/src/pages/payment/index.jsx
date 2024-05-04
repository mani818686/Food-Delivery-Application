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
    const [cardName, setcardName] = useState('')
    const [cardExpiry, setcardExpiry] = useState('')
    const [error,setError] = useState();
    const cart = Object.values(useSelector(state => state.cart.items));
    const selectedAddress = useSelector((state)=>state.user.selectedAddress)
    const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const token = localStorage.getItem("authToken")

    const deliveryType = useSelector((state)=>state.cart.deliveryType)

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
    const handleCardExpiry = (e) => {
        setcardExpiry(e.target.value)
    }
    const handleCardName = (e) => {
        setcardName(e.target.value)
    }

    const handlePayment = async () =>{
        const Items = Object.values(cart).map((product)=>({FoodItemId:product.product._id,quantity:product.quantity}))
        console.log(selectedAddress)
        let orderData ={
            "price":totalPrice,
            "paymentMethod":paymentMethod,
            "cardNumber":cardNumber,
            "securitycode":cardCode,
            "cardName":cardName,
            "expiryCode":cardExpiry,
            "items":Items,
            "address":selectedAddress,
            "orderType":deliveryType
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
            <div className="payment-header active">
                <div className="title">
                    Payment Options
                </div>
            </div>
            <div className="payment mt-3">
                <label class="header"><b>Choose your type of Payment</b></label>
                <select class="form-select" onChange={handlePaymentMethod} value={paymentMethod}>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Credit Card">Credit Card</option>
                </select>
            </div>
            <div className="payment-details mb-5 mt-3">
                <h5 class="align">Enter your {paymentMethod} Details</h5>
                <div className='card-details'>
                <div class="mb-3 row">
                        <div class="col-5 flex-column">
                            <label htmlFor="cardName"> Name on the Card</label>
                            <input type="text" class="form-control" id="cardName" value={cardName} onChange={handleCardName} />
                        </div>
                        <div class="col-5 flex-column">
                        <label htmlFor="code"> Card Number</label>
                        <input type="text" class="form-control" id="code" value={cardNumber} maxLength={19} minLength={16} pattern="[0-9]+" onChange={handleCardDetails} />
                    </div>
                    </div>
                    <div class="mb-3 row">
                        <div class="col-5 flex-column">
                            <label htmlFor="cardNumber">Expiry Date</label>
                            <input type="text" class="form-control" id="cardNumber" placeholder="MM/YY"  value={cardExpiry}  onChange={handleCardExpiry} />
                        </div>
                        <div class="col-5 flex-column">
                        <label htmlFor="codeN">Security Code</label>
                        <input type="text" class="form-control" id="codeN"  value={cardCode} maxLength={3} minLength={3} pattern="[0-9]+" onChange={handleCardCode} />
                    </div>
                    </div>
                    
                   
                </div>
            </div>
            <div>
                <button className='active' onClick={handlePayment}>Proceed to Pay ${totalPrice.toFixed(2)}</button>
            </div>
        </div>
    )
}

export default Payment
