import "./index.css"
import { useState } from "react"
function Checkout() {

    const [address, setAddress] = useState({
        "street": "",
        "city": "",
        "pincode": "",
        "state": "",
        "country": ""
    })
    const [showAddress, setshowAddress] = useState(false)

    return (
        <div className="checkout-container">
            <div className="address-header">
                <div className="title">
                    Delivery Address
                </div>
            </div>
            <div className="address-content">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="address" id="address1"/>
                    <label class="form-check-label label1" for="address1">
                       <div className="addressContent">
                       <b>Shekhar Balagoni</b>  <p>Contact: 9132385578</p>  
                       8-7-89, Plot No-93
                       Chaitanya Nagar BNREDDY, Road No 4
                       Padma Nilayam, 2nd Floor, BN Reddy Nagar,
                       Hyderabad, Telangana - 500079         
                       </div>
                    </label>
                </div>

                <div class="form-check ">
                    <input class="form-check-input" type="radio" name="address" id="address2" checked />
                    <label class="form-check-label label1" for="address1">
                       <div className="addressContent">
                       <b>Manideep</b>  <p>Contact: 9132385590</p>  
                       8-7-89, Plot No-93
                       Chaitanya Nagar BNREDDY, Road No 4
                       Padma Nilayam, 2nd Floor, BN Reddy Nagar,
                       Hyderabad, Telangana - 500079         
                       </div>
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="radio" name="address" id="address3" />
                   <label class="form-check-label label1" for="address1">
                       <div className="addressContent">
                       <b>Sai Surya</b>  
                       <p>Contact: 9132385576</p>  
                       8-7-89, Plot No-93
                       Chaitanya Nagar BNREDDY, Road No 4
                       Padma Nilayam, 2nd Floor, BN Reddy Nagar,
                       Hyderabad, Telangana - 500079         
                       </div>
                    </label>
                </div>
            </div>
            <div className="add-address">
                {!showAddress && <div className="add-button">
                    <button className="btn btn-light" onClick={() => setshowAddress((p) => !p)}>Add Address</button>
                </div>}
                {showAddress &&
                    <>
                        <div className="input-address mt-5 ">
                            <div className="form-group">
                            <label htmlFor="Street" className="head">Street</label>
                            <input type="text" className="form-control" id="size"/>
                            </div>
                            <div className="form-group">
                            <label htmlFor="City" className="head">City</label>
                            <input type="text" className="form-control" id="City"/>
                            </div>    
                            <div className="form-group">
                            <label htmlFor="State" className="head">State</label>
                            <input type="text" className="form-control" id="State"/>
                            </div>    
                            <div className="form-group">
                            <label htmlFor="Country" className="head">Country</label>
                            <input type="text" className="form-control" id="Country"/>
                            </div>            
                            <div className="form-group">
                            <label htmlFor="PinCode" className="head">PinCode</label>
                            <input type="text" className="form-control" id="PinCode"/>
                            </div>
                           
                        </div>
                        <div>
                         <button className="btn1">Add Address</button>
                         </div> 
                    </>
                }

            </div>
        </div>
    )
}

export default Checkout
