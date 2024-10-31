import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Kasa = () => {
  const { cart, clearCart } = useCart();
  const [userData, setUserData] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [qyteti, setQyteti] = useState('');
  const [rruga, setRruga] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [prefix, setPrefix] = useState('AL'); // Default prefix for Albania
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.quantity * (item.product.onSale ? item.product.salePrice : item.product.price),
    0
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setUserData(null);
        setCustomerName('');
        setCustomerLastName('');
        setQyteti('');
        setRruga('');
        setPhone('');
        setPrefix('AL');
        setEmail('');
        return;
      }

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

  const handleFillFromPanel = (field, value) => {
    if (field === 'customerName') setCustomerName(value);
    else if (field === 'customerLastName') setCustomerLastName(value);
    else if (field === 'qyteti') setQyteti(value);
    else if (field === 'rruga') setRruga(value);
    else if (field === 'phone') setPhone(value.replace(prefix === 'AL' ? '+355' : '+383', ''));
  };

  const handleSaveToPanel = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const saveData = {};

      if (customerName) saveData.firstName = customerName;
      if (customerLastName) saveData.lastName = customerLastName;

      // Update nested structure for homeAddress fields
      if (qyteti || rruga) {
        saveData.homeAddress = {};
        if (qyteti) saveData.homeAddress.qyteti = qyteti;
        if (rruga) saveData.homeAddress.rruga = rruga;
      }

      // Attach prefix with phone if phone is being updated
      if (phone) saveData.phone = (prefix === 'AL' ? '+355' : '+383') + phone;

      await axios.put('/api/auth/update-kasa', saveData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the local state to reflect saved data
      setUserData((prevData) => ({
        ...prevData,
        ...saveData,
        homeAddress: {
          ...prevData.homeAddress,
          ...saveData.homeAddress,  // Spread homeAddress to merge nested fields
        },
      }));

      setSuccessMessage('Të dhënat në panel u ndryshuan me sukses!');
    } catch (error) {
      console.error('Error updating panel data:', error);
    }
};


  const validateForm = () => {
    const newErrors = {};
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
      const token = localStorage.getItem('jwt');
      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
          {['customerName', 'customerLastName', 'qyteti', 'rruga'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field === 'customerName' ? 'Emri' :
                 field === 'customerLastName' ? 'Mbiemri' :
                 field === 'qyteti' ? 'Qyteti' : 'Rruga'}
              </label>
              <input
                type="text"
                value={
                  field === 'customerName' ? customerName :
                  field === 'customerLastName' ? customerLastName :
                  field === 'qyteti' ? qyteti : rruga
                }
                onChange={(e) => {
                  if (field === 'customerName') setCustomerName(e.target.value.trim());
                  else if (field === 'customerLastName') setCustomerLastName(e.target.value.trim());
                  else if (field === 'qyteti') setQyteti(e.target.value.trim());
                  else setRruga(e.target.value.trim());
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {userData && userData[field] && (
                <p
                  onClick={() => handleFillFromPanel(field, userData[field])}
                  className="text-blue-500 text-sm cursor-pointer mt-1"
                >
                  Ploteso nga paneli
                </p>
              )}
              {errors[field] && <p className="text-red-600">{errors[field]}</p>}
            </div>
          ))}

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
                onChange={(e) => setPhone(e.target.value)}
                className="w-2/3 px-3 py-2 border rounded-r-md"
                placeholder={prefix === 'AL' ? 'xx xxx xxxx' : 'xx xxx xxx'}
                required
              />
            </div>
            {userData && userData.phone && (
              <p
                onClick={() => handleFillFromPanel('phone', userData.phone)}
                className="text-blue-500 text-sm cursor-pointer mt-1"
              >
                Ploteso nga paneli
              </p>
            )}
            {errors.phone && <p className="text-red-600">{errors.phone}</p>}
          </div>

          {/* Non-editable email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">{email}</p>
          </div>

          {/* Save/Update panel data button */}
          <div className="mt-6">
            {userData && ( // Check if user is authenticated
              customerName.trim() !== userData.firstName?.trim() ||
              customerLastName.trim() !== userData.lastName?.trim() ||
              qyteti.trim() !== userData.homeAddress?.qyteti?.trim() ||
              rruga.trim() !== userData.homeAddress?.rruga?.trim() ||
              phone.trim() !== (userData.phone || '').replace(prefix === 'AL' ? '+355' : '+383', '').trim()
            ) && (
              <button
                type="button"
                onClick={handleSaveToPanel}
                className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700"
              >
                Ndrysho të dhënat në panel
              </button>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Duke dërguar...' : 'Konfirmo Porosinë'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Kasa;
