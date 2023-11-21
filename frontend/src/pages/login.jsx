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
  const handleLogin = async () => {
    const response = await postData("/customer/login", JSON.stringify(userData))
    console.log(response)
    if (response.message == "Auth successful") {
      setuserData(defaultUser)
      dispatch(saveUser(response.userDetails))
      dispatch(setLoggedIn(true))
      dispatch(setAuthToken(response.token))
      dispatch(addAllproducts(response.userDetails.wishlist))
      localStorage.setItem("userLoggedIn", true);
      localStorage.setItem("authToken", response.token);
      navigate("/")
    }
    else {
      console.error(response)
      setuserData(defaultUser)
    }
  }

  return (
    <div className='login-container'>
      <h3 className='align'>Login</h3>

      <div className="form-group">
        <label htmlFor="email" className="head">Email</label>
        <input type="email" className="form-control-item" id="email" onChange={(e) => handleData('email', e)} />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="head">Password</label>
        <input type="password" className="form-control-item" id="password" onChange={(e) => handleData('password', e)} />
      </div>
      <button type="submit" className="btn" onClick={handleLogin}>Login</button>

    </div>

  )
}
