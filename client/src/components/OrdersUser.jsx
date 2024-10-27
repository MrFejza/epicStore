import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OrdersUser() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-2xl rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Historiku i Porosive</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={order._id} className="mb-6 border-b border-gray-300 pb-4">
            <h3 className="text-lg font-semibold">
              Porosia Nr {index + 1}
            </h3>
            <p>
              <span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <h4 className="mt-4 font-semibold">Products:</h4>
            <ul className="list-disc list-inside">
            {order.products.map((product) => (
                        <ProductInfo key={product.productId} product={product} />
                      ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Ju nuk keni kryer asnjë porosi deri tani.</p>
      )}
    </div>
  );
}

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
        Shiko Produktin
      </Link>
    </div>
  );
};


export default OrdersUser;
