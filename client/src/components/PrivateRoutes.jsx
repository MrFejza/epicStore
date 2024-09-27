import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// Utility function to get cookie value by name
const getToken = () => {
  return (localStorage.getItem('jwt') !== undefined)
};

const PrivateRoutes = ({ adminOnly }) => {
  const isAuth = localStorage.getItem('isAuth') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const hasToken = getToken();


  // If authenticated and has token or is not admin-only, allow access
  if (isAuth && hasToken) {
    if (adminOnly && !isAdmin) {
      console.log('Redirecting to /admin because user is not admin');
      return <Navigate to='/admin' />;
    }
    //console.log('Access granted, rendering Outlet');
    return <Outlet />;
  }

  // Redirect to /admin if not authenticated
  console.log('Redirecting to /admin because user is not authenticated');
  return <Navigate to='/admin' />;
};

export default PrivateRoutes;