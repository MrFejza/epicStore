import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import EpicStoreLogo from '../assets/EpicStoreLogo.png';
import TikTokLogo from '../assets/TIktokLogo.png';
import InstagramLogo from '../assets/InstagramLogo.png';
import FacebookLogo from '../assets/Facebook-Logosu.png';
import ShoppingCart from './ShoppingCart';
import CheckoutModal from './CheckoutModal';
import { useCart } from '../context/CartContext';
import { useCheckoutModal } from '../context/CheckoutModalContext';
import NavComponent from './NavComponent';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart } = useCart();
  const { openCheckoutModal } = useCheckoutModal();
  const [query, setQuery] = useState('');

  const [categories, setCategories] = useState([]); // Fetch categories for mobile menu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/kategori/search?query=${query}`);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.product.price, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const isAuth = localStorage.getItem('isAuth');
  const isAdmin = localStorage.getItem('isAdmin');

  const LogoutButton = () => {
    if (isAuth && isAdmin) {
      return (
        <>
          <div className="md:hidden text-gray-800">
            <button
              onClick={handleLogout}
              className="text-gray-800"
            >
              Logout
            </button>
          </div>

          <div className="hidden md:flex">
            <button
              onClick={handleLogout}
              className="text-gray-800 hover:bg-violet-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Disclosure as="nav" className="bg-white border-b border-gray-200 z-10 relative">
        {({ open, close }) => ( // Access the `close` function to manually close the menu
          <>
            <div className="md:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="hidden md:flex justify-between items-center pt-4 pb-2">
                <Link to="/" className="flex-shrink-0">
                  <img className="h-28 pb-1 w-auto" src={EpicStoreLogo} alt="Epic Store Logo" />
                </Link>

                <div className="flex-1 flex justify-center px-auto ml-2">
                  <form onSubmit={handleSearch} className="w-full max-w-lg">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                      <input
                        id="search"
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Kërko produkte..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                      <button onClick={handleSearch}
                        type="submit"
                        className="absolute inset-y-0 right-0 text-3xl flex items-center pr-3 text-gray-500 hover:text-violet-600"
                      >
                        ⌕
                      </button>
                    </div>
                  </form>
                </div>

                <div className="ml-4 mr-2">
                  <ShoppingCart
                    cartItems={cart}
                    handleCheckout={() => openCheckoutModal(cart)} // Only pass cart items, not totalAmount
                    removeFromCart={removeFromCart}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <a href="https://www.instagram.com/epic_store.al?igsh=MWVvOWFjNDRwb3NjcQ==" target="_blank" rel="noopener noreferrer">
                    <img src={InstagramLogo} alt="Instagram" className="h-8 w-16" />
                  </a>
                  <a href="https://www.tiktok.com/@epic_store.al?_t=8q7hz7mPsGr&_r=1" target="_blank" rel="noopener noreferrer">
                    <img src={TikTokLogo} alt="TikTok" className="h-8 w-8" />
                  </a>
                  <a href="https://www.facebook.com/EpicStoreAlbania?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
                    <img src={FacebookLogo} alt="Facebook" className="h-8 w-14" />
                  </a>
                </div>
                <LogoutButton />
              </div>

              {/* Mobile View */}
              <div className="flex md:hidden justify-between items-center pt-4">
                <div className="flex items-center space-x-0">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-violet-600 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    )}
                  </Disclosure.Button>

                  <Link to="/" className="flex-shrink-0">
                    <img className="h-24 w-auto pb-2" src={EpicStoreLogo} alt="Epic Store Logo" />
                  </Link>
                </div>

                <div className="flex items-center space-x-10">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="text-4xl text-gray-800"
                  >
                    ⌕
                  </button>

                  <ShoppingCart
                    cartItems={cart}
                    handleCheckout={() => openCheckoutModal(cart)} // Only pass cart items, not totalAmount
                    removeFromCart={removeFromCart}
                  />
                </div>
              </div>
              
              <NavComponent/>
            </div>

            {/* Mobile dropdown menu (categories) */}
            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                
                
                {/* Dynamically fetched categories for mobile view */}
                {loading ? (
                  <p className="px-3 py-2">Loading categories...</p>
                ) : error ? (
                  <p className="px-3 py-2 text-red-500">{error}</p>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/kategori/${category.slug}`}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800"
                      onClick={close} // Close menu on link click
                    >
                      {category.name}
                    </Link>
                  ))
                )}
                
                <Link
                  to="/kategori/all"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800"
                  onClick={close} // Close menu on link click
                >
                  Të Gjitha
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <CheckoutModal />
    </>
  );
};

export default Header;
