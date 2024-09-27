import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Meta from "../components/Meta";
import { toast } from "react-toastify";

const Upload = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // Handles multiple files
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [popular, setPopular] = useState('false');


  // Define the handleFileChange function
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handler for product creation
  const handleProductCreation = async () => {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('popular', popular);
    // Append selected images
    selectedFiles.forEach((file) => {
      formData.append('image', file); // Ensure 'photos' matches multer's field name
    });

    try {
      const response = await axios.post('/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success(response.data.message || 'Product created successfully');
      // Reset form fields after successful upload
      setName('');
      setPrice('');
      setDescription('');
      setStock('');
      setCategory('');
      setPopular('false');
      setSelectedFiles([]);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Form submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    handleProductCreation();
  };

  const finalStockStatus = stock ? stock : '';


  const formData = {
    stock: finalStockStatus,
  };


  const finalCategory = category ? category : '';

  const formDataCategory = {
    category: finalCategory,
  };



  return (
    <>
      <Meta title={`${name || "New Product"} - Epic Store`} />
      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl font-bold text-center text-primary-deep mb-8">Add New Product</h1>
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-xl mx-auto">
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter product"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  placeholder="Enter ptoduct description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                  rows="5"
                  required
                ></textarea>
              </div>



              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                <input
                  type="text"
                  placeholder="Enter product price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                <select
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Select Stock Status</option>
                  <option value="in_stock">Ka Stock</option>
                  <option value="out_of_stock">Nuk ka Stock</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <select
                  type="text"
                  placeholder="Enter product Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
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

              <div className="mb-4 flex items-center">
                <label className="text-gray-700 text-sm font-bold mr-4">Popular</label>
                <input
                  type="checkbox"
                  value={popular}
                  onChange={(e) => setPopular(e.target.checked)} // Make sure to use e.target.checked for checkboxes
                  className="p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                />
              </div>


              {/* File input for multiple images */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Images</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep mt-2"
                />
              </div>

              {/* Display selected image previews */}
              {selectedFiles.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Selected Photos:</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="w-full h-auto rounded-md border border-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button type="submit" className="bg-gray-500 w-full text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-colors">
                  Add Product
                </button>
                <Link to="/" className="bg-gray-500 w-full text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors mt-2 inline-block">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;