import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose(); // Close the modal after adding the product to the cart
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value > 0 ? value : 1); // Ensure quantity is always 1 or more
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-green-500 font-bold">{product.price} ALL</p>
        {product.stock > 0 ? (
          <p className="text-green-500">Ka stock</p>
        ) : (
          <p className="text-red-500">Nuk ka stock</p>
        )}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Sasia:</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="1"
          />
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Shto në shportë
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Mbyll
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
