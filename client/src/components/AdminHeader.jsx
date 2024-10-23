import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EpicStoreLogo from '../assets/EpicStoreLogo.png';

const Header = () => {
  const navigate = useNavigate();

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('isAdmin');
    navigate('/');  // Redirect to home or login page after logout
  };

  // Checking if the user is authenticated
  const isAuth = localStorage.getItem('isAuth');
  const isAdmin = localStorage.getItem('isAdmin');

  return (
    <header className="text-gray-800 bg-white py-4 px-8 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/">
          <img src={EpicStoreLogo} alt="Logo" className="h-20 w-auto" /> {/* Adjust the path to your logo */}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-8">
        <Link to="/menaxhimi-i-produkteve" className="hover:text-gray-400">Produktet</Link>
        <Link to="/menaxhimi-i-kategorive" className="hover:text-gray-400">Kategoritë</Link>
        <Link to="/orders" className="hover:text-gray-400">Porositë</Link>
      </nav>

      {/* Logout Button */}
      {isAuth && isAdmin && (
        <button
          onClick={handleLogout}
          className="bg-violet-600 px-4 py-2 rounded-md hover:bg-violet-700 text-white transition-colors"
        >
          Logout
        </button>
      )}
    </header>
    
  );
};

export default Header;
