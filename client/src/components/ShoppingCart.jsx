import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCheckoutModal } from '../context/CheckoutModalContext'; // Import useCheckoutModal to control the checkout modal

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateCart, removeFromCart } = useCart(); // Use Cart Context
  const { openCheckoutModal } = useCheckoutModal(); // Access the modal context

  // Toggle cart modal visibility
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Increase product quantity
  const increaseQuantity = (productId) => {
    const product = cart.find((item) => item.product._id === productId);
    if (product) {
      updateCart(product.product, product.quantity + 1);
    }
  };

  // Decrease product quantity
  const decreaseQuantity = (productId) => {
    const product = cart.find((item) => item.product._id === productId);
    if (product && product.quantity > 1) {
      updateCart(product.product, product.quantity - 1);
    }
  };

  // Get total amount of cart items, considering sale price if applicable
  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price;
      return total + item.quantity * itemPrice;
    }, 0);
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    const totalAmount = getTotalAmount();
    console.log('Proceeding to checkout with cart items:', cart, 'Total amount:', totalAmount);
    toggleCart(); // Close the cart modal
    openCheckoutModal(cart, totalAmount); // Open the checkout modal with cart data and total amount
  };

  return (
    <div>
      {/* Shopping Cart Icon */}
      <div className="relative cursor-pointer" onClick={toggleCart}>
        <span className="text-2xl">🛒</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
            {cart.length}
          </span>
        )}
      </div>

      {/* Modal for Cart */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 md:w-1/3 p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={toggleCart}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">Shporta juaj</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Shporta eshte bosh.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.product._id} className="py-4 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span>{item.product.name}</span>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => decreaseQuantity(item.product._id)}
                          className="bg-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-400"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.product._id)}
                          className="bg-gray-300 text-black px-2 py-1 rounded-md hover:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span>
                        {(item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price) * item.quantity} Lek
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      >
                        Hiq nga Shporta
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <h3 className="text-xl font-semibold">Totali: {getTotalAmount().toFixed(2)} Lek</h3>
              <button
                className="mt-4 bg-violet-950 text-white px-4 py-2 rounded hover:bg-violet-700"
                onClick={proceedToCheckout}
              >
                Kasa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;