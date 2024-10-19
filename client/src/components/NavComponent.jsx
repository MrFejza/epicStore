import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavComponent = () => {
  const navigate = useNavigate();

  const isAuth = localStorage.getItem('isAuth');
  const isAdmin = localStorage.getItem('isAdmin');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('isAdmin');
    navigate('/'); // Redirect to home page
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
      {isAuth && isAdmin && (
        <button
          onClick={handleLogout}
          className="mx-4 text-red-600 font-medium hover:text-red-800"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default NavComponent;
