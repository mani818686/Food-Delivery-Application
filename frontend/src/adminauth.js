import React from "react";
import { Navigate } from "react-router-dom";

export const RequireAdminAuth = (props) => {
  
    const isAdmin = localStorage.getItem("isAdmin")
    console.log(isAdmin)

  if (isAdmin =='false') {
    return (
      <Navigate
        to="/"
        replace={true}
      />
    );
  }

  return props.children;
};
