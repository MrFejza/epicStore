import React from 'react';
import FacebookLogo from '../assets/Facebook-Logosu.png'; // Replace with actual paths
import InstagramLogo from '../assets/InstagramLogo.png';
import TikTokLogo from '../assets/TIktokLogo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1: Social Media Links (visible on all views) */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold text-lg">Na Ndiqni</h3>
            <div className="flex justify-center md:justify-center space-x-6">
              <a href="https://www.facebook.com/EpicStoreAlbania?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                <img src={FacebookLogo} alt="Facebook" className="h-6 w-10" />
              </a>
              <a href="https://www.instagram.com/epic_store.al?igsh=MWVvOWFjNDRwb3NjcQ==" target="_blank" rel="noopener noreferrer">
                <img src={InstagramLogo} alt="Instagram" className="h-6 w-12" />
              </a>
              <a href="https://www.tiktok.com/@epic_store.al?_t=8q7hz7mPsGr&_r=1" target="_blank" rel="noopener noreferrer">
                <img src={TikTokLogo} alt="TikTok" className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold text-lg">Na Kontaktoni</h3>
            <p>📞 +355 68 368 7387</p>
            <p>✉️ epicstore2020.info@gmail.com</p>
            {/* No physical address since it's an online store */}
          </div>

          {/* Column 3: Footer Links */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <a href="/faq" className="hover:underline">Pyetje dhe Përgjigje</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms & Conditions</a>
          </div>
        </div>

        {/* Copyright and Developer Info */}
        <div className="mt-8 text-center md:text-left border-t border-gray-700 pt-4">
          <p className="text-sm">© {new Date().getFullYear()} Epic Store. All rights reserved.</p>
          <p className="text-sm">Developed by Ergis Fejza</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
