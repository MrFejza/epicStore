import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';  // Import useNavigate
import EpicStoreLogo from '../assets/EpicStoreLogo.png';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Admin', href: '/admin' },
  { name: 'Upload', href: '/upload' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add this to use navigate

  // Utility function to get cookie value by name
  const getToken = () => {
    return localStorage.getItem('jwt') !== undefined;
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('isAdmin');
    navigate('/');  // Redirect to the homepage
  };

  const isAuth = localStorage.getItem('isAuth');
  const isAdmin = localStorage.getItem('isAdmin');

  const LogoutButton = () => {
    if (isAuth && isAdmin) {
      return (
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:bg-violet-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          Logout
        </button>
      );
    }
    return null; // Return null or something else if the condition is not met
  };

  return (
    <Disclosure as="nav" className="bg-violet-950">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between p-2">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-violet-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">
                <div className="flex flex-shrink-0 items-center">
                  <img className="h-16 w-16" src={EpicStoreLogo} alt="Logo" />
                </div>
                <div className="hidden sm:ml-6 sm:block my-auto">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href ? 'bg-violet-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={location.pathname === item.href ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <LogoutButton />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href ? 'bg-violet-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={location.pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
