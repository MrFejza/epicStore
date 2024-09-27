import React, { useState } from 'react';

const ShoppingCart = ({ cartItems, setCart, handleCheckout, removeFromCart }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle cart modal visibility
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Increase product quantity
  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease product quantity
  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Get total amount of cart items
  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);
  };

  // Pass cart items and total amount to handleCheckout
  const proceedToCheckout = () => {
    const totalAmount = getTotalAmount();
    handleCheckout(cartItems, totalAmount);
    toggleCart(); // Close the cart after proceeding to checkout
  };

  return (
    <div>
      {/* Shopping Cart Icon */}
      <div
        className="fixed bottom-5 right-5 bg-violet-950 text-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-violet-700"
        onClick={toggleCart}
      >
        <span className="text-lg">🛒</span>
        <span className="absolute -top-1 -left-1 bg-red-600 text-white rounded-full px-2 text-xs">
          {cartItems.length}
        </span>
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
            <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
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
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-right">
              <h3 className="text-xl font-semibold">Total: ${getTotalAmount().toFixed(2)}</h3>
              <button
                className="mt-4 bg-violet-950 text-white px-4 py-2 rounded hover:bg-violet-700"
                onClick={proceedToCheckout} // Now passing the cartItems and total amount
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
