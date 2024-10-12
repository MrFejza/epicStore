import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LodraImage from '../assets/Lodra.png';
import SportImage from '../assets/Sport.png';
import ShtepiaImage from '../assets/Shtepi.png';
import ElektronikaImage from '../assets/Elektronike.png';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import ServiceHighlights from '../components/ServiceHighlights.jsx';
import ScrollToTopButton from '../components/ScrollToTopButton.jsx';

const Carousel = ({ images, rtl = false }) => {
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: rtl, // Enable right-to-left mode for reverse sliding on the right carousel
  };

  return (
    <Slider {...carouselSettings} className="w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div key={index} className="h-full overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </Slider>
  );
};

const Home = () => {
  const [expanded, setExpanded] = useState(false);
  const [navHeight, setNavHeight] = useState('auto'); // State to store the dynamic height of the navigation
  const carouselRef = useRef(null); // Ref to track the carousel height

  // Inject custom CSS for hiding scrollbars dynamically
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }


    `;
    document.head.appendChild(styleTag);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Set the height of the navigation based on the height of the carousel
  useEffect(() => {
    if (carouselRef.current) {
      const carouselHeight = carouselRef.current.offsetHeight;
      setNavHeight(`${carouselHeight}px`); // Set the navigation height to match the carousel
    }
  }, [expanded]); // Run the effect when 'expanded' changes

  // Assign images directly to each carousel
  const firstCarouselImages = [
    { src: LodraImage, alt: 'Lodra' },
    { src: SportImage, alt: 'Sport' }
  ];

  const secondCarouselImages = [
    { src: ShtepiaImage, alt: 'Shtepi' },
    { src: ElektronikaImage, alt: 'Elektronika' }
  ];

  // Combine images for mobile view (one carousel)
  const combinedImages = [...firstCarouselImages, ...secondCarouselImages];

  return (
    <div className="container lg:max-w-[80%] mx-auto py-4">
      {/* Grid layout with 2-5 column ratio */}
      <div className="grid grid-cols-12 gap-4">
        {/* Kategoritë section - 2/12 portion */}
        <div
          className={`col-span-2 lg:col-span-2 md:col-span-4 bg-violet-100 p-4 hidden sm:block hide-scrollbar`}
          style={{ height: expanded ? navHeight : 'auto', overflowY: expanded ? 'auto' : 'hidden' }}
        >
          {/* Hidden on phone, visible on small screens and larger */}
          <ul className="space-y-5 text-center overflow-auto hide-scrollbar">
  <li className="relative group">
    <Link to="/kategori/new" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Të Rejat</Link>
  </li>
  <li className="relative group">
    <Link to="/kategori/offers" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Oferta</Link>
  </li>
  <li className="relative group">
    <Link to="/kategori/ProduktePerFemije" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Produkte për Fëmijë</Link>
  </li>
  <li className="relative group">
    <Link to="/kategori/ElektronikeAksesore" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Elektronikë dhe Aksesorë</Link>
  </li>
  <li className="relative group">
    <Link to="/kategori/ShtepiJetese" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Shtëpi dhe Jetesë</Link>
  </li>
  <li className="relative group">
    <Link to="/kategori/ZyreTeknologji" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Zyrë dhe Teknologji</Link>
  </li>
  <li className="relative group">
    <Link to="/kategori/SportAktivitet" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Sport dhe Aktivitete</Link>
  </li>
  {expanded && (
    <>
      <li className="relative group">
        <Link to="/kategori/KuzhineUshqim" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Kuzhinë dhe Ushqim</Link>
      </li>
      <li className="relative group">
        <Link to="/kategori/FestaEvente" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Festa dhe Evente</Link>
      </li>
      <li className="relative group">
        <Link to="/kategori/Motorra" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Motorra</Link>
      </li>
      <li className="relative group">
        <Link to="/kategori/Kafshe" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Kafshë</Link>
      </li>
      <li className="relative group">
        <Link to="/kategori/all" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Të Gjitha</Link>
      </li>
    </>
  )}
  <li>
    <button
      onClick={() => setExpanded(!expanded)}
      className="text-violet-600 hover:text-violet-800"
    >
      {expanded ? 'Shfaq më pak' : 'Shfaq më shumë'}
    </button>
  </li>
</ul>

        </div>

        {/* Të Rejat, Oferta, and Carousels */}
        <div className="col-span-12 lg:col-span-10 md:col-span-8 pl-0 h-full" ref={carouselRef}>
          {/* Two carousels for laptop and desktop (lg and above) */}
          <div className="hidden lg:flex space-x-4 h-full">
            {/* Left Carousel */}
            <div className="w-1/2 h-full overflow-hidden">
              <Carousel images={firstCarouselImages} rtl={true} />
            </div>

            {/* Right Carousel - Reverse Sliding */}
            <div className="w-1/2 h-full overflow-hidden">
              <Carousel images={secondCarouselImages} rtl={false} />
            </div>
          </div>

          {/* One combined carousel for mobile and tablet (less than lg) */}
          <div className="lg:hidden w-full flex justify-center mx-auto h-full overflow-hidden">
            <Carousel images={combinedImages} rtl={false} />
          </div>
        </div>
      </div>

      {/* Service Highlights */}
      <div className="w-full md:mt-16 mt-8">
        <ServiceHighlights />
      </div>

      {/* WhatsApp Button that stays on the bottom-right corner */}
      <WhatsAppButton phoneNumber="+355683687387" />
      <ScrollToTopButton />
    </div>

    
  );
};

export default Home;
