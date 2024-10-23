import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products by category
    const fetchRelatedProducts = async () => {
      try {
        // Fetch products by the given category
        const response = await axios.get(`/api/product?category=${category}`);
        const allProducts = response.data;

        // Filter out the current product and products not in "Oferta" or "Të Rejat"
        const filteredProducts = allProducts.filter(
          (product) => 
            product._id !== currentProductId && 
            product.category === category && 
            product.category !== 'Oferta' && 
            product.category !== 'Të Rejat'
        );

        // Randomize the product list and pick 9 products
        const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffledProducts.slice(0, 9)); // Show up to 9 related products
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  const handleViewMore = () => {
    navigate(`/kategori/${category}`);
  };

  if (relatedProducts.length === 0) {
    return <p>Asnjë produkt i ngjashëm nuk është gjetur.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 w-full">Produkte në të njëjtën kategori</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3  md:mx-4 gap-x-2 gap-y-6">
        {relatedProducts.map((product) => (
          <Link key={product._id} to={`/information/${product._id}`} className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
            <div>
              <img
                src={`http://localhost:9000/${product.image[0]}`}
                alt={product.name}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className="text-lg font-bold">{product.name}</h3>
              {product.onSale ? (
                <>
                  <span className="line-through text-red-600">{product.price} Lek</span>
                  <span className="text-green-600 ml-2">{product.salePrice} Lek</span>
                </>
              ) : (
                <p>{product.price} Lek</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <button
        onClick={handleViewMore}
        className="mt-6 bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600"
      >
        Shiko më shumë
      </button>
    </div>
  );
};

export default RelatedProducts;
