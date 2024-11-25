import React from 'react';
import WhatsAppLogo from '../assets/WhatsAppLogo.png';
import InstagramLogo from '../assets/InstagramLogo.png';
import TikTokLogo from '../assets/TikTokLogo.png';
import FacebookLogo from '../assets/Facebook-Logosu.png';
import EmailLogo from '../assets/EmailLogo.png';
import Header from '../components/Header';
import MyMap from '../components/MyMap';

const Contact = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r  py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-semibold mb-6 text-gray-800">Jemi Gjithmonë Pranë Jush</h1>
          <p className="text-lg mb-8 text-gray-600">
            Na kontaktoni në çdo kohë, në mënyrën që ju përshtatet më mirë. Ne jemi këtu për t'ju ndihmuar!
          </p>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {/* WhatsApp */}
            <a
              href="https://wa.me/355683687387"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <img src={WhatsAppLogo} alt="WhatsApp" className="h-16 w-16" />
              <span className="mt-2 text-gray-800">WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/epic_store.al"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <img src={InstagramLogo} alt="Instagram" className="h-16 w-32" />
              <span className="mt-2 text-gray-800">Instagram</span>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@epic_store.al"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <img src={TikTokLogo} alt="TikTok" className="h-16 w-16" />
              <span className="mt-2 text-gray-800">TikTok</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/EpicStoreAlbania"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <img src={FacebookLogo} alt="Facebook" className="h-16 w-28" />
              <span className="mt-2 text-gray-800">Facebook</span>
            </a>

            {/* Email */}
            <a
              href="mailto:epicstore2020.info@gmail.com"
              className="flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-transform duration-300"
            >
              <img src={EmailLogo} alt="Email" className="h-16 w-16" />
              <span className="mt-2 text-gray-800">Email</span>
            </a>
          </div>
        </div>
        <div className='py-5 max-w-[95%] mx-auto'>
          <MyMap />
        </div>
        
      </div>
      
    </>
  );
};

export default Contact;
