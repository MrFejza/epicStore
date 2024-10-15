import React, { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EpicStoreLogo from '../assets/EpicStoreLogo.png';
import TikTokLogo from '../assets/TIktokLogo.png';
import InstagramLogo from '../assets/InstagramLogo.png';
import FacebookLogo from '../assets/Facebook-Logosu.png';
import ShoppingCart from './ShoppingCart';
import CheckoutModal from './CheckoutModal';
import { useCart } from '../context/CartContext';
import { useCheckoutModal } from '../context/CheckoutModalContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, removeFromCart } = useCart();
  const { openCheckoutModal } = useCheckoutModal();
  const [query, setQuery] = useState('');

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
        {({ open }) => (
          <>
            <div className="md:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="hidden md:flex justify-between items-center pt-4 pb-2">
                <Link to="/" className="flex-shrink-0">
                  <img className="h-36 p-0 w-auto" src={EpicStoreLogo} alt="Epic Store Logo" />
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
                    <img className="h-24 w-auto" src={EpicStoreLogo} alt="Epic Store Logo" />
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
            </div>

            {location && (
              <div
                className={`${location.pathname === '/' || `/kategori/:category` ? 'md:hidden lg:hidden' : ''
                  } bg-violet-100 w-full mt-4 md:mt-0 max-w-[90%] mx-auto`}
              >
                <nav className="container mx-auto py-3">
                  <div className="flex justify-start items-start">
                    <div className="flex justify-start items-start">
                      {location.pathname !== '/' ? (
                        <div className="block">
                          <ul className="relative">
                            <li className="text-gray-800 relative group">
                              <span className="cursor-pointer pl-6 py-3">Kategoritë</span>
                              <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block space-y-1">
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/ProduktePerFemije" className="text-gray-800">Produkte për Fëmijë</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/ElektronikeAksesore" className="text-gray-800">Elektronikë dhe Aksesorë</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/ShtepiJetese" className="text-gray-800">Shtëpi dhe Jetesë</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/ZyreTeknologji" className="text-gray-800">Zyrë dhe Teknologji</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/SportAktivitet" className="text-gray-800">Sport dhe Aktivitet në Natyrë</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/KuzhineUshqim" className="text-gray-800">Kuzhinë dhe Ushqim</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/FestaEvente" className="text-gray-800">Festa dhe Evente</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/Motorra" className="text-gray-800">Motorra</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/Kafshe" className="text-gray-800">Kafshë</Link>
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100">
                                  <Link to="/kategori/all" className="text-gray-800 ">Të Gjitha</Link>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="block md:hidden">
                          <div className="flex space-x-6">
                            <Link to="/kategori/new" className="text-gray-800 pl-6">Të Rejat</Link>
                            <Link to="/kategori/offers" className="text-gray-800">Oferta</Link>
                            <LogoutButton />
                          </div>
                        </div>
                      )}

                      {location.pathname !== '/' && (
                        <div className="flex space-x-6">
                          <Link to="/kategori/new" className="text-gray-800 pl-6">Të Rejat</Link>
                          <Link to="/kategori/offers" className="text-gray-800">Oferta</Link>
                          <div className="md:hidden">
                            <LogoutButton />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </nav>
              </div>
            )}
          </>
        )}
      </Disclosure>

      <CheckoutModal />
    </>
  );
};

export default Header;
