import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductModal = ({ product, onClose }) => {
  const { updateCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const descriptionRef = useRef(null); // Reference for the description

  useEffect(() => {
    // Check the number of lines in the description only if product and description exist
    if (product?.description && descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.clientHeight;
      const lineHeight = parseFloat(getComputedStyle(descriptionRef.current).lineHeight);
      const lines = descriptionHeight / lineHeight;

      // If the description has 10 or more lines, show the toggle
      if (lines >= 10) {
        setShouldShowToggle(true);
      }
    }
  }, [product?.description]);

  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + increment;
      return newQuantity > 0 ? newQuantity : 1; // Ensure the quantity stays at least 1
    });
  };

  const handleAddToCart = () => {
    updateCart(product, quantity);
    setQuantity(1); // Reset quantity back to 1 after adding to cart
    onClose();
  };

  if (!product) {
    return null; // Return null if the product is not available
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-2 text-3xl right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* Product Name */}
        <h2 className="text-lg font-bold text-center mx-auto">{product.name}</h2>

        {/* Product Image and Description */}
        <div className="flex flex-col items-center mt-4">
          <img src={`https://epicstore.al/${product.image[0]}`} alt={product.name} className="w-32 h-32 object-cover mb-2 rounded-md" />

          {/* Product Description */}
          {product.description && (
            <div
              ref={descriptionRef} // Reference to measure height
              className={`text-gray-700 whitespace-pre-wrap ${expanded ? '' : 'overflow-auto hide-scrollbar'}`}
              style={{
                maxHeight: expanded ? 'none' : '10em', // Approx. 10 lines height (adjust if needed)
                overflowY: expanded ? 'visible' : 'auto', // Allow scrolling when not expanded
                transition: 'max-height 0.3s ease',
              }}
            >
              {product.description}
            </div>
          )}

          {/* Show more/less toggle */}
          {shouldShowToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-violet-600 hover:text-violet-800 mt-2"
            >
              {expanded ? 'Shfaq më pak' : 'Shfaq më shumë'}
            </button>
          )}
        </div>

        {/* Quantity Selector and Add to Cart Button */}
        <div className="mt-4 flex items-center justify-between">
          {/* Quantity Selector */}
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="bg-violet-300 px-3 py-1 text-lg rounded-l"
            >
              -
            </button>
            <span className="px-4 text-lg">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="bg-violet-300 px-3 py-1 text-lg rounded-r"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-violet-600 text-white py-2 px-4 rounded hover:bg-violet-800"
          >
            Shto në shportë
          </button>
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <p className="text-green-500 mt-4 text-center">Ka stock</p>
        ) : (
          <p className="text-red-500 mt-4 text-center">Nuk ka stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
