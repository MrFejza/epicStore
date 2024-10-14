import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OfferSection = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('/api/product?onSale=true');
        const allProducts = response.data;

        // Filter products with saleEndDate
        const productsWithTimers = allProducts.filter(product => product.saleEndDate);

        // Filter by tokens in localStorage or active sales
        const productsWithTokens = productsWithTimers.filter(product => {
          const saleEndDate = new Date(product.saleEndDate);
          const now = new Date();
          
          if (now > saleEndDate) {
            // Product sale has expired, check for token in localStorage
            const token = localStorage.getItem(`expired-${product._id}`);
            if (token) {
              const expirationTime = new Date(token);
              // Keep product visible if token is valid (within 3 hours)
              if (now < expirationTime) {
                return true; // Keep the expired product visible
              } else {
                // Remove token if 3 hours have passed
                localStorage.removeItem(`expired-${product._id}`);
                return false;
              }
            } else {
              // Set a new token if the sale just expired
              const expirationTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours later
              localStorage.setItem(`expired-${product._id}`, expirationTime.toISOString());
              return true; // Keep the product visible for now
            }
          }

          return true; // Keep visible if sale is still active
        });

        setOffers(productsWithTokens);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffers((prevOffers) =>
        prevOffers.map((offer) => {
          const now = new Date();
          const endDate = new Date(offer.saleEndDate);
          const expiredDuration = now - endDate;

          // Check if the sale has expired
          if (now > endDate && expiredDuration <= 3 * 60 * 60 * 1000) {
            const token = localStorage.getItem(`expired-${offer._id}`);
            if (!token) {
              // Set a token with an expiration time 3 hours from now
              const expirationTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
              localStorage.setItem(`expired-${offer._id}`, expirationTime);
            }
            return offer; // Keep product visible
          }

          // Remove products that passed the 3-hour window
          if (expiredDuration > 3 * 60 * 60 * 1000) {
            localStorage.removeItem(`expired-${offer._id}`); // Clear expired token
            return null; // Remove product from display
          }

          return offer; // If the offer is still active or within the 3-hour window
        }).filter(Boolean) // Filter out null values
      );
    }, 1000);

    return () => clearInterval(interval); // Clean up interval
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

  if (offers.length === 0) {
    return null; // Hide the section if there are no active or expired offers
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Ofertat që përfundojnë së shpejti</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.length > 0 ? (
          offers.map((offer) => {
            const timeLeft = calculateTimeLeft(offer.saleEndDate);

            return (
              <div key={offer._id} className="bg-white p-6 rounded-lg shadow-lg relative">
                <Link to={`/information/${offer._id}`}>
                  <div className="h-64 overflow-hidden flex justify-center items-center mb-4">
                    <img
                      src={`http://localhost:9000/${offer.image[0]}`}
                      alt={offer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center">{offer.name}</h3>
                  <p className="text-center text-gray-700 mb-2">
                    <span className="line-through text-red-600 mr-2">{offer.price} Lek</span>
                    <span className="text-green-600">{offer.salePrice} Lek</span>
                  </p>

                  {timeLeft.status === 'active' ? (
                    <p className="text-center text-red-500">
                      Përfundon për: {timeLeft.hours} orë, {timeLeft.minutes} minuta, {timeLeft.seconds} sekonda
                    </p>
                  ) : (
                    <p className="text-center text-orange-500">
                      Ka kaluar {timeLeft.hours} orë dhe {timeLeft.minutes} minuta që nga përfundimi i ofertës.
                    </p>
                  )}
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-center">Nuk ka oferta aktive për momentin.</p>
        )}
      </div>
    </div>
  );
};

export default OfferSection;
