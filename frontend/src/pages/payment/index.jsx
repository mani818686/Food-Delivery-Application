import { useState } from 'react'
import "./index.css"
import postData from '../../http-post-service'

function Payment() {

    const [paymentMethod, setPaymentMethod] = useState('Debit Card')
    const [cardNumber, setcardNumber] = useState('')
    const [cardCode, setcardCode] = useState('')
    const [error,setError] = useState();


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

        try {
            const result = await postData('/', postData);
            console.log('POST request successful:', result);
          } catch (error) {
            console.error('Error during POST request:', error);
            setError('An error occurred during the POST request');

          }
    }
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
                <button className='btn' onClick={handlePayment}>Proceed to Pay </button>
            </div>
        </div>
    )
}

export default Payment
