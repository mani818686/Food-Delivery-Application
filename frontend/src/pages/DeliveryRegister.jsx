import React, { useState } from 'react'
import "./DeliveryRegister.css"
import {postData} from '../http-post-service';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const defaultUser = {"email":"",
  "firstName":"",
  "lastName":"",
  "password":"",
  "Confirmpassword":"",
  "phoneNumber":"",
  "street":"",
   "city":"",
  "state":"",
  "country":"",
   "pincode":""
}
  const [userData,setuserData] = useState(defaultUser);
  const navigate = useNavigate();

  const handleData = (column,e)=>{
    setuserData((data)=>({
      ...data,
      [column]:e.target.value
    }))
  }
  const handleDeliveryRegister = async() =>{
    console.log(userData)
      const response = await postData("/delivery/deliverysignup",JSON.stringify(userData))
      if(response.message == "delivery customer created"){
        setuserData(defaultUser)
        navigate("/login/delivery")
      }
      else{
        console.error(response)
        setuserData(defaultUser)
      }
  }
  return (
  <div class="container">
 <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Welcome Back! Delivery Driver</h2>
          <div class="form-group">
            <span class="details">First Name</span>
            <input type="text" className="form-control" placeholder="Enter your First name" onChange={(e)=>handleData('firstName',e)} required/>
          </div>
          <div class="form-group">
            <span class="details">Last name</span>
            <input type="text" className="form-control"placeholder="Enter your Last username" onChange={(e)=>handleData('lastName',e)} required/>
          </div>
          <div class="form-group">
            <span class="details">Email</span>
            <input type="email" className="form-control" placeholder="Enter your email" onChange={(e)=>handleData('email',e)} required/>
          </div>
          <div class="form-group">
            <span class="details">Password</span>
            <input type="password" className="form-control" placeholder="Enter your password" onChange={(e)=>handleData('password',e)} required/>
          </div>
          <div class="form-group">
            <span class="details">Confirm Password</span>
            <input type="password" className="form-control"placeholder="Confirm your password" onChange={(e)=>handleData('Confirmpassword',e)} required/>
          </div>
          <div class="form-group">
            <span class="details">Phone Number</span>
            <input type="tel" className="form-control" placeholder="Enter your number" onChange={(e)=>handleData('phoneNumber',e)} required/>
          </div>  
         <div class="form-group">
            <span class="details">Street</span>
            <input type="text" className="form-control" placeholder="Enter your street" onChange={(e)=>handleData('street',e)} required/>
          </div> 
          <div class="form-group">
            <span class="details">City</span>
            <input type="text" className="form-control" placeholder="Enter your City" onChange={(e)=>handleData('city',e)} required/>
          </div>      
          <div class="form-group">
            <span class="details">State</span>
            <input type="text" className="form-control" placeholder="Enter your State" onChange={(e)=>handleData('state',e)} required/>
          </div> 
          <div class="form-group">
            <span class="details">Country</span>
            <input type="text" className="form-control" placeholder="Enter your Country" onChange={(e)=>handleData('country',e)} required/>
          </div> 
          <div class="form-group">
            <span class="details">ZipCode</span>
            <input type="text"className="form-control"  placeholder="Enter your ZipCode" onChange={(e)=>handleData('pincode',e)} required/>
          </div>  
        </div>
        <button className="align-self-center form-control btn btn-primary btn-block" value="Register" onClick={handleDeliveryRegister}>Register</button>
    </div>
  </div> 
  </div>
  </div>
  )
}
