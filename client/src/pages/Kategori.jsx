import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Sale from '../assets/SaleTag.png';
import New from '../assets/TeRejat.png';
import Offers from '../assets/OfertaHero.png';
import SearchImage from '../assets/Search.png';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import ServiceHighlights from '../components/ServiceHighlights.jsx';
import ScrollToTopButton from '../components/ScrollToTopButton.jsx';
import OtherCategoryCarousel from '../components/OtherCategoryCarousel'; 
import Navigation from '../components/Navigation'; 
import Header from '../components/Header.jsx';

const Kategori = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9); // Default to 9
  const [expanded, setExpanded] = useState(false); 
  const [navHeight, setNavHeight] = useState('auto');
  const carouselRef = useRef(null); 
  const productSectionRef = useRef(null); // Ref to scroll to products section

  const query = new URLSearchParams(location.search).get('query') || '';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const categoryImages = {
    new: New,
    offers: Offers,
    search: SearchImage,
  };

  const displayImage = query ? SearchImage : categoryImages[category];

  // Dynamically adjust productsPerPage based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setProductsPerPage(8); // Fetch 8 products for mobile view
      } else {
        setProductsPerPage(9); // Fetch 9 products for larger screens
      }
    };

    handleResize(); // Set initial value based on current screen size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products based on category or query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        const allProducts = response.data;

        let filteredProducts = allProducts;

        if (query) {
          filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          );
        } else if (category === 'offers') {
          filteredProducts = allProducts.filter(product => product.onSale);
        } else if (category === 'new') {
          filteredProducts = allProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (category === 'all') {
          filteredProducts = allProducts.sort(() => 0.5 - Math.random());
        } else {
          filteredProducts = allProducts.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
          );
        }

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, query]);

  // Scroll to products section after ServiceHighlights when products change
  useEffect(() => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [products]); // Only scroll when products change

  useEffect(() => {
    if (carouselRef.current) {
      const carouselHeight = carouselRef.current.offsetHeight;
      setNavHeight(`${carouselHeight}px`);
    }
  }, [expanded, products]);

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
  
  const handleAddToCartClick = product => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmAddToCart = (product, quantity) => {
    updateCart(product, quantity);
    handleModalClose();
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
    <Header/>
     <div className="container mx-auto px-0 md:px-10 py-8 max-w-[90%]">
      {loading && <div className="mx-auto text-xl">Loading products...</div>}

      {/* Grid Layout for Navigation and Carousel */}
      <div className="grid grid-cols-11 gap-4">
        <Navigation expanded={expanded} setExpanded={setExpanded} navHeight={navHeight} />

        <div className="md:col-span-9 col-span-12" ref={carouselRef}>
          {displayImage ? (
            <div className="mb-8 text-center">
              <img
                src={displayImage}
                alt={query ? 'Search Results' : `Category: ${category}`}
                className="max-h-[500px] w-full max-w-[80%] mx-auto"
              />
            </div>
          ) : (
            <OtherCategoryCarousel currentCategory={category.toLocaleLowerCase()} />
          )}
        </div>
      </div>

      <div>
        <ServiceHighlights />
      </div>

      {/* Products Section with Ref */}
      <div ref={productSectionRef} className="grid  grid-cols-2 lg:grid-cols-3  gap-x-2 gap-y-8   max-w-[100%] md:max-w-[85%] py-2 mx-auto ">
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <div
              key={product._id}
              className="bg-white p-3 md:p-6 rounded-lg shadow-lg hover:shadow-xl md:mx-4 space-y-4 md:py-4 transition-shadow duration-300 relative flex flex-col justify-between h-full"
            >
              <Link to={`/information/${product._id}`}>
                {product.onSale && (
                  <img
                    src={Sale}
                    alt="Sale"
                    className="absolute md:top-[-10px] top-[0] right-0 h-20 w-20 md:h-36 md:w-36"
                  />
                )}
                <div className="md:h-64 h-24 overflow-hidden flex justify-center items-center mb-4">
                  <img
                    src={
                      product.image && product.image.length > 0
                        ? `http://localhost:9000/${product.image[0]}`
                        : 'default-image-path.jpg'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">{product.name}</h2>

                <p
                  className={`text-center md:mb-4 mb-1 font-bold ${
                    product.stock ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.stock ? 'Ka stok' : 'Nuk ka stok'}
                </p>

                <p className="text-center mb-2 text-gray-700">
                  <strong>Cmimi: </strong>
                  {product.onSale ? (
                    <>
                      <span className="line-through text-red-600 mr-2">
                        {`${product.price} Lek`}
                      </span>
                      <span className="text-green-600">{`${product.salePrice} Lek`}</span>
                    </>
                  ) : (
                    <span>{`${product.price} Lek`}</span>
                  )}
                </p>
              </Link>

              <div className="flex md:justify-center md:mt-4 mt-1  ">
                <button
                  onClick={() => handleAddToCartClick(product)}
                  className={`bg-violet-950 text-white font-bold py-2 px-6 rounded-md hover:bg-violet-800 transition-colors ${
                    !product.stock && 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!product.stock}
                >
                  Shto ne shporte
                </button>
              </div>

            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-xl font-bold text-gray-700 h-96 pt-32">
            Na vjen keq por nuk kemi produkte që përputhen me kërkimin tuaj.
          </p>
        )}
      </div>

      {products.length > 0 && (
        <div className="flex justify-center mt-8">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-violet-950 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-full mr-2"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>
          )}
          <span className="text-lg font-bold mx-2">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-violet-950 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-full ml-2"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onConfirm={handleConfirmAddToCart}
      />

      <WhatsAppButton phoneNumber="+355683687387" />
      <ScrollToTopButton />
    </div>
    </>
  );
};

export default Kategori;
