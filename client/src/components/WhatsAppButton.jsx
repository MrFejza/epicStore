import React, { useState, useEffect } from 'react';
import WhatsAppLogo from '../assets/WhatsAppLogo.png'; // Path to your WhatsApp logo image

const WhatsAppButton = ({ phoneNumber }) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover status
  const [isScrolling, setIsScrolling] = useState(false); // State to track scrolling status
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  // Function to handle hover
  const handleMouseEnter = () => {
    setIsHovered(true); // Set hovered to true when mouse enters
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Set hovered to false when mouse leaves
  };

  // Function to handle scroll
  const handleScroll = () => {
    setIsScrolling(true);
    // Clear the scrolling state after a short delay when scrolling stops
    setTimeout(() => {
      setIsScrolling(false);
    }, 500); // Adjust delay as needed
  };

  // Add scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up event listener
    };
  }, []);

  return (
    <div className={`fixed bottom-4 left-4 z-1 transition-opacity duration-300 ${isScrolling ? 'opacity-40' : 'opacity-100'}`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* WhatsApp Icon */}
        <img src={WhatsAppLogo} alt="WhatsApp" className="h-16 w-16" />

        {/* Conditionally render the message bubble based on hover */}
        {isHovered && (
          <div className="absolute bottom-1/2 left-16 transform translate-y-1/2 bg-white text-gray-900 text-sm py-2 px-4 rounded-lg shadow-lg border border-gray-200 z-1">
            <span>Përshëndetje, si mund t'ju ndihmojmë?</span>
            <div className="absolute left-0 bottom-0 transform -translate-x-2 translate-y-2 w-3 h-3 bg-white border-l border-b border-gray-200 rotate-45"></div>
          </div>
        )}
      </a>
    </div>
  );
};

export default WhatsAppButton;
