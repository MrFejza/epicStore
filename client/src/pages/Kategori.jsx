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
import OtherCategoryCarousel from '../components/OtherCategoryCarousel'; // Import carousel
import Navigation from '../components/Navigation'; // Import Navigation component

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
  const productsPerPage = 9;
  const [expanded, setExpanded] = useState(false); // State for expanded navigation
  const [navHeight, setNavHeight] = useState('auto'); // State for navigation height
  const carouselRef = useRef(null); // Ref for the carousel

  const query = new URLSearchParams(location.search).get('query') || '';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const categoryImages = {
    new: New,
    offers: Offers,
    search: SearchImage,
  };

  const displayImage = query ? SearchImage : categoryImages[category];

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

  // Update navigation height based on the carousel height
  useEffect(() => {
    if (carouselRef.current) {
      const carouselHeight = carouselRef.current.offsetHeight;
      setNavHeight(`${carouselHeight}px`); // Set the navigation height to match the carousel
    }
  }, [expanded, products]); // Recalculate when expanded or products change

  const handleAddToCartClick = product => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmAddToCart = (product, quantity) => {
    updateCart(product, quantity);
    handleModalClose();
  };

  const editProduct = product => {
    navigate(`/edit/${product._id}`);
  };

  const deleteProduct = async product => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`/api/product/${product._id}`);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== product._id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="container mx-auto px-10 py-8 max-w-[90%]">
      {loading && <div className="mx-auto text-xl">Loading products...</div>}

      {/* Grid Layout for Navigation and Carousel */}
      <div className="grid grid-cols-11 gap-4">
        {/* Left Side Navigation */}
        <Navigation expanded={expanded} setExpanded={setExpanded} navHeight={navHeight} />

        {/* Right Side Carousel */}
        <div className="col-span-9" ref={carouselRef}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[85%] mx-auto">
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <div
              key={product._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Link to={`/information/${product._id}`}>
                {product.onSale && (
                  <img
                    src={Sale}
                    alt="Sale"
                    className="absolute top-0 right-0 h-36 w-36"
                  />
                )}
                <div className="h-64 overflow-hidden flex justify-center items-center mb-4">
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
                  className={`text-center mb-4 font-bold ${
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

              <div className="flex justify-center mt-4">
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

              {isAdmin && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => editProduct(product)}
                    className="bg-black text-white font-bold py-2 px-4 rounded-md mr-4 hover:bg-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
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
  );
};

export default Kategori;
