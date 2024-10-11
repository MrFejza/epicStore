import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Utility functions for managing cart token with timestamps
const saveCartWithTimestamp = (cart) => {
  const currentTime = new Date().getTime(); // Get the current timestamp
  const cartData = {
    items: cart,
    timestamp: currentTime, // Store timestamp with cart
  };
  localStorage.setItem('cartItems', JSON.stringify(cartData));
};

const getCartWithTimestamp = () => {
  const cartData = JSON.parse(localStorage.getItem('cartItems'));
  if (!cartData) return null;

  const currentTime = new Date().getTime();
  const twentyMinutes = 20 * 60 * 1000; // 20 minutes in milliseconds

  // Check if the cart is still valid (within 20 minutes)
  if (currentTime - cartData.timestamp > twentyMinutes) {
    localStorage.removeItem('cartItems'); // Clear expired cart
    return null; // Cart expired
  }

  return cartData.items; // Return valid cart
};

const clearCartIfExpired = () => {
  const cartData = JSON.parse(localStorage.getItem('cartItems'));
  if (cartData) {
    const currentTime = new Date().getTime();
    const twentyMinutes = 1200000; // 20 minutes in milliseconds

    // If more than 20 minutes have passed, clear the cart
    if (currentTime - cartData.timestamp > twentyMinutes) {
      localStorage.removeItem('cartItems');
    }
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart with timestamp when the app loads
  useEffect(() => {
    const savedCart = getCartWithTimestamp();
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save the cart and reset the timestamp every time the cart changes
  useEffect(() => {
    if (cart.length > 0) {
      saveCartWithTimestamp(cart); // Save cart and timestamp
    } else {
      localStorage.removeItem('cartItems'); // Remove cartItems token when cart is empty
    }
  }, [cart]);

  // Add or update cart items with sale price if applicable
  const updateCart = (product, quantity) => {
    const existingCartItem = cart.find(item => item.product._id === product._id);
    if (existingCartItem) {
      const updatedCart = cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity } // Only update the quantity
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  // Remove item from cart and handle clearing cart token
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);

    // If the cart is empty after removal, clear the token from localStorage
    if (updatedCart.length === 0) {
      localStorage.removeItem('cartItems'); // Remove cartItems token
    }
  };

  // Function to clear the entire cart
  const clearCart = () => {
    setCart([]); // Clear the cart state
    localStorage.removeItem('cartItems'); // Clear the cart from localStorage
  };

  // Clear expired cart every minute
  useEffect(() => {
    const interval = setInterval(clearCartIfExpired, 60000); // Check every 1 minute
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <CartContext.Provider value={{ cart, updateCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
