import React, { useState } from 'react';
import WhatsAppLogo from '../assets/WhatsAppLogo.png'; // Path to your WhatsApp logo image

const WhatsAppButton = ({ phoneNumber }) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover status
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  // Function to handle hover
  const handleMouseEnter = () => {
    setIsHovered(true); // Set hovered to true when mouse enters
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Set hovered to false when mouse leaves
  };

  return (
    <div className="fixed bottom-4 right-4 z-1">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* WhatsApp Icon */}
        <img src={WhatsAppLogo} alt="WhatsApp" className="h-12 w-12" />

        {/* Conditionally render the message bubble based on hover */}
        {isHovered && (
          <div className="absolute bottom-1/2 right-16 transform translate-y-1/2 bg-white text-gray-900 text-sm py-2 px-4 rounded-lg shadow-lg border border-gray-200 z-1">
            <span>Përshëndetje, si mund t'ju ndihmojmë?</span>
            <div className="absolute right-0 bottom-0 transform translate-x-2 translate-y-2 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"></div>
          </div>
        )}
      </a>
    </div>
  );
};

export default WhatsAppButton;
