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
  });
  const [editedField, setEditedField] = useState(null); // Track which field is being edited

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          qyteti: response.data.homeAddress?.qyteti || '',
          rruga: response.data.homeAddress?.rruga || '',
          phone: response.data.phone || '',
        });
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
    setEditedField(name); // Set the edited field to show the "Ruaj" button
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.put('/api/auth/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((prevUser) => ({
        ...prevUser,
        [field]: formData[field],
        homeAddress: {
          qyteti: formData.qyteti,
          rruga: formData.rruga,
        },
      }));
      setEditedField(null); // Hide the "Ruaj" button after saving
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
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
          {['firstName', 'lastName', 'qyteti', 'rruga', 'phone'].map((field) => (
            <div key={field} className="mb-4">
              <label className="block font-semibold text-gray-700">
                {field === 'firstName' ? 'Emri' :
                 field === 'lastName' ? 'Mbiemri' :
                 field === 'qyteti' ? 'Qyteti' :
                 field === 'rruga' ? 'Rruga' :
                 'Telefoni'}
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
            </div>
          ))}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default AccountDetails;
