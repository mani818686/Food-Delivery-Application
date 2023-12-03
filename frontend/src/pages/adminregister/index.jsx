import React, { useState } from 'react'
import "./index.css"
import { postData } from '../../http-post-service';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
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
  const handleRegister = async() =>{
    console.log(userData)
      const response = await postData("/admin/signup",JSON.stringify(userData))
      if(response.message == "Admin created"){
        setuserData(defaultUser)
        navigate("/")
      }
      else{
        console.error(response)
        setuserData(defaultUser)
      }
  }
  return (
  <div class="container">
    <div class="title">Admin Registration</div>
    <div class="content">
        <div class="user-details">
          <div class="input-box">
            <span class="details">First Name</span>
            <input type="text" placeholder="Enter your First name" onChange={(e)=>handleData('firstName',e)} required/>
          </div>
          <div class="input-box">
            <span class="details">Last name</span>
            <input type="text" placeholder="Enter your Last username" onChange={(e)=>handleData('lastName',e)} required/>
          </div>
          <div class="input-box">
            <span class="details">Email</span>
            <input type="email" placeholder="Enter your email" onChange={(e)=>handleData('email',e)} required/>
          </div>
          <div class="input-box">
            <span class="details">Password</span>
            <input type="password" placeholder="Enter your password" onChange={(e)=>handleData('password',e)} required/>
          </div>
          <div class="input-box">
            <span class="details">Confirm Password</span>
            <input type="password" placeholder="Confirm your password" onChange={(e)=>handleData('Confirmpassword',e)} required/>
          </div>
          <div class="input-box">
            <span class="details">Phone Number</span>
            <input type="tel" placeholder="Enter your number" onChange={(e)=>handleData('phoneNumber',e)} required/>
          </div>  
          <div class="input-box">
            <span class="details">Street</span>
            <input type="text" placeholder="Enter your street" onChange={(e)=>handleData('street',e)} required/>
          </div> 
          <div class="input-box">
            <span class="details">City</span>
            <input type="text" placeholder="Enter your City" onChange={(e)=>handleData('city',e)} required/>
          </div>      
          <div class="input-box">
            <span class="details">State</span>
            <input type="text" placeholder="Enter your State" onChange={(e)=>handleData('state',e)} required/>
          </div> 
          <div class="input-box">
            <span class="details">Country</span>
            <input type="text" placeholder="Enter your Country" onChange={(e)=>handleData('country',e)} required/>
          </div> 
          <div class="input-box">
            <span class="details">PinCode</span>
            <input type="text" placeholder="Enter your PinCode" onChange={(e)=>handleData('pincode',e)} required/>
          </div> 
        </div>
        <div class="button">
          <input type="submit"  value="Register" onClick={handleRegister}/>
        </div>

    </div>
  </div>
     
      
  )
}
