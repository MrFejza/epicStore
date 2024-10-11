import React, { createContext, useState, useContext } from 'react';

const CheckoutModalContext = createContext();

export const useCheckoutModal = () => useContext(CheckoutModalContext);

export const CheckoutModalProvider = ({ children }) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cartItems: [],
  });
  const [errors, setErrors] = useState({});
  
  const openCheckoutModal = (cartItems) => {
    setCheckoutData({ ...checkoutData, cartItems });
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setCheckoutData({
      name: '',
      email: '',
      phone: '',
      address: '',
      cartItems: [],
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!checkoutData.name) newErrors.name = 'Emri është i detyrueshëm';
    if (!checkoutData.email) newErrors.email = 'Email-i është i detyrueshëm';
    if (!checkoutData.phone) newErrors.phone = 'Numri i telefonit është i detyrueshëm';
    if (!checkoutData.address) newErrors.address = 'Adresa është e detyrueshme';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Add logic to handle submission
      console.log('Form is valid, processing checkout...');
      // Notify Twilio or backend
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
