import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const OtherCategoryCarousel = ({ currentCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        const allProducts = response.data;

        const otherCategoryProducts = allProducts.filter(
          product => product.category.toLowerCase() !== currentCategory.toLowerCase()
        );

        const groupedByCategory = otherCategoryProducts.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = product;
          }
          return acc;
        }, {});

        const selectedProducts = Object.values(groupedByCategory);
        setProducts(selectedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  if (loading) return <div>Loading carousel...</div>;

  return (
    <div className="carousel-container" style={{ maxWidth: '50%', margin: '0 auto' }}>
      {products.length > 0 ? (
        <Slider {...carouselSettings}>
          {products.map((product, index) => (
            <div key={index} className="carousel-item relative">
              <div
                className="carousel-image-wrapper relative"
                style={{
                  paddingBottom: '66.67%', // Maintain a 3:2 aspect ratio
                  position: 'relative',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={`http://localhost:9000/${product.image[0]}`}
                  alt={product.name}
                  className="d-block w-100"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />

                {/* Shiko më shumë button */}
                <Link
                  to={`/kategori/${product.category.toLowerCase()}`} // Link to the category
                  className="absolute bottom-4 left-4 bg-white text-violet-900 font-bold py-2 px-4 rounded-lg hover:bg-violet-800 hover:text-white transition-colors"
                >
                  Shiko më shumë
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div>No products available for the carousel.</div>
      )}
    </div>
  );
};

export default OtherCategoryCarousel;
