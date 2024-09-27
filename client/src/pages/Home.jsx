import { useEffect, useState } from "react";
import axios from "axios";
import Meta from "../components/Meta";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ShoppingCart from "../components/ShoppingCart";
import CheckoutModal from "../components/CheckoutModal";
import ProductModal from "../components/ProductModal";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productssPerPage = 9;

  // Check if user is an admin
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        const sortedProducts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching Products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage on page load
  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const currentTime = Date.now();
    const filteredCart = savedCart.filter((item) => {
      const productToken = JSON.parse(localStorage.getItem(`productToken_${item.product._id}`));
      if (productToken) {
        const timeDifference = currentTime - productToken.timestamp;
        if (timeDifference < 1200000) { // 20 minutes
          return true;
        } else {
          localStorage.removeItem(`productToken_${item.product._id}`);
          return false;
        }
      }
      return false;
    });
    setCart(filteredCart);
    localStorage.setItem('cartItems', JSON.stringify(filteredCart));
  };

  useEffect(() => {
    loadCart(); // Load cart on page load
  }, []);

  // Add product to cart
  const addToCart = (product, quantity) => {
    const token = Date.now().toString();
    const timestamp = Date.now();
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCart = existingCart.map((item) =>
      item.product._id === product._id ? { ...item, quantity } : item
    );

    if (!existingCart.some((item) => item.product._id === product._id)) {
      updatedCart.push({ product, quantity });
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    localStorage.setItem(`productToken_${product._id}`, JSON.stringify({ token, timestamp }));
    setCart(updatedCart);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const confirmRemoval = window.confirm("Are you sure you want to remove this item from the cart?");
    if (confirmRemoval) {
      const updatedCart = cart.filter((item) => item.product._id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      localStorage.removeItem(`productToken_${productId}`);
      setCart(updatedCart);
    }
  };

  // Handle edit product
  const editProduct = (product) => {
    navigate(`/edit/${product._id}`);
  };

  // Handle delete product
  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/product/${product._id}`);
        setProducts((prevProducts) => prevProducts.filter(p => p._id !== product._id));
        navigate('/home');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Define `submitOrder` function to handle order submission
  const submitOrder = async (orderData) => {
    console.log('Submit Order called:', orderData);  // Add this for debugging

    try {
      // Comment out this line to test
      // await axios.post('/api/orders', { ...orderData, cartItems: cart });
      console.log('Order submitted successfully (but not sent to the backend)');
      setIsCheckoutOpen(false);
      setCart([]);  // Clear cart after successful order submission
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  // Handle opening the ProductModal
  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle closing the ProductModal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Toggle Cart Modal
  const toggleCartModal = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Toggle Checkout Modal
  const toggleCheckoutModal = () => {
    setIsCheckoutOpen(!isCheckoutOpen);
    setIsCartOpen(false);
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.product.price, 0);
  };

  return (
    <>
      <Meta title="Products - Epic Store" />
      <div className="container mx-auto px-10 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-violet-950">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link to={`/information/${product._id}`}>
                <div className="h-64 overflow-hidden flex justify-center items-center mb-4">
                  <img
                    src={product.image ? `http://localhost:9000/${product.image[0]}` : 'default-image-path.jpg'}
                    alt={product.name ?? 'Product Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">{product.name}</h2>

                {/* Stock Display */}
                <p className={`text-center mb-4 font-bold ${product.stock === 'in_stock' ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock === 'in_stock' ? 'Ka stok' : 'Nuk ka stok'}
                </p>
                {/* Price Display */}
                <p className="text-center mb-2">
                  <strong>Price:</strong> {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'ALL' }).format(product.price)}
                </p>
              </Link>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleAddToCartClick(product)}
                  className={`bg-violet-950 text-white font-bold py-2 px-6 rounded-md hover:bg-violet-800 transition-colors ${product.stock === 'out_of_stock' && 'opacity-50 cursor-not-allowed'}`}
                  disabled={product.stock === 'out_of_stock'}  // Disable button if out of stock
                >
                  Add to Cart
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
          ))}
        </div>

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
            Page {currentPage} of {Math.ceil(products.length / productssPerPage)}
          </span>
          {currentPage < Math.ceil(products.length / productssPerPage) && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full ml-2"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      </div>


      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onConfirm={(product, quantity) => addToCart(product, quantity)}
      />

      <ShoppingCart
        cartItems={cart}
        setCart={setCart}
        handleCheckout={toggleCheckoutModal}
        removeFromCart={removeFromCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        handleClose={toggleCheckoutModal}
        handleOrderSubmit={submitOrder}
        cartItems={cart}
        totalAmount={calculateTotalAmount()}
      />
    </>
  );
};

export default Home;
