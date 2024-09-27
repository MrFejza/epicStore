import { useState } from 'react';
import axios from 'axios';

const CheckoutModal = ({ isOpen, handleClose, handleOrderSubmit, cartItems, totalAmount }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [prefix, setPrefix] = useState('AL'); // Default to Albanian prefix (AL)

  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handlePhoneChange = (e) => {
    const phoneInput = e.target.value;
    setPhone(phoneInput);
  };

  const validateForm = () => {
    let formErrors = {};

    if (!customerName) formErrors.customerName = 'Required';
    if (!customerLastName) formErrors.customerLastName = 'Required';
    if (!address) formErrors.address = 'Required';

    // Phone number validation based on prefix
    if (prefix === 'AL') {
      // Albanian numbers must be 10 digits, starting with 67, 68, or 69
      if (!/^(67|68|69)\d{7}$/.test(phone)) {
        formErrors.phone = 'Phone number for Albania must start with 67, 68, or 69 and have 10 digits.';
      }
    } else if (prefix === 'KOS') {
      // Kosovo numbers must be 9 digits, starting with 43, 44, or 45
      if (!/^(43|44|45)\d{6}$/.test(phone)) {
        formErrors.phone = 'Phone number for Kosovo must start with 43, 44, or 45 and have 9 digits.';
      }
    }

    return formErrors;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Validate the form
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    setIsSubmitting(false);
    return;
  } else {
    setErrors({});
  }

  // Prepare the order data with all products
  const orderData = {
    customerName,
    customerLastName,
    address,
    phone: (prefix === 'AL' ? '+355' : '+383') + phone, // Use appropriate prefix for Albania or Kosovo
    email,
    products: cartItems.map(item => ({
      productId: item.product._id,
      productName: item.product.name, // Make sure to include product name
      quantity: item.quantity,
      price: item.product.price,
    })),
    totalAmount, // Include total amount
  };

  try {
    // Only one API request to submit the order
    const response = await axios.post('/api/orders', orderData);
    console.log('Order submitted:', response.data);
    handleOrderSubmit(response.data);
    setSuccessMessage('Porosia u dërgua me sukses');
    setIsSubmitting(false);
    handleClose();
  } catch (error) {
    console.error('Error submitting order:', error);
    setIsSubmitting(false);
  }
};



  return (
    isOpen && (
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleClose}
      >
        <div
          className="bg-white w-11/12 md:w-1/3 p-6 rounded-lg shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={customerName}
                onChange={(e) => setCustomerName(capitalizeFirstLetter(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md ${errors.customerName ? 'border-red-500' : ''}`}
              />
              {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(capitalizeFirstLetter(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md ${errors.customerLastName ? 'border-red-500' : ''}`}
              />
              {errors.customerLastName && <p className="text-red-500 text-sm">{errors.customerLastName}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(capitalizeFirstLetter(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : ''}`}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            <div className="flex items-center space-x-2">
              {/* Dropdown and Prefix Div taking 30% */}
              <div className="flex w-2/5 space-x-2">
                <select
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-1/2 px-3 py-2 border rounded-l-md"
                >
                  <option value="AL">AL</option>
                  <option value="KOS">KOS</option>
                </select>
                <span className="w-1/2 px-3 py-2 bg-gray-200 border rounded-r-md">
                  {prefix === 'AL' ? '+355' : '+383'}
                </span>
              </div>
              {/* Phone Number input takes 70% */}
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={handlePhoneChange}
                className={`w-2/3 px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            <div>
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // No capitalization applied to email
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Order'}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default CheckoutModal;
