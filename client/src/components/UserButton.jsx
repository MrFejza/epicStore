import React from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../assets/user.png';

function UserButton() {
  const navigate = useNavigate();

  // Check authentication and admin status
  const isAuth = localStorage.getItem('isAuth') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleButtonClick = () => {
    if (!isAuth) {
      // Navigate to sign-in if user is not authenticated
      navigate('/sign-in');
    } else if (isAdmin) {
      // Navigate to admin page if user is authenticated and an admin
      navigate('/menaxhimi-i-produkteve');
    } else {
      // Navigate to user account page if authenticated but not an admin
      navigate('/llogaria-ime');
    }
  };

  return (
    <button onClick={handleButtonClick} className="flex items-center space-x-2">
      <img src={User} alt="User Icon" className="w-7 h-7" />
      <span className="text-gray-700 hidden md:block">Llogaria ime</span>
    </button>
  );
}

export default UserButton;
