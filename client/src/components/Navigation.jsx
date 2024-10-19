import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navigation = ({ expanded, setExpanded, navHeight }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation(); // To get the current route

  // Fetch the categories from the backend
  useEffect(() => {
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

  // Determine how many categories to show based on the current route
  const categoriesToShow = location.pathname === '/kategori/new' || location.pathname === '/kategori/offers' || location.pathname === '/kategori/all' || location.pathname === '/kategori/search'  ? 7 : 5;

  // Get the first set of categories before expanding
  const initialCategories = categories.slice(0, categoriesToShow);
  // Remaining categories shown when expanded
  const expandedCategories = categories.slice(categoriesToShow);

  return (
    <div
      className={`col-span-2 lg:col-span-2 md:col-span-4 bg-violet-100 p-4 hidden sm:block hide-scrollbar`}
      style={{ height: expanded ? navHeight : 'auto', overflowY: expanded ? 'auto' : 'hidden' }}
    >
      <ul className="space-y-5 text-center overflow-auto hide-scrollbar">
        {/* Static links */}
        <li className="relative group">
          <Link to="/kategori/new" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Të Rejat</Link>
        </li>
        <li className="relative group">
          <Link to="/kategori/offers" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Oferta</Link>
        </li>

        {/* Dynamically fetched categories */}
        {loading ? (
          <li>Loading categories...</li>
        ) : error ? (
          <li>{error}</li>
        ) : (
          initialCategories.map((category, index) => (
            <li key={category._id} className="relative group">
              <Link
                to={`/kategori/${category.slug}`}
                className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500"
              >
                {category.name}
              </Link>
            </li>
          ))
        )}

        {/* Show remaining categories only if expanded is true */}
        {expanded && (
          <>
            {expandedCategories.map((category, index) => (
              <li key={category._id} className="relative group">
                <Link
                  to={`/kategori/${category.slug}`}
                  className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            {/* Static link */}
            <li className="relative group">
              <Link to="/kategori/all" className="text-gray-800 group-hover:border-b-2 group-hover:border-violet-500">Të Gjitha</Link>
            </li>
          </>
        )}

        <li>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-violet-600 hover:text-violet-800"
          >
            {expanded ? 'Shfaq më pak' : 'Shfaq më shumë'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
