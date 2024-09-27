import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);  // Default quantity

  // Reset quantity to 0 whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setQuantity(0);  // Set quantity to 0 when modal opens
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleConfirm = () => {
    onConfirm(product, quantity);  // Send product and quantity to parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-violet-950 w-11/12 md:w-1/3 p-6 rounded-lg shadow-lg relative text-white">
        <button className="absolute top-2 right-2 text-white hover:text-gray-300" onClick={onClose}>✖</button>
        <h2 className="text-2xl font-bold mb-4">Add {product?.name} to Cart</h2>
        <div className="flex justify-center items-center mb-4">
          <button className="bg-gray-700 text-white px-3 py-1 rounded-md" onClick={handleDecrease}>-</button>
          <span className="mx-4 text-lg">{quantity}</span>
          <button className="bg-gray-700 text-white px-3 py-1 rounded-md" onClick={handleIncrease}>+</button>
        </div>
        <div className="flex justify-between">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={onClose}>Cancel</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
