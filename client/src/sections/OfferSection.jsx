import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Background from '../assets/OfertaBg.png';

const OfferSection = () => {
  const [offers, setOffers] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Detect screen width to adjust offers displayed based on screen size
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('/api/product?onSale=true');
        const allProducts = response.data;

        // Sort products by remaining sale time
        const sortedOffers = allProducts
          .filter(product => product.saleEndDate)
          .sort((a, b) => new Date(a.saleEndDate) - new Date(b.saleEndDate));

        setOffers(sortedOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  const calculateTimeLeft = (saleEndDate) => {
    const now = new Date();
    const endDate = new Date(saleEndDate);
    const difference = endDate - now;

    if (difference > 0) {
      return {
        status: 'active',
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      const expiredDuration = now - endDate;
      const hours = Math.floor(expiredDuration / (1000 * 60 * 60));
      const minutes = Math.floor((expiredDuration / (1000 * 60)) % 60);

      return {
        status: 'expired',
        hours,
        minutes,
      };
    }
  };

  // Only display 3 cards if the screen is smaller than 768px (mobile view)
  const isMobile = windowWidth < 768;
  const offersToShow = isMobile ? offers.slice(0, 3) : offers.slice(0, 6);

  if (offers.length === 0) {
    return null; // Hide the section if no offers
  }

  return (
    <div className="container mx-auto py-8 bg-cover bg-center" style={{ backgroundImage: `url(${Background})` }}>
      
      {/* First Div: "Kapni Oferten" and Button */}
      <div className="w-full text-left mb-8 mt-16 ml-5 md:ml-20 flex flex-col items-start">
        <h1 className="text-3xl md:text-5xl text-gray-800 font-bold">Kapni Ofertën</h1>
        <Link to="/kategori/offers" className="mt-4 bg-violet-800 hover:bg-violet-500 text-white px-4 py-2 rounded">
          Shiko më shumë
        </Link>
      </div>

      {/* Second Div: Responsive offer cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-10">
        {/* Display 3 cards for mobile, and 6 cards for larger screens */}
        {offersToShow.map((offer) => {
          const timeLeft = calculateTimeLeft(offer.saleEndDate);
          return (
            <div key={offer._id} className="bg-white p-4 shadow-lg w-full h-72">
              <Link to={`/information/${offer._id}`}>
                <div className="h-36 xl:h-48 mb-2">
                  <img
                    src={`http://localhost:9000/${offer.image[0]}`}
                    alt={offer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-md font-bold">{offer.name}</h4>
                <p className="text-sm">
                  <span className="line-through text-red-500">{offer.price} Lek</span>
                  <span className="text-green-600 ml-2">{offer.salePrice} Lek</span>
                </p>
                {timeLeft.status === 'active' ? (
                  <p className="text-red-500 text-sm">Përfundon për: {timeLeft.hours} orë, {timeLeft.minutes} min</p>
                ) : (
                  <p className="text-orange-500 text-sm">Ka kaluar {timeLeft.hours} orë</p>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferSection;
