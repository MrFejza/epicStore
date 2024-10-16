import { useCheckoutModal } from '../context/CheckoutModalContext';
import { useCart } from '../context/CartContext'; // Import the useCart hook to access cart functions
import { useState } from 'react';
import axios from 'axios';

const CheckoutModal = () => {
  const { isCheckoutModalOpen, closeCheckoutModal, checkoutData } = useCheckoutModal(); 
  const { clearCart } = useCart(); // Access clearCart from the cart context
  const { cartItems, totalAmount } = checkoutData; // Destructure cartItems and totalAmount from checkoutData
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [prefix, setPrefix] = useState('AL'); // Default to Albania ('AL')

  // Helper function to capitalize the first letter of each word
  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation (only letters)
    if (!customerName.match(/^[A-Za-z]+$/)) {
      newErrors.customerName = 'Emri duhet të përmbajë vetëm shkronja.';
    }

    // Last name validation (only letters)
    if (!customerLastName.match(/^[A-Za-z]+$/)) {
      newErrors.customerLastName = 'Mbiemri duhet të përmbajë vetëm shkronja.';
    }

    // Address validation (non-empty)
    if (!address.trim()) {
      newErrors.address = 'Ju lutemi shkruani adresën tuaj.';
    }

    // Phone validation for Albania and Kosovo prefixes
    if (prefix === 'AL') {
      if (!/^(67|68|69)\d{7}$/.test(phone)) {
        newErrors.phone = 'Numri për Shqipërinë duhet të fillojë me 67, 68, ose 69 dhe të ketë 10 shifra.';
      }
    } else if (prefix === 'KOS') {
      if (!/^(43|44|45)\d{6}$/.test(phone)) {
        newErrors.phone = 'Numri për Kosovën duhet të fillojë me 43, 44, ose 45 dhe të ketë 9 shifra.';
      }
    }

    // Email validation (optional)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ju lutemi shkruani një email valid.';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Validate form before submitting
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
  
    // Ensure cartItems is a valid array before using .map
    const validCartItems = Array.isArray(cartItems) ? cartItems : [];
  
    const orderData = {
      customerName,
      customerLastName,
      address,
      phone: (prefix === 'AL' ? '+355' : '+383') + phone, // Apply Albania or Kosovo prefix
      email,
      products: validCartItems.map((item) => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        // Use the sale price if available, otherwise use the regular price
        price: item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price,
      })),
      totalAmount,
    };
  
    try {
      // Submit the order to your backend
      await axios.post('/api/orders', orderData);
  
      // Trigger WhatsApp message upon successful order submission
      await axios.post('/api/whatsapp', orderData);
  
      // Clear the cart after order submission
      clearCart();
  
      // Reset the checkout modal inputs
      setCustomerName('');
      setCustomerLastName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setSuccessMessage('Porosia u vendos me sukses dhe njoftimi u dërgua!');
  
      setIsSubmitting(false);
      closeCheckoutModal(); // Close the checkout modal
    } catch (error) {
      console.error('Error placing order or sending WhatsApp message:', error);
      setIsSubmitting(false);
    }
  };

  return (
    isCheckoutModalOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="bg-white w-11/12 md:w-1/3 p-6 rounded-lg shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={closeCheckoutModal}
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4">Kasa</h2>

          {/* Cart Summary */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Shporta Juaj</h3>
            {Array.isArray(cartItems) && cartItems.length === 0 ? (
              <p>Shporta është bosh.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {Array.isArray(cartItems) && cartItems.map((item) => (
                  <li key={item.product._id} className="py-2">
                    {item.product.name} - {item.quantity} x 
                    {item.product.onSale && item.product.salePrice 
                      ? item.product.salePrice 
                      : item.product.price} 
                    Lek
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4">
              <h4 className="text-lg font-semibold">Total: {totalAmount ? `${totalAmount} Lek` : '0 Lek'}</h4>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
              {successMessage}
            </div>
          )}

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Emri</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(capitalizeFirstLetter(e.target.value))} // Capitalize first letter
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-transform capitalize"
              />
              {errors.customerName && <p className="text-red-600">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mbiemri</label>
              <input
                type="text"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(capitalizeFirstLetter(e.target.value))} // Capitalize first letter
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-transform capitalize"
              />
              {errors.customerLastName && <p className="text-red-600">{errors.customerLastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresa</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(capitalizeFirstLetter(e.target.value))} // Capitalize first letter
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-transform capitalize"
              />
              {errors.address && <p className="text-red-600">{errors.address}</p>}
            </div>

            {/* Phone Number with Prefix */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Numri i telefonit</label>
              <div className="flex items-center space-x-2">
                <select
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-1/3 px-3 py-2 border rounded-l-md"
                >
                  <option value="AL">AL (+355)</option>
                  <option value="KOS">KOS (+383)</option>
                </select>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-2/3 px-3 py-2 border rounded-r-md"
                  placeholder={prefix === 'AL' ? '+355 xx xxx xxxx' : '+383 xx xxx xxx'}
                  required
                />
              </div>
              {errors.phone && <p className="text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // No capitalization for email
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Duke dërguar...' : 'Konfirmo Porosinë'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CheckoutModal;
