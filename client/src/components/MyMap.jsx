import React, { useState } from 'react';
import { Map, Marker } from 'pigeon-maps';

const MyMap = () => {
  // Location coordinates
  const location = [ 41.37188, 19.77858]; // Example: Tirana, Albania

  // State to handle card visibility
  const [showCard, setShowCard] = useState(false);

  // Google Maps link for the location
  const googleMapsLink = `https://www.google.com/maps/place/Epic_store.al/@41.3718717,19.7760116,691m/data=!3m2!1e3!4b1!4m6!3m5!1s0x1350331f3acd375b:0x2a56c0b12ad74ab5!8m2!3d41.3718717!4d19.7785919!16s%2Fg%2F11wqykd17y?entry=ttu&g_ep=EgoyMDI0MTExOS4yIKXMDSoASAFQAw%3D%3D`;

  return (
    <section style={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* Pigeon Map */}
      <Map height={400} defaultCenter={location} defaultZoom={14}>
        {/* Marker */}
        <Marker
          anchor={location}
          width={50}
          onClick={() => setShowCard(true)} // Show card on marker click
        />
      </Map>

      {/* Card Displayed on Marker Click */}
      {showCard && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <h3 style={{ margin: 0 }}>Epic Store</h3>
          <p>Shiko rrugën për tek Epic Store</p>
          <button
            style={{
              marginTop: '10px',
              padding: '10px 15px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => window.open(googleMapsLink, '_blank')} // Open Google Maps
          >
            Trego Rrugën
          </button>
          <button
            style={{
              marginLeft: '10px',
              padding: '10px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => setShowCard(false)} // Close the card
          >
            Mbyll
          </button>
        </div>
      )}
    </section>
  );
};

export default MyMap;
