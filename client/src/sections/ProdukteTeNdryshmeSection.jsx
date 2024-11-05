import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import SaleTag from '../assets/SaleTag.png';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import ProductModal from '../components/ProductModal';

const ProdukteTeNdryshmeSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCart } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProdukteTeNdryshme = async () => {
      try {
        const response = await axios.get('/api/product');
        const allProducts = response.data;

        // Determine the number of products to fetch based on screen size
        const productsToFetch = window.innerWidth <= 640 ? 10 : 12; 

        // Get random products based on screen size
        const randomProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, productsToFetch);

        setProducts(randomProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Produkte të Ndryshme:', error);
        setLoading(false);
      }
    };

    fetchProdukteTeNdryshme();

    // Optional: Add an event listener for resizing (if you want to refetch on window resize)
    const handleResize = () => {
      fetchProdukteTeNdryshme();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmAddToCart = (product, quantity) => {
    updateCart(product, quantity); // Add product to cart
    handleModalClose();
  };

  const handleMouseEnter = (productId) => {
    setHoveredProduct(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  if (loading) {
    return <div>Loading Produkte të Ndryshme...</div>;
  }

  return (
    <div className="my-12">
      <h2 className="text-4xl font-bold text-center m-6">Produkte të Ndryshme</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link to={`/information/${product._id}`} key={product._id}>
            <div
              className={`bg-white p-4 rounded-lg shadow-lg transition-all duration-300 relative group ${
                hoveredProduct === product._id ? 'h-[370px] z-10' : 'md:h-[310px] h-[360px]'
              }`} // Initial height and increased height on hover
              onMouseEnter={() => handleMouseEnter(product._id)}
              onMouseLeave={handleMouseLeave}
            >
              {product.onSale && (
                <img src={SaleTag} alt="Sale" className="absolute top-0 right-0 h-32 w-32" />
              )}
              <div className="h-48 overflow-hidden flex justify-center items-center mb-4">
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
              <h3 className="text-lg font-semibold text-center mb-2">{product.name}</h3>
              <p className="text-center mb-8">
                {product.onSale ? (
                  <>
                    <span className="line-through text-red-600">{product.price} Lek</span>{' '}
                    <span className="text-green-600">{product.salePrice} Lek</span>
                  </>
                ) : (
                  <span>{product.price} Lek</span>
                )}
              </p>

              {hoveredProduct === product._id && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product); // Open modal to add to cart
                  }}
                  className="bg-violet-950 text-white font-bold  py-2 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2"
                >
                  Shto në shportë
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <Link
          to="/kategori/all"
          className="bg-violet-950 text-white font-bold py-2 px-6 rounded-md hover:bg-violet-800"
        >
          Shiko më shumë
        </Link>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onConfirm={handleConfirmAddToCart}
      />
    </div>
  );
};

export default ProdukteTeNdryshmeSection;
