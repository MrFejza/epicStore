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
import OfferSection from '../sections/OfferSection.jsx';
import Navigation from '../components/Navigation'; // Import the Navigation component
import ProduktePerFemijeSection from '../sections/ProduktePerFemijeSection.jsx';
import ProdukteTeNdryshmeSection from '../sections/ProdukteTeNdryshmeSection.jsx';
import Header from '../components/Header.jsx';
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
      {images?.map((image, index) => (
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
  const [navHeight, setNavHeight] = useState('auto');
  const carouselRef = useRef(null);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const carouselHeight = carouselRef.current.offsetHeight;
      setNavHeight(`${carouselHeight}px`);
    }
  }, [expanded]);

  const firstCarouselImages = [
    { src: LodraImage, alt: 'Lodra' },
    { src: SportImage, alt: 'Sport' }
  ];

  const secondCarouselImages = [
    { src: ShtepiaImage, alt: 'Shtepi' },
    { src: ElektronikaImage, alt: 'Elektronika' }
  ];

  const combinedImages = [...firstCarouselImages, ...secondCarouselImages];

  return (
    <>
    <Header />
    <div className="container lg:max-w-[80%] mx-auto py-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Kategoritë section */}
        <Navigation expanded={expanded} setExpanded={setExpanded} navHeight={navHeight} />

        <div className="col-span-12 lg:col-span-10 md:col-span-8 pl-0 h-full" ref={carouselRef}>
          <div className="hidden lg:flex space-x-4 h-full">
            <div className="w-1/2 h-full overflow-hidden">
              <Carousel images={firstCarouselImages} rtl={true} />
            </div>

            <div className="w-1/2 h-full overflow-hidden">
              <Carousel images={secondCarouselImages} rtl={false} />
            </div>
          </div>

          <div className="lg:hidden w-full flex justify-center mx-auto h-full overflow-hidden">
            <Carousel images={combinedImages} rtl={false} />
          </div>
        </div>
      </div>

      <div className="w-full md:mt-16 mt-8">
        <ServiceHighlights />
      </div>
      
      <div>
        <ProduktePerFemijeSection />
      </div>

      <div>
        <OfferSection /> 
      </div>

      <div>
        <ProdukteTeNdryshmeSection />
      </div>
      <WhatsAppButton phoneNumber="+355683687387" />
      <ScrollToTopButton />
    </div>
  

    </>
    );
};
export default Home;
