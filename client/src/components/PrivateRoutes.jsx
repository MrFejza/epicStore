import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const getToken = () => {
  return localStorage.getItem('jwt');
};

const PrivateRoutes = ({ adminOnly = false, userOnly = false }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // Use null to distinguish between "not checked" and "not admin"
  const [loading, setLoading] = useState(true);
  const hasToken = getToken();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!hasToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/check-admin`, {
          headers: { Authorization: `Bearer ${hasToken}` },
        });
        const data = await res.json();

       
        if (!res.ok) throw new Error(data.message || 'Failed to verify admin status');

        setIsAuth(true);
        setIsAdmin(data.isAdmin); // Set isAdmin based on API response
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAdminStatus();
  }, [hasToken]);

  

  if (loading) return <p>Loading...</p>;

  if (!isAuth) return <Navigate to="/sign-in" />;

  // For admin-only routes, only allow access if the user is an admin
  if (adminOnly && !isAdmin) return <Navigate to="/unauthorized" />;

  // For user-only routes, allow access to non-admins only
  if (userOnly && isAdmin) return <Navigate to="/menaxhimi-i-produkteve" />;

  return <Outlet />;
};

export default PrivateRoutes;
