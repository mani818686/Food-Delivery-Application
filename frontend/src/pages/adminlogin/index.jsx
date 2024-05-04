import React, { useState } from 'react';
import './index.css';
import { useDispatch } from 'react-redux';
import { saveUser } from '../../userslice';
import { postData } from '../../http-post-service';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setLoggedIn, setisAdmin } from '../../loginSlice';
import { Navigate } from 'react-router-dom';

export default function AdminLogin() {
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
    const response = await postData("/admin/login", JSON.stringify(userData))
    console.log(response)
    if (response.message == "Auth successful") {
      setuserData(defaultUser)
      dispatch(saveUser(response.userDetails))
      dispatch(setLoggedIn(true))
      dispatch(setAuthToken(response.token))
      dispatch(setisAdmin(true))
      localStorage.setItem("userLoggedIn", true);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userType", 'admin');
      localStorage.setItem("name",response.userDetails.lastName + " "+ response.userDetails.firstName)
      navigate("/admin/dashboard")
    }
    else {
      console.error(response)
      setuserData(defaultUser)
    }
  }

  return (
    <div className="row justify-content-center mt-5">
    <div className="col-md-6">
      <div className="card mt-5">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Welcome Back! Admin</h2>
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
            <button type="submit" onClick={handleLogin} className="btn btn-primary btn-block">
              Log in
            </button>
        </div>
      </div>
    </div>
  </div>

  )
}
