import React, { useState } from 'react'
import "./register.css"

export default function Register() {
  const [userData,setuserData] = useState(
    {"email":"",
    "firstName":"",
    "lastName":"",
    "password":"",
    "Confirmpassword":"",
    "phone":"",
    "street":"",
    "city":"",
    "state":"",
    "country":"",
    "pin":""
  });

  const handleData = (column,e)=>{
    setuserData((data)=>({
      ...data,
      [column]:e.target.value
    }))
  }
  const handleRegister = () =>{
    console.log(userData)
  }
  return (
  <div class="container">
    <div class="title">Registration</div>
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
            <input type="tel" placeholder="Enter your number" onChange={(e)=>handleData('phone',e)} required/>
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
            <input type="text" placeholder="Enter your PinCode" onChange={(e)=>handleData('pin',e)} required/>
          </div> 
        </div>
        {/* <div class="gender-details">
          <input type="radio" name="gender" id="dot-1"/>
          <input type="radio" name="gender" id="dot-2"/>
          <input type="radio" name="gender" id="dot-3"/>
          <span class="gender-title">Gender</span>
          <div class="category">
            <label for="dot-1">
            <span class="dot one"></span>
            <span class="gender">Male</span>
          </label>
          <label for="dot-2">
            <span class="dot two"></span>
            <span class="gender">Female</span>
          </label>
          <label for="dot-3">
            <span class="dot three"></span>
            <span class="gender">Prefer not to say</span>
            </label>
          </div>
        </div> */}
        <div class="button">
          <input type="submit"  value="Register" onClick={handleRegister}/>
        </div>

    </div>
  </div>
     
      
  )
}
