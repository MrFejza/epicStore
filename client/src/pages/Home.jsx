import React from 'react';
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
        <div className="col-span-2 lg:col-span-2 md:col-span-4 bg-violet-100 p-4 hidden sm:block">
          {/* Hidden on phone, visible on small screens and larger */}
          <ul className="space-y-5 text-center">
            <li>
              <Link to="/kategori/new" className="text-gray-800">Të Rejat</Link>
            </li>
            <li>
              <Link to="/kategori/offers" className="text-gray-800">Oferta</Link>
            </li>
            <li>
              <Link to="/kategori/electronics" className="text-gray-800">Elektrike</Link>
            </li>
            <li>
              <Link to="/kategori/clothing" className="text-gray-800">Rroba</Link>
            </li>
            <li>
              <Link to="/kategori/books" className="text-gray-800">Libra</Link>
            </li>
            <li>
              <Link to="/kategori/home" className="text-gray-800">Shtepi</Link>
            </li>
            <li>
              <Link to="/kategori/beauty" className="text-gray-800">Beauty</Link>
            </li>
            <li>
              <Link to="/kategori/sports" className="text-gray-800">Sport</Link>
            </li>
            <li>
              <Link to="/kategori/toys" className="text-gray-800">Lodra</Link>
            </li>
            <li>
              <Link to="/kategori/food" className="text-gray-800">Ushqim</Link>
            </li>
            <li>
              <Link to="/kategori/all" className="text-gray-800">Të Gjitha</Link>
            </li>
          </ul>
        </div>

        {/* Të Rejat, Oferta, and Carousels */}
        <div className="col-span-12 lg:col-span-10 md:col-span-8 pl-0 h-full">
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
    </div>
  );
};

export default Home;
