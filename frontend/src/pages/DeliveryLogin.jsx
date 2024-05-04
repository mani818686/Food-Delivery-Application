import React, { useState } from 'react';
import './login.css';
import { useDispatch } from 'react-redux';
import { saveUser } from '../userslice';
import {postData} from '../http-post-service';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setLoggedIn, setisAdmin } from '../loginSlice';
import { addAllproducts } from '../cartslice';


export default function Login() {
  const navigate = useNavigate();
const dispatch = useDispatch();
const defaultUser = { "email": "", "password": "" }
 
  const [userData, setuserData] = useState(defaultUser);

  const handleData = (column, e) => {
    setuserData((data) => ({
      ...data,
      [column]: e.target.value
    }))
  }
  const handledeliveryLogin = async () => {
    const response = await postData("/delivery/deliverylogin", JSON.stringify(userData))
    if (response.message == "Delivery Auth successful") {
      setuserData(defaultUser)
      dispatch(saveUser(response.userDetails))
      dispatch(setLoggedIn(true))
      dispatch(setAuthToken(response.token))
      localStorage.setItem("userLoggedIn", true);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userType", 'Delivery');
      localStorage.setItem("name",response.userDetails.lastName + " "+ response.userDetails.firstName)
      navigate("/delivery/dashboard");
    }
    else {
      console.error(response)
      setuserData(defaultUser)
    }
  }
   
  

  return (
    <div className='login-container'>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Welcome Back! Delivery Driver</h2>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={(e) => handleData('email', e)} 
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    onChange={(e) => handleData('password', e)}
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" onClick={handledeliveryLogin} className="btn btn-primary btn-block">
                  Log in
                </button>
             
            </div>
          </div>
        </div>
      </div>

    </div>

  )
  }