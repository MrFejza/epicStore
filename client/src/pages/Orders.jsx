import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../components/AdminHeader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders'); // Make sure to actually fetch the orders
        const pendingOrders = response.data.filter(order => order.status === 'Pending'); // Filter for pending orders
        const sortedOrders = pendingOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Function to update order status to "Delivered"
  const handleOrderDelivered = async (orderId) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { status: 'Delivered' });
      if (response.status === 200) {
        // Remove the delivered order from the state
        setOrders(orders.filter(order => order._id !== orderId));
      } 
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <AdminHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Pending Orders</h1>
        {orders.length === 0 ? (
          <p>No pending orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Customer</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Address</th>
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
                    <td className="py-2 px-4 border-b">
                      {order.qyteti}, {order.rruga || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">{order.totalAmount.toFixed(2)} Lek</td>
                    <td className="py-2 px-4 border-b">
                      {order.products.map((product) => (
                        <ProductInfo key={product.productId} product={product} />
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      {order.status !== 'Delivered' && (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          onClick={() => handleOrderDelivered(order._id)}
                        >
                          Dërguar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
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
      return 'Unknown Product';
    }
  };

  return (
    <div className="mb-2">
      <p><strong>Emri i Produktit:</strong> {productName}</p>
      <p><strong>Sasia:</strong> {product.quantity}, <strong>Cmimi:</strong> {product.price.toFixed(2)} Lek</p>
      <Link to={`/information/${product.productId}`} className="text-blue-500 hover:underline">
        View Product Information
      </Link>
    </div>
  );
};

export default Orders;
