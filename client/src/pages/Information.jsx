import React, { useEffect, useState, useRef } from 'react'; // Add useRef
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css'; 
import Meta from '../components/Meta';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { useCart } from '../context/CartContext';
import RelatedProducts from '../components/RelatedProducts.jsx';
import ProductModal from '../components/ProductModal'; 
import Sale from '../assets/SaleTag.png'; 
import ScrollToTopButton from '../components/ScrollToTopButton.jsx';
import { useCheckoutModal } from '../context/CheckoutModalContext'; 

const Information = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [product, setProduct] = useState(null); 
  const [isFullscreen, setIsFullscreen] = useState(false); 
  const { updateCart } = useCart(); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [activeIndex, setActiveIndex] = useState(0); 
  const { openCheckoutModal } = useCheckoutModal();
  
  // Reference for carousel
  const carouselRef = useRef(null);

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

  // Scroll to the carousel when product changes
  useEffect(() => {
    if (product && carouselRef.current) {
      // Scroll to the carousel's position smoothly
      window.scrollTo({
        top: carouselRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [product]); // Trigger when the product changes

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmAddToCart = (product, quantity) => {
    const productToAdd = {
      _id: product._id, 
      name: product.name,
      price: product.onSale && product.salePrice ? product.salePrice : product.price, 
    };
    updateCart(productToAdd, quantity); 
    handleModalClose();
  };

  const handleOneClickOrder = (product) => {
    const singleProductOrder = [
      {
        product: {
          _id: product._id,
          name: product.name,
          price: product.onSale && product.salePrice ? product.salePrice : product.price,
          onSale: product.onSale,
          salePrice: product.salePrice,
        },
        quantity: 1, 
      }
    ];
    const totalAmount = singleProductOrder[0].product.price;
    openCheckoutModal(singleProductOrder, totalAmount); 
  };

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
        <h1 className="text-4xl font-bold mb-4 text-center"ref={carouselRef}>{product.name}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/5" > {/* Add ref here */}
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
            {product.onSale && (
              <img
                src={Sale} 
                alt="Sale"
                className="absolute top-0 right-0 h-36 w-36"
              />
            )}

            <p className="my-10 whitespace-pre-wrap">{product.description}</p>

            <p className={`text-lg mb-4 font-bold ${product.stock ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock ? 'Ka stok' : 'Nuk ka stok'}
            </p>

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

            <div className='py-4 flex space-x-4'>
              <button
                onClick={() => handleAddToCartClick(product)}  
                className={`bg-violet-950 text-white font-bold py-2 px-6 rounded-md hover:bg-violet-800 transition-colors ${!product.stock && 'opacity-50 cursor-not-allowed '}`}
                disabled={!product.stock} 
              >
                Shto në Shportë
              </button>

              <button
                onClick={() => handleOneClickOrder(product)} 
                className={`bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-500 transition-colors ${!product.stock && 'opacity-50 cursor-not-allowed '}`}
                disabled={!product.stock} 
              >
                Porosit me një klik
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
          <RelatedProducts category={product.category} currentProductId={product._id} />
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
  