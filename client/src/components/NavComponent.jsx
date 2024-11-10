import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const NavComponent = () => {
  const navigate = useNavigate();

  const isAuth = localStorage.getItem('isAuth');
  const isAdmin = localStorage.getItem('isAdmin');
  const token = localStorage.getItem('jwt');

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears all local storage
    navigate('/');
  };
  
  const LogoutButton = () => {
    if (token && !isTokenExpired(token)) {
      return (
        <>
        <div>
                   <button
          onClick={handleLogout}
          className="mx-4 text-red-600 font-medium hover:text-red-800"
        >
          Logout
        </button>  
        </div>

        </>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center bg-violet-50 py-4 shadow-md md:hidden">
      {/* Links */}
      <Link
        to="/kategori/offers"
        className="mx-4 text-gray-800 font-medium hover:text-violet-600"
      >
        Oferta
      </Link>
      <Link
        to="/kategori/new"
        className="mx-4 text-gray-800 font-medium hover:text-violet-600"
      >
        Të Rejat
      </Link>
      <Link
        to="/kategori/all"
        className="mx-4 text-gray-800 font-medium hover:text-violet-600"
      >
        Të Gjitha
      </Link>

      {/* Show Logout button if the user is authenticated */}
    

      <LogoutButton  />
    </div>
  );
};

export default NavComponent;
