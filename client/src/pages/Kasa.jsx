import { useCart } from '../context/CartContext';
import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Kasa = () => {
  const { cart, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [qyteti, setQyteti] = useState('');  // City field
  const [rruga, setRruga] = useState('');    // Street field
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [prefix, setPrefix] = useState('AL');

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.quantity * (item.product.onSale ? item.product.salePrice : item.product.price),
    0
  );

  const capitalizeFirstLetter = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handlePhoneChange = (e) => setPhone(e.target.value);

  const validateForm = () => {
    const newErrors = {};
    if (!customerName.match(/^[A-Za-z]+$/)) {
      newErrors.customerName = 'Emri duhet të përmbajë vetëm shkronja.';
    }
    if (!customerLastName.match(/^[A-Za-z]+$/)) {
      newErrors.customerLastName = 'Mbiemri duhet të përmbajë vetëm shkronja.';
    }
    if (!qyteti.trim()) {
      newErrors.qyteti = 'Ju lutemi shkruani qytetin tuaj.';
    }
    if (!rruga.trim()) {
      newErrors.rruga = 'Ju lutemi shkruani rrugën tuaj.';
    }
    if (prefix === 'AL' && !/^(67|68|69)\d{7}$/.test(phone)) {
      newErrors.phone = 'Numri për Shqipërinë duhet të fillojë me 67, 68, ose 69 dhe të ketë 10 shifra.';
    } else if (prefix === 'KOS' && !/^(43|44|45)\d{6}$/.test(phone)) {
      newErrors.phone = 'Numri për Kosovën duhet të fillojë me 43, 44, ose 45 dhe të ketë 9 shifra.';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ju lutemi shkruani një email valid.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      customerName,
      customerLastName,
      qyteti,
      rruga,
      phone: (prefix === 'AL' ? '+355' : '+383') + phone,
      email,
      products: cart.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.onSale ? item.product.salePrice : item.product.price,
      })),
      totalAmount,
    };

    try {
      await axios.post('/api/orders', orderData);
      await axios.post('/api/whatsapp', orderData);

      clearCart();
      setSuccessMessage('Porosia u vendos me sukses dhe njoftimi u dërgua!');
      setCustomerName('');
      setCustomerLastName('');
      setQyteti('');
      setRruga('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.error('Error placing order or sending WhatsApp message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Header />
     <div className="p-6 mt-5 mb-5 max-w-lg mx-auto bg-white shadow-2xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Kasa</h2>

      {/* Cart Summary */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Shporta Juaj</h3>
        {cart.length === 0 ? (
          <p>Shporta është bosh.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.product._id} className="py-2">
                {item.product.name} - {item.quantity} x{' '}
                {item.product.onSale ? item.product.salePrice : item.product.price} Lek
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Total: {totalAmount} Lek</h4>
        </div>
      </div>

      {successMessage && <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">{successMessage}</div>}

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Emri</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(capitalizeFirstLetter(e.target.value))}
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
            onChange={(e) => setCustomerLastName(capitalizeFirstLetter(e.target.value))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-transform capitalize"
          />
          {errors.customerLastName && <p className="text-red-600">{errors.customerLastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Qyteti</label>
          <input
            type="text"
            value={qyteti}
            onChange={(e) => setQyteti(capitalizeFirstLetter(e.target.value))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-transform capitalize"
          />
          {errors.qyteti && <p className="text-red-600">{errors.qyteti}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rruga</label>
          <input
            type="text"
            value={rruga}
            onChange={(e) => setRruga(capitalizeFirstLetter(e.target.value))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-transform capitalize"
          />
          {errors.rruga && <p className="text-red-600">{errors.rruga}</p>}
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}
        </div>

        <div className="mt-6">
          <button type="submit" className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700" disabled={isSubmitting}>
            {isSubmitting ? 'Duke dërguar...' : 'Konfirmo Porosinë'}
          </button>
        </div>
      </form>
    </div>
    </>
   
  );
};

export default Kasa;
