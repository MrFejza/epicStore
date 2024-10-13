import React, { createContext, useState, useContext, useEffect } from 'react';

const CheckoutModalContext = createContext();

export const useCheckoutModal = () => useContext(CheckoutModalContext);

export const CheckoutModalProvider = ({ children }) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cartItems: [], // Ensure cartItems is initialized as an empty array
    totalAmount: 0, // Add totalAmount for consistency
  });

  const [errors, setErrors] = useState({});

  // Open the modal and set the cartItems and totalAmount
  const openCheckoutModal = (cartItems = [], totalAmount = 0) => {
    console.log('Opening checkout modal with:', { cartItems, totalAmount });
    setCheckoutData({
      ...checkoutData, // Preserve other data (name, email, etc.)
      cartItems,       // Update cart items
      totalAmount,     // Update total amount
    });
    setIsCheckoutModalOpen(true);
  };

  // Close the modal and reset the checkout data
  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setCheckoutData({
      name: '',
      email: '',
      phone: '',
      address: '',
      cartItems: [], // Reset cart items
      totalAmount: 0, // Reset total amount
    });
    setErrors({});
  };

  // Log the updated checkoutData for debugging
  useEffect(() => {
    console.log('Checkout data updated:', checkoutData);
  }, [checkoutData]);

  // Validate form fields before submitting
  const validateForm = () => {
    const newErrors = {};
    if (!checkoutData.name) newErrors.name = 'Emri është i detyrueshëm';
    if (!checkoutData.email) newErrors.email = 'Email-i është i detyrueshëm';
    if (!checkoutData.phone) newErrors.phone = 'Numri i telefonit është i detyrueshëm';
    if (!checkoutData.address) newErrors.address = 'Adresa është e detyrueshme';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form is valid, processing checkout...');
      // Add logic to send data to the backend (e.g., Twilio or your backend)
    } else {
      console.log('Form is invalid, cannot proceed to checkout.');
    }
  };

  return (
    <CheckoutModalContext.Provider
      value={{
        isCheckoutModalOpen,
        checkoutData,
        setCheckoutData,
        openCheckoutModal,
        closeCheckoutModal,
        handleSubmit,
        errors,
      }}
    >
      {children}
    </CheckoutModalContext.Provider>
  );
};
