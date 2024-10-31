import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Header from '../components/Header';
import Panel from '../components/Panel';
import Orders from '../components/OrdersUser';
import AccountDetails from '../components/AccountDetails';

const LogariaIme = () => {
  const [activeTab, setActiveTab] = useState('Paneli');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state for user data fetch
  const navigate = useNavigate();  // For redirecting the user

  // Fetch the user data from the backend when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwt");

      // If no token, redirect to login
      if (!token) {
        navigate('/login');
        return;
      }
    
      try {
        const res = await fetch('/api/auth/me', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        const data = await res.json();
       
        
        
        if (res.ok) {
          setUser(data); // Store the user data
          setLoading(false);  // Set loading to false once data is fetched
        } else {
          // If unauthorized or token invalid, redirect to login
          localStorage.removeItem("jwt");
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem("jwt"); // Clear token on error
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchUserData();
  }, [navigate]);

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Paneli':
        return <Panel user={user} />;
      case 'Porositë':
        return <Orders />;
      case 'Detajet e Llogarise':
        return <AccountDetails />;
      default:
        return <Panel user={user} />;
    }
  };

  // Show a loading message while fetching data
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-6">
          <p>Loading user data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600">
          <a href="/">Kreu</a> &gt; <span className="font-semibold">Llogaria Ime</span>
        </nav>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mt-4">
          <button
            onClick={() => setActiveTab('Paneli')}
            className={`px-4 py-2 ${activeTab === 'Paneli' ? 'border-red-500 border-b-2 text-red-500' : 'text-gray-500'}`}
          >
            Paneli
          </button>
          <button
            onClick={() => setActiveTab('Porositë')}
            className={`px-4 py-2 ${activeTab === 'Porositë' ? 'border-red-500 border-b-2 text-red-500' : 'text-gray-500'}`}
          >
            Porositë
          </button>
          <button
            onClick={() => setActiveTab('Detajet e Llogarise')}
            className={`px-4 py-2 ${activeTab === 'Detajet e Llogarise' ? 'border-red-500 border-b-2 text-red-500' : 'text-gray-500'}`}
          >
            Detajet e Llogarise
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default LogariaIme;
