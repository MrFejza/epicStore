import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AccountDetails() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    qyteti: '',
    rruga: '',
    phone: '',
    email: '',
    id:""
  });
  const [prefix, setPrefix] = useState('AL'); // Prefix state for country code
  const [editedField, setEditedField] = useState(null); // Track edited fields
  const [errors, setErrors] = useState({}); // Error state for validation

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }, // Use backticks here
        });
  
        // Determine prefix and strip it from the phone number
        const phoneNumber = response.data.phone || '';
        const currentPrefix = phoneNumber.startsWith('+383') ? 'KOS' : 'AL';
        const strippedPhone = phoneNumber.replace(/^(\+355|\+383)/, ''); // Remove prefix
  
        // Set state with stripped phone and determined prefix
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          qyteti: response.data.homeAddress?.qyteti || '',
          rruga: response.data.homeAddress?.rruga || '',
          phone: strippedPhone,  // Set phone without prefix
          email: response.data.email || ''
        });
        setPrefix(currentPrefix); // Set prefix based on number format
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setEditedField(name);
  };

  const handleSave = async (field) => {
    try {

      // console.log('user', user);
      // console.log('formData', formData);

      const token = localStorage.getItem('jwt');
      const saveData = {};
  
      if (field === 'phone') {
        // Attach prefix with phone number only if phone is being updated
        const fullPhone = (prefix === 'AL' ? '+355' : '+383') + formData.phone;
        saveData.phone = fullPhone;
      } else if (field === 'qyteti' || field === 'rruga') {
        // Use nested structure for address fields
        saveData.homeAddress = { [field]: formData[field] };
      } else {
        // Otherwise, just send the changed field
        saveData[field] = formData[field];
      }

      await axios.put('/api/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }, // Use backticks here
      });
  
      // // Reflect the update in both `user` and `formData` states
      setUser((prevUser) => ({
        ...prevUser,
        [field]: saveData[field] || prevUser[field],
        homeAddress: {
          ...prevUser.homeAddress,
          [field]: saveData.homeAddress?.[field] || prevUser.homeAddress?.[field],
        },
        phone: field === 'phone' ? saveData.phone : prevUser.phone, // Update phone if it was edited
      }));
  
      // Reset `formData.phone` without prefix if the phone was updated
      setFormData((prevData) => ({
        ...prevData,
        phone: field === 'phone' ? formData.phone.replace(/^\+355|\+383/, '') : prevData.phone,
      }));
  
      setEditedField(null); // Clear the edited field after saving
      setErrors({}); // Clear any previous errors
    } catch (error) {
      console.error(`Error updating ${field}:`, error); // Use backticks here
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: 'Error updating field', // Update with a specific error message if needed
      }));
    }
  };
  
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-2xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Detajet e Llogarisë</h2>
      {user ? (
        <div>
          {/* Display Username as read-only */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Username:</label>
            <p className="border border-gray-300 rounded p-2 bg-gray-100">{user.username}</p>
          </div>

          {/* Display Email as read-only */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Email:</label>
            <p className="border border-gray-300 rounded p-2 bg-gray-100">{user.email}</p>
          </div>

          {/* Editable fields for each profile detail */}
          {['firstName', 'lastName', 'qyteti', 'rruga'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block font-semibold text-gray-700">
                {field === 'firstName' ? 'Emri' :
                 field === 'lastName' ? 'Mbiemri' :
                 field === 'qyteti' ? 'Qyteti' : 'Rruga'}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full"
              />
              {editedField === field && (
                <button
                  onClick={() => handleSave(field)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Ruaj
                </button>
              )}
              {/* Display error message for each field if it exists */}
              {errors[field] && <p className="text-red-600">{errors[field]}</p>}
            </div>
          ))}

          {/* Phone number with prefix */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Numri i telefonit</label>
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border rounded-r-md"
                placeholder={prefix === 'AL' ? 'xx xxx xxxx' : 'xx xxx xxx'}
              />
            </div>
            {editedField === 'phone' && (
              <button
                onClick={() => handleSave('phone')}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Ruaj
              </button>
            )}
            {/* Display error message for phone if it exists */}
            {errors.phone && <p className="text-red-600">{errors.phone}</p>}
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default AccountDetails;
