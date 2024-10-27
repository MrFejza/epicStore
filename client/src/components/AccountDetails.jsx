import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AccountDetails() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    qyteti: '',
    rruga: '',
  });

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt'); // Retrieve token from local storage
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
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save updated user details
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwt');
      await axios.put('/api/auth/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser((prevUser) => ({
        ...prevUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        homeAddress: {
          qyteti: formData.qyteti,
          rruga: formData.rruga,
        },
      }));
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-2xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Detajet e Llogarisë</h2>
      {user ? (
        <div>
          {/* Display read-only fields for Username and Email */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Username:</label>
            <p className="border border-gray-300 rounded p-2 bg-gray-100">{user.username}</p>
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Email:</label>
            <p className="border border-gray-300 rounded p-2 bg-gray-100">{user.email}</p>
          </div>

          {/* Editable Fields for Account Details */}
          {isEditing ? (
            <>
              <div className="mb-4">
                <label className="block font-semibold text-gray-700">Emri:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-gray-700">Mbiemri:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-gray-700">Qyteti:</label>
                <input
                  type="text"
                  name="qyteti"
                  value={formData.qyteti}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-gray-700">Rruga:</label>
                <input
                  type="text"
                  name="rruga"
                  value={formData.rruga}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="mb-2"><span className="font-semibold">Emri:</span> {user.firstName}</p>
              <p className="mb-2"><span className="font-semibold">Mbiemri:</span> {user.lastName}</p>
              <p className="mb-2"><span className="font-semibold">Qyteti:</span> {user.homeAddress?.qyteti}</p>
              <p className="mb-2"><span className="font-semibold">Rruga:</span> {user.homeAddress?.rruga}</p>
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Edit
              </button>
            </>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default AccountDetails;
