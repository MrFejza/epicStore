import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Sale from '../assets/SaleTag.png'; // Import the SaleTag image
import Home from '../assets/HomeHero.png';
import Elektronike from '../assets/ElektronikeHero.png';
import Sport from '../assets/SportHero.png';
import Lodra from '../assets/ToysHero.png';
import All from '../assets/TeGjitha.png';
import New from '../assets/TeRejat.png';
import Offers from '../assets/OfertaHero.png';
import SearchImage from '../assets/Search.png'; // Import the Search image
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import ServiceHighlights from '../components/ServiceHighlights.jsx';
import ScrollToTopButton from '../components/ScrollToTopButton.jsx';

const Kategori = () => {
  const { category } = useParams(); // Get the category from the URL params
  const location = useLocation();
  const navigate = useNavigate(); // For redirecting during edit
  const { updateCart } = useCart(); // Context for updating the shopping cart
  const [products, setProducts] = useState([]); // State for holding the fetched products
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [selectedProduct, setSelectedProduct] = useState(null); // State for modal product
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const productsPerPage = 9; // Number of products per page

  // Get the search query from URL parameters (if any)
  const query = new URLSearchParams(location.search).get('query') || '';

  // Map the categories to their respective images
  const categoryImages = {
    home: Home,
    electronics: Elektronike,
    sports: Sport,
    produktePerFemije: Lodra,
    all: All,
    new: New,
    offers: Offers,
  };

  // Ensure category match by applying toLowerCase and using a fallback (Home)
  const categoryImage = query ? SearchImage : categoryImages[category] ; // Show Search image if query exists or fallback to 'Home'
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if user is an admin

  useEffect(() => {
    // Fetch products by category
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product'); // Fetch all products
        const allProducts = response.data;

        let filteredProducts = allProducts;

        if (query) {
          // If there's a search query, filter products based on name and description
          filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          );
        } else if (category === 'offers') {
          // Filter products that are on sale
          filteredProducts = allProducts.filter(product => product.onSale);
        } else if (category === 'new') {
          // Sort products by creation date (newest first)
          filteredProducts = allProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (category === 'all') {
          // Display all products in a random order
          filteredProducts = allProducts.sort(() => 0.5 - Math.random());
        } else {
          // Filter by specific category from URL params
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

  // Handle when the "Add to Cart" button is clicked
  const handleAddToCartClick = product => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle confirming the product addition to the cart from the modal
  const handleConfirmAddToCart = (product, quantity) => {
    updateCart(product, quantity); // Update the cart context
    handleModalClose(); // Close the modal after adding the product to the cart
  };

  // Handle editing the product (for admins)
  const editProduct = product => {
    navigate(`/edit/${product._id}`); // Navigate to the edit page for the product
  };

  // Handle deleting a product (for admins)
  const deleteProduct = async product => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`/api/product/${product._id}`); // Delete the product from the backend
        setProducts(prevProducts => prevProducts.filter(p => p._id !== product._id)); // Remove the product from the state
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Calculate pagination-related variables
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct); // Slice the products for pagination
  const totalPages = Math.ceil(products.length / productsPerPage); // Calculate the total number of pages

  return (
    <div className="container mx-auto px-10 py-8">
      {loading && <div className="mx-auto text-xl">Loading products...</div>}

      {/* Category or Search Image */}
      <div className="mb-8 text-center">
        <img
          src={categoryImage}
          alt={query ? 'Search Results' : `Category: ${category.toLocaleLowerCase()}`}
          className="max-h-[500px] w-full max-w-[80%] mx-auto"
        />
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
                {/* Sale tag on top-right if the product is on sale */}
                {product.onSale && (
                  <img
                    src={Sale} // SaleTag image
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
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full mr-2"
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
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full ml-2"
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
