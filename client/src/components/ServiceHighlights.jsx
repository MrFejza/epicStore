import React from 'react';
import Return from '../assets/Return.png';
import Payment from '../assets/Pagesa.png';
import Delivery from '../assets/Delivery.png';

function ServiceHighlights() {
  return (
    <div className="relative">
      {/* Top Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-violet-200 to-violet-500 mb-2 
      "></div>

      {/* Main content with horizontal scroll on mobile */}
      <div className="flex md:flex-row flex-nowrap md:justify-between items-center py-8 max-w-[85%] mx-auto overflow-x-auto scrollbar-hide">
        <div className="flex flex-col items-center text-center px-4 min-w-[250px] mb-6 md:mb-0">
          <img src={Payment} alt="Secure Payment" className="max-w-28 h-auto mb-4" />
          <h3 className="text-lg font-semibold">Pagesa në Dorëzim</h3>
          <p className="text-sm text-gray-600">Për t'ju ofruar komoditet dhe siguri maksimale!</p>
        </div>
        <div className="flex flex-col items-center text-center px-4 min-w-[250px] mb-6 md:mb-0">
          <img src={Return} alt="Professional Support" className="max-w-28 h-auto mb-4" />
          <h3 className="text-lg font-semibold">Mundësi Kthimi</h3>
          <p className="text-sm text-gray-600">Keni mundësinë për të kthyer produktin brenda 2 javësh, <br /> nëse nuk jeni të kënaqur.</p>
        </div>
        <div className="flex flex-col items-center text-center px-4 min-w-[250px]">
          <img src={Delivery} alt="Fast Delivery" className="max-w-28 h-auto mb-4" />
          <h3 className="text-lg font-semibold">Dërgesa të Shpejta</h3>
          <p className="text-sm text-gray-600">Shërbim i shpejtë dhe i sigurt i dërgesës.</p>
        </div>
      </div>

      {/* Bottom Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-violet-500 to-violet-200 mt-2 mb-6"></div>
    </div>
  );
}

export default ServiceHighlights;