import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminHeader from '../components/AdminHeader';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); // State to store the search query
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/product');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const editProduct = (product) => {
    navigate(`/edit/${product._id}`);
  };

  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        await axios.delete(`/api/product/${product._id}`);
        setProducts(prevProducts => prevProducts.filter(p => p._id !== product._id));
        toast.success('Product deleted successfully.');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product.');
      }
    }
  };

  // Filter products based on the search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-xl">Loading products...</p>;
  }

  return (
    <>
      <AdminHeader />
      <div className="container mx-auto p-4">
        
        <h1 className="text-2xl font-bold mb-4 text-center">Menaxhimi i Produkteve</h1>
        <div className="flex justify-start my-8">
            <Link to="/upload">
              <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
                Shto nje Produkt te Ri
              </button>
            </Link>
          </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Kerko per produkt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Sale Price</th>
                  <th className="py-2 px-4 border-b">On Sale</th>
                  <th className="py-2 px-4 border-b">Stock</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Popular</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b">{product.name}</td>
                    <td className="py-2 px-4 border-b">{product.price} Lek</td>
                    <td className="py-2 px-4 border-b">{product.salePrice ? `${product.salePrice} Lek` : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{product.onSale ? 'Po' : 'Jo'}</td>
                    <td className="py-2 px-4 border-b">{product.stock ? 'In Stock' : 'Out of Stock'}</td>
                    <td className="py-2 px-4 border-b">{product.category}</td>
                    <td className="py-2 px-4 border-b">{product.popular ? 'Po' : 'Jo'}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => editProduct(product)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
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

export default ManageProducts;
