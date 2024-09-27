import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Edit = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [popular, setPopular] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // Store existing images
  const [newImages, setNewImages] = useState([]); // Store new images selected by the user
  const [removedImages, setRemovedImages] = useState([]); // Track removed images
  const [loading, setLoading] = useState(true);

  // Fetch product data by ID
  useEffect(() => {
    axios
      .get(`/api/product/${_id}`)
      .then((res) => {
        const product = res.data;
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setStock(product.stock);
        setCategory(product.category);
        setPopular(product.popular);
        setExistingImages(product.image || []); // Load existing images
        setLoading(false); 
      })
      .catch((err) => console.log('Error fetching product:', err));
  }, [_id]);

  // Handle file input for new images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prevFiles) => [...prevFiles, ...files]);
  };

  // Remove an existing image
  const handleRemoveExistingImage = (index) => {
    const removed = existingImages[index];
    setRemovedImages((prevRemoved) => [...prevRemoved, removed]); // Track removed image
    setExistingImages(existingImages.filter((_, i) => i !== index)); // Remove from displayed images
  };

  // Remove a newly selected image
  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index)); // Remove from new images array
  };

  // Submit form and send all images (both existing and new) to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
  
      // Append text fields
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('stock', stock);
      formData.append('category', category);
      formData.append('popular', popular);
  
      // Convert existingImages array to a JSON string
      formData.append('existingImages', JSON.stringify(existingImages)); // <-- Stringify the array
  
      // Append new images to the form data
      newImages.forEach((file) => {
        formData.append('image', file);
      });
  
      // Send request to update product
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      await axios.put(`/api/product/${_id}`, formData, config);
  
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-center text-primary-deep mb-8">Edit Product</h1>
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                rows="5"
                required
              ></textarea>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter product price"
                className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                required
              />
            </div>

            {/* Stock */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
              <select
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Select Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
                <option value="Toys">Toys</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Popular */}
            <div className="mb-4 flex items-center">
              <label className="text-gray-700 text-sm font-bold mr-4">Popular</label>
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="p-3 border rounded-md focus:outline-none focus:border-primary-deep"
              />
              <span className="ml-2 text-sm text-gray-700">Mark as Popular</span>
            </div>

            {/* Image upload and existing images display */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep mt-2"
              />

              {/* Display existing images only if no new images are uploaded */}
              {newImages.length === 0 && (
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={`http://localhost:9000/${img}`}
                        className="w-full h-auto rounded-md border border-gray-300"
                        alt={`Existing Product ${index}`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveExistingImage(index);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Display selected new images */}
              <div className="mt-2 grid grid-cols-3 gap-4">
                {newImages.map((file, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-auto rounded-md border border-gray-300"
                      alt={`New Product ${index}`}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveNewImage(index);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-gray-500 w-full text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-colors"
              >
                Update Product
              </button>
              <Link
                to="/dashboard/products"
                className="bg-gray-500 w-full text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors mt-2 inline-block"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
