import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders'); // Update with your actual backend route
        const sortedOrders = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort by createdAt (oldest to newest)
        setOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to fetch the product name by ID
  const fetchProductName = async (productId) => {
    try {
      const response = await axios.get(`/api/product/${productId}`);
      return response.data.name; // Assuming the product name is returned as { name: 'Product Name' }
    } catch (error) {
      console.error('Failed to fetch product name:', error);
      return 'Unknown Product'; // Fallback if the product name cannot be fetched
    }
  };

  // Function to remove an order (when "Dërguar" is clicked)
  const handleOrderDelivered = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`); // Assuming the DELETE route exists in your backend
      setOrders(orders.filter(order => order._id !== orderId)); // Remove the order from the list
    } catch (error) {
      console.error('Failed to remove order:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Address</th> {/* New Address Column */}
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Products</th>
                <th className="py-2 px-4 border-b">Order Date</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">{order.customerName} {order.customerLastName}</td>
                  <td className="py-2 px-4 border-b">{order.phone}</td>
                  <td className="py-2 px-4 border-b">{order.email || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.address || 'N/A'}</td> {/* Display address */}
                  <td className="py-2 px-4 border-b">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {order.products.map((product) => (
                      <ProductInfo key={product.productId} product={product} />
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleOrderDelivered(order._id)}
                    >
                      Dërguar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ProductInfo component to fetch and display product name, quantity, and price
const ProductInfo = ({ product }) => {
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      const name = await fetchProductName(product.productId);
      setProductName(name);
    };
    fetchName();
  }, [product.productId]);

  const fetchProductName = async (productId) => {
    try {
      const response = await axios.get(`/api/product/${productId}`);
      return response.data.name; // Assuming the product name is returned as { name: 'Product Name' }
    } catch (error) {
      console.error('Failed to fetch product name:', error);
      return 'Unknown Product'; // Fallback if the product name cannot be fetched
    }
  };

  return (
    <div className="mb-2">
      {/* Display product name */}
      <p><strong>Product Name:</strong> {productName}</p>
      {/* Display quantity and price */}
      <p>
        <strong>Quantity:</strong> {product.quantity}, 
        <strong> Price:</strong> ${product.price.toFixed(2)}
      </p>
      {/* Link to the product information page */}
      <Link 
        to={`/information/${product.productId}`} 
        className="text-blue-500 hover:underline"
      >
        View Product Information
      </Link>
    </div>
  );
};

export default Orders;
