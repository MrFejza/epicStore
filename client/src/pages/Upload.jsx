import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Meta from "../components/Meta";
import { toast } from "react-toastify";

const Upload = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [onSale, setOnSale] = useState(false);
  const [saleEndDate, setSaleEndDate] = useState('');  // New state for sale end date
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [popular, setPopular] = useState(false);
  const [categories, setCategories] = useState([]);  // New state for storing fetched categories
  const [loadingCategories, setLoadingCategories] = useState(true);  // Loading state for categories
  const [errorCategories, setErrorCategories] = useState('');  // Error state for fetching categories

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');  // Update the API endpoint accordingly
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (error) {
        setErrorCategories('Failed to load categories');
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleProductCreation = async () => {
    // Frontend validation for salePrice
    if (onSale) {
      if (!salePrice) {
        toast.error('Ju lutemi vendosni çmimin e ofertës kur produkti është në ofertë.');
        return;
      }
      if (parseFloat(salePrice) >= parseFloat(price)) {
        toast.error('Çmimi i ofertës duhet të jetë më i vogël se çmimi origjinal.');
        return;
      }

      // Validate that saleEndDate is in the future
      if (saleEndDate && new Date(saleEndDate) <= new Date()) {
        toast.error('Data e përfundimit të ofertës duhet të jetë në të ardhmen.');
        return;
      }
    }

    // Ensure stock is selected
    if (!stock) {
      toast.error('Ju lutemi zgjidhni statusin e gjendjes për produktin.');
      return;
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);

    if (onSale && salePrice) {
      formData.append('salePrice', salePrice);
    }

    formData.append('onSale', onSale);  // Ensures onSale is a boolean
    formData.append('description', description);

    // Convert stock to boolean
    formData.append('stock', stock === 'in_stock');  // Ensures stock is true/false

    formData.append('category', category);
    formData.append('popular', popular);  // Ensures popular is a boolean

    selectedFiles.forEach((file) => {
      formData.append('image', file);
    });

    // Append saleEndDate if the product is on sale and saleEndDate is set
    if (onSale && saleEndDate) {
      formData.append('saleEndDate', saleEndDate);
    }

    try {
      const response = await axios.post('/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success(response.data.message || 'Produkti u krijua me sukses');
      // Reset the form after successful product creation
      setName('');
      setPrice('');
      setSalePrice('');
      setOnSale(false);
      setSaleEndDate('');  // Reset saleEndDate
      setDescription('');
      setStock('in_stock');  // Reset stock to default
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
      <Meta title={`${name || 'New Product'} - Epic Store`} />
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
                  onChange={(e) => setDescription(e.target.value)}
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
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Çmimi i Ofertës</label>
                    <input
                      type="number"
                      placeholder="Vendos çmimin e ofertës"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Data dhe Ora e Përfundimit të Ofertës</label>
                    <input
                      type="datetime-local"
                      value={saleEndDate}
                      onChange={(e) => setSaleEndDate(e.target.value)}
                      className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                    />
                  </div>
                </>
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
                  {/* Dynamically load categories */}
                  {loadingCategories ? (
                    <option value="">Loading categories...</option>
                  ) : errorCategories ? (
                    <option value="">{errorCategories}</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>{cat.name}</option>
                    ))
                  )}
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
                          alt={`preview - ${index}`}
                          className="w-full h-auto rounded-md border border-gray-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-gray-500 w-full text-white font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Shto Produktin
                </button>
                <Link
                  to="/"
                  className="bg-gray-500 w-full text-white font-bold py-3 px-6 rounded-md hover:bg-gray-700 transition-colors mt-2 inline-block"
                >
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
