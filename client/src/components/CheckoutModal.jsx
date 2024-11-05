import { useCheckoutModal } from '../context/CheckoutModalContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutModal = () => {
  const { isCheckoutModalOpen, closeCheckoutModal, checkoutData } = useCheckoutModal();
  const { clearCart } = useCart();
  const { cartItems } = checkoutData;

  const [userData, setUserData] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [qyteti, setQyteti] = useState('');
  const [rruga, setRruga] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [prefix, setPrefix] = useState('AL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) return;

      try {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const phoneNumber = response.data.phone || '';
        const prefix = phoneNumber.startsWith('+383') ? 'KOS' : 'AL';
        const strippedPhone = phoneNumber.replace(/^(\+355|\+383)/, '');

        setUserData(response.data);
        setCustomerName(response.data.firstName || '');
        setCustomerLastName(response.data.lastName || '');
        setQyteti(response.data.homeAddress?.qyteti || '');
        setRruga(response.data.homeAddress?.rruga || '');
        setPhone(strippedPhone);
        setPrefix(prefix);
        setEmail(response.data.email || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!customerName) newErrors.customerName = 'Emri duhet të përmbajë vetëm shkronja.';
    if (!customerLastName) newErrors.customerLastName = 'Mbiemri duhet të përmbajë vetëm shkronja.';
    if (!qyteti.trim()) newErrors.qyteti = 'Ju lutemi shkruani qytetin tuaj.';
    if (!rruga.trim()) newErrors.rruga = 'Ju lutemi shkruani rrugën tuaj.';
    if (!phone) newErrors.phone = 'Numri i telefonit është i detyrueshëm.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only set isSubmitting if form validation passes
    if (!validateForm()) return;

    setIsSubmitting(true);

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
      const token = localStorage.getItem('jwt');
      await Promise.all([
        axios.post('/api/orders', orderData, { headers: { Authorization: `Bearer ${token}` }}),
        axios.post('/api/whatsapp', orderData),
      ]);

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
    isCheckoutModalOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="bg-white w-11/12 md:w-1/3 max-h-[95vh] overflow-y-auto p-6 rounded-lg shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={closeCheckoutModal}
          >
            ✖
          </button>
          <h2 className="text-2xl font-bold mb-4">Kasa</h2>

          <div className="mb-4">
            <h3 className="text-xl font-semibold">Shporta Juaj</h3>
            {cartItems && cartItems.length === 0 ? (
              <p>Shporta është bosh.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product._id} className="py-2">
                    {item.product.name} - {item.quantity} x{' '}
                    {item.product.onSale ? item.product.salePrice : item.product.price} Lek
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <h4 className="text-lg font-semibold">
                Total: {cartItems.reduce((total, item) => total + item.quantity * (item.product.onSale ? item.product.salePrice : item.product.price), 0)} Lek
              </h4>
            </div>
          </div>

          {successMessage && <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">{successMessage}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Emri</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customerName && <p className="text-red-600">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mbiemri</label>
              <input
                type="text"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customerLastName && <p className="text-red-600">{errors.customerLastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Qyteti</label>
              <input
                type="text"
                value={qyteti}
                onChange={(e) => setQyteti(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.qyteti && <p className="text-red-600">{errors.qyteti}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rruga</label>
              <input
                type="text"
                value={rruga}
                onChange={(e) => setRruga(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.rruga && <p className="text-red-600">{errors.rruga}</p>}
            </div>

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
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-2/3 px-3 py-2 border rounded-r-md"
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

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 mt-4"
            >
              Konfirmo Porosinë
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default CheckoutModal;
