import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css'; 
import Meta from '../components/Meta';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { useCart } from '../context/CartContext';
import RelatedProducts from '../components/RelatedProducts.jsx';
import ProductModal from '../components/ProductModal'; // Import ProductModal
import Sale from '../assets/SaleTag.png'; // SaleTag image
import ScrollToTopButton from '../components/ScrollToTopButton.jsx';

const Information = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [product, setProduct] = useState(null); // State for holding product data
  const [isFullscreen, setIsFullscreen] = useState(false); // For fullscreen image viewing
  const { updateCart } = useCart(); // Cart context for adding products to the cart
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // State for modal product
  const [activeIndex, setActiveIndex] = useState(0); // State for active carousel slide

  // Fetch product data by its ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${_id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [_id]);

  // Toggle fullscreen for images
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Open the product modal when the "Shto në Shportë" button is clicked
  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close the modal and reset selected product
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle confirming the product addition to the cart from the modal
  const handleConfirmAddToCart = (product, quantity) => {
    const productToAdd = {
      _id: product._id, // Only include the necessary properties
      name: product.name,
      price: product.onSale && product.salePrice ? product.salePrice : product.price, // Use sale price if applicable
    };
    updateCart(productToAdd, quantity); // Pass only sanitized product data to the cart
    handleModalClose();
  };
  
  // Navigate back
  const goBack = () => {
    navigate(-1);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Meta title={`${product.name || "Product Information"} - Epic Store`} />
      <div className="container mx-auto mt-5 p-6 max-w-[90%]">
        <h1 className="text-4xl font-bold mb-4 text-center">{product.name}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/5">
            <div
              id="carouselExampleControlsNoTouching"
              className="carousel slide"
              data-bs-touch="false"
              style={{ overflow: 'hidden' }}
            >
              <div className="carousel-inner">
                {product.image && product.image.length > 0 ? (
                  product.image.map((img, index) => (
                    <div
                      className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
                      key={index}
                    >
                      <div
                        className="carousel-image-wrapper relative"
                        style={{
                          paddingBottom: '66.67%',
                          position: 'relative',
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={`http://localhost:9000/${img}`}
                          className={`d-block w-100 cursor-pointer ${isFullscreen ? 'h-screen object-contain' : 'object-cover'}`}
                          alt={`Image ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                          onClick={toggleFullscreen}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="carousel-item active">
                    <div
                      className="carousel-image-wrapper relative"
                      style={{
                        paddingBottom: '66.67%',
                        position: 'relative',
                        width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src="path/to/default-image.jpg"
                        className="d-block w-100"
                        alt="No Images Available"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Carousel Controls */}
              <button
                className="carousel-control-prev"
                type="button"
                onClick={() => setActiveIndex((prevIndex) => (prevIndex - 1 + product.image.length) % product.image.length)}
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                onClick={() => setActiveIndex((prevIndex) => (prevIndex + 1) % product.image.length)}
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-2/5 ml-10 flex flex-col justify-between">
            {/* Sale Tag */}
            {product.onSale && (
              <img
                src={Sale} // SaleTag image from the assets
                alt="Sale"
                className="absolute top-0 right-0 h-36 w-36"
              />
            )}

            <p className="my-10 whitespace-pre-wrap">{product.description}</p>

            {/* Display stock status */}
            <p className={`text-lg mb-4 font-bold ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock ? 'Ka stok' : 'Nuk ka stok'}
            </p>

            {/* Display price */}
            <p className="text-lg">
              {product.onSale ? (
                <>
                  <span className="line-through text-red-600 mr-2">
                    {`${product.price} Lek`}
                  </span>
                  <span className="text-green-600">
                    {`${product.salePrice} Lek`}
                  </span>
                </>
              ) : (
                <span>{`${product.price} Lek`}</span>
              )}
            </p>

            {/* Shto në Shport Button - Opens the modal */}
            <div className='py-4 '>
              <button
                onClick={() => handleAddToCartClick(product)}  // Pass the product to the modal
                className={`bg-violet-950 text-white font-bold py-2 px-6 rounded-md hover:bg-violet-800 transition-colors ${!product.stock && 'opacity-50 cursor-not-allowed '}`}
                disabled={!product.stock} // Disable if out of stock
              >
                Shto në Shportë
              </button>
            </div>


            <button
              onClick={goBack}
              className="bg-violet-800 text-white px-4 py-2 rounded-lg hover:bg-violet-600 self-start md:self-end mt-auto"
            >
              Shko Pas
            </button>
          </div>
        </div>

        {/* Pass the product's category as a prop to RelatedProducts */}
        <div className="container mx-auto mt-5 p-6 max-w-[90%]">
          <RelatedProducts category={product.category} />
        </div>

        <WhatsAppButton phoneNumber="+355683687387" />
        <ScrollToTopButton />

        {/* ProductModal to select the quantity and confirm adding to cart */}
        {isModalOpen && (
          <ProductModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            product={selectedProduct}
            onConfirm={handleConfirmAddToCart}
          />
        )}
      </div>
    </>
  );
};

export default Information;
