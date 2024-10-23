import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// Utility function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('jwt');
};

const PrivateRoutes = ({ adminOnly, userOnly }) => {
  const isAuth = localStorage.getItem('isAuth') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const hasToken = getToken();

  if (isAuth && hasToken) {
    if (adminOnly && !isAdmin) {
      console.log('Redirecting to /unauthorized because user is not admin');
      return <Navigate to='/unauthorized' />;
    }
    if (userOnly && isAdmin) {
      console.log('Redirecting to /unauthorized because user is admin');
      return <Navigate to='/unauthorized' />;
    }
    // If the user meets the required conditions, render the protected route
    return <Outlet />;
  }

  // If not authenticated, redirect to sign-in
  console.log("Redirecting to /sign-in because user is not authenticated");
  return <Navigate to='/sign-in' />;
};

export default PrivateRoutes;
