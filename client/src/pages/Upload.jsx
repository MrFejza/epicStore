import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Meta from "../components/Meta";
import { toast } from "react-toastify";

const Upload = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState(''); // State for sale price
  const [onSale, setOnSale] = useState(false); // State for onSale
  const [description, setDescription] = useState(''); // Keep line breaks in the description
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [popular, setPopular] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle form submission
  const handleProductCreation = async () => {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);
    
    // Only append salePrice if the product is on sale
    if (onSale && salePrice) {
      formData.append('salePrice', salePrice);
    }
    
    formData.append('onSale', onSale); // Append onSale as boolean
    formData.append('description', description); // Append description with line breaks
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('popular', popular); // Send as boolean

    selectedFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post('/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success(response.data.message || 'Product created successfully');
      // Reset form after successful product creation
      setName('');
      setPrice('');
      setSalePrice('');
      setOnSale(false);
      setDescription('');
      setStock('');
      setCategory('');
      setPopular(false);
      setSelectedFiles([]);
      navigate('/'); // Redirect after creation
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Form submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    handleProductCreation();
  };

  return (
    <>
      <Meta title={`${name || "New Product"} - Epic Store`} />
      <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-4xl font-bold text-center text-primary-deep mb-8">Shto nje Produkt te ri</h1>
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-xl mx-auto">
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Emri</label>
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
                <label className="block text-gray-700 text-sm font-bold mb-2">Pershkrimi</label>
                <textarea
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} // No trimming for preserving new lines
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Cmimi</label>
                <input
                  type="text"
                  placeholder="Enter product price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                  required
                />
              </div>

              {/* Sale Price Input */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Në Oferte</label>
                <input
                  type="checkbox"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="mr-2"
                />
                <span>Oferte</span>
              </div>

              {onSale && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Sale Price</label>
                  <input
                    type="text"
                    placeholder="Enter sale price"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                    required={onSale} // Make required only if on sale
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Gjendje</label>
                <select
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="">Zgjidh statusin e Gjendjes</option>
                  <option value="in_stock">Ka Gjendje</option>
                  <option value="out_of_stock">Nuk ka Gjendje</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Kategoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                  required
                >
                  <option value="">Zgjidh Kategorine</option>
                  <option value="Electronics">Elektrike</option>
                  <option value="Clothing">Rroba</option>
                  <option value="Books">Libra</option>
                  <option value="Home">Shtepi</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sport</option>
                  <option value="Toys">Lodra</option>
                  <option value="Food">Ushqim</option>
                  <option value="Other">Tjeter</option>
                </select>
              </div>

              <div className="mb-4 flex items-center">
                <label className="text-gray-700 text-sm font-bold mr-4">Shume e Blere</label>
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                />
              </div>

              {/* File input for multiple images */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Imazhe</label>
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
                  <h2 className="text-lg font-semibold mb-2">Fotot e zgjedhura:</h2>
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
                  Shto Produktin
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
