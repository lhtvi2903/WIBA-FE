import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import  { useSelector } from 'react-redux'
import { RootState } from "../components/reducers/store";

const ProtectedRoute  = () => {
  const token = localStorage.getItem('access_token');
  return (
      (token !== null) ? <Outlet/> : <Navigate to = "/login"/>
  );
}

export default ProtectedRoute;