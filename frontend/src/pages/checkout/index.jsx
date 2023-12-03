import { useSelector,useDispatch } from "react-redux"
import "./index.css"
import { useState, useEffect } from "react"
import {postData} from "../../http-post-service"
import { addUserAddress, saveSelectedAddress } from "../../userslice"
import { useNavigate } from "react-router-dom"
import { getData } from '../../http-post-service';
import { saveUser } from '../../userslice';
import { setAuthToken, setLoggedIn } from '../../loginSlice';

function Checkout() {

    const defaultAddress = {
        "street": "",
        "city": "",
        "state": "",
        "country": "",
        "pincode": ""
  }
    const [address, setAddress] = useState(defaultAddress)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const userAddreses  = useSelector(state => state.user.user.address)

    const [showAddress, setshowAddress] = useState(false)

    const [selectedAddressIndex,setDeliverAddressIndex] = useState(0)
    const token = localStorage.getItem("authToken")
    const isLoggedIn = useSelector((state) => state.login.details.isLoggedIn);

    const handleAddress =(column,value)=>{
        setAddress((data)=>({
            ...data,
            [column]:value
          }))
    }
    
    const handleaddAddress = async() =>{
        dispatch(addUserAddress(address))
        const response = await postData("/customer/add-address",JSON.stringify(address))
        setAddress(defaultAddress)
        console.log(response)
        
    }
    const handleOrder = () =>{
        dispatch(saveSelectedAddress(userAddreses[selectedAddressIndex]))
        navigate("/payment")
    }
   const handleOptionChange = (e) =>{
    setDeliverAddressIndex(e.target.value)

   }

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


    return (
        <div className="checkout-container">
            <div className="address-header">
                <div className="title">
                    Delivery Address
                </div>
            </div>
            <div className="address-content">
                {userAddreses && userAddreses?.map((address,index)=>{
                    return(
                        <div class="form-check">
                    <input class="form-check-input" type="radio" name="address" className="address1" value={index} onChange={handleOptionChange} checked={index == selectedAddressIndex }/>
                    <label class="form-check-label label1" for="address1">
                       <div className="addressContent">
                        {address.street} Street, {address.city}, {address.state}, {address.country}, {address.pincode}
                       </div>
                    </label>
                    </div> 
                    )
                })  
                }
            </div>
            <button className="btn" onClick={handleOrder}>Deliver Here</button>
            <div className="add-address">
                {!showAddress && <div className="add-button">
                    <button className="btn btn-light" onClick={() => setshowAddress((p) => !p)}>Add Address</button>
                </div>}
                {showAddress &&
                    <>
                              <h5  className="mt-3 p-3" style={{backgroundColor:"white"}}>Enter Delivery Address </h5>
                        <div className="input-address mt-5 ">
                            <div className="form-group">
                            <label htmlFor="Street" className="head">Street</label>
                            <input type="text" className="form-control" id="size" value={address.street} onChange={(e)=>handleAddress("street",e.target.value)}/>
                            </div>
                            <div className="form-group">
                            <label htmlFor="City" className="head">City</label>
                            <input type="text" className="form-control" id="City" value={address.city} onChange={(e)=>handleAddress("city",e.target.value)}/>
                            </div>    
                            <div className="form-group">
                            <label htmlFor="State" className="head">State</label>
                            <input type="text" className="form-control" id="State" value={address.state} onChange={(e)=>handleAddress("state",e.target.value)}/>
                            </div>    
                            <div className="form-group">
                            <label htmlFor="Country" className="head">Country</label>
                            <input type="text" className="form-control" id="Country" value={address.country} onChange={(e)=>handleAddress("country",e.target.value)}/>
                            </div>            
                            <div className="form-group">
                            <label htmlFor="PinCode" className="head">PinCode</label>
                            <input type="text" className="form-control" id="PinCode" value={address.pincode} onChange={(e)=>handleAddress("pincode",e.target.value)}/>
                            </div>
                           
                        </div>
                        <div>
                         <button className="btn btn-light btn1" onClick={handleaddAddress}>Add Address</button>
                         </div> 
                    </>
                }

            </div>
        </div>
    )
}

export default Checkout
