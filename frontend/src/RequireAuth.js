import React from "react";
import { Navigate } from "react-router-dom";

export const RequireUserAuth = (props) => {
  
    const token = localStorage.getItem("token")
    const userLoggedIn = localStorage.getItem("userLoggedIn")

  if (!token || userLoggedIn =='false') {
    return (
      <Navigate
        to="/"
        replace={true}
      />
    );
  }

  return props.children;
};
