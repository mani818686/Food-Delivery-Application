import React, { useState } from 'react';
import './login.css';

export default function Login() {
    const [userData,setuserData] = useState(
        {"email":"",
        "password":""
      });
    
      const handleData = (column,e)=>{
        setuserData((data)=>({
          ...data,
          [column]:e.target.value
        }))
      }
      const handleLogin= () =>{
        console.log(userData)
      }
    return (
        <div className='login-container'>
            <h3 className='align'>Login</h3>
            
            <div className="form-group">
                <label htmlFor="email" className="head">Email</label>
                <input type="email" className="form-control" id="email"  onChange={(e)=>handleData('email',e)} />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="head">Password</label>
                <input type="password" className="form-control" id="password" onChange={(e)=>handleData('password',e)}/>
            </div>
            <button type="submit" className="btn" onClick={handleLogin}>Login</button>
        
        </div>
        
    )
}
