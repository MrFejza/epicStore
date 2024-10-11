import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RelatedProducts = ({ category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(`/api/products?category=${category}`);
        const shuffledProducts = response.data.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffledProducts.slice(0, 9)); // Fetch up to 9 products
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [category]);

  const handleViewMore = () => {
    navigate(`/kategori/${category}`);
  };

  if (relatedProducts.length === 0) {
    return <p>Asnjë produkt i ngjashëm nuk është gjetur.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Produkte në të njëjtën kategori</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg">
            <img
              src={`http://localhost:9000/${product.image}`}
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
        ))}
      </div>
      <button
        onClick={handleViewMore}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Shiko më shumë
      </button>
    </div>
  );
};

export default RelatedProducts;
