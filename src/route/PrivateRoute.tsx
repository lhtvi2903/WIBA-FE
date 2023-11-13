import React from "react";
import { Outlet, Navigate } from "react-router-dom";
// import  { useSelector } from 'react-redux'
// import { RootState } from "../components/reducers/store";
import UnauthorizedPage from "./UnathourizedPage";


const PrivateRoute = () => {
  const storedRole = localStorage.getItem('role');
  const role: boolean = storedRole ? storedRole === 'true' : false;
  return (
    (role === true) ? <Outlet/> : <UnauthorizedPage/>
   )
}

export default PrivateRoute;