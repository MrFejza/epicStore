import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '123456789'; // Replace with your WhatsApp phone number

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleClick}
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={30} />
      </button>
    </div>
  );
};

export default WhatsAppButton;
