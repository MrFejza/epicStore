import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Edit = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [onSale, setOnSale] = useState(false);
  const [saleEndDate, setSaleEndDate] = useState(''); // New state for sale end date
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [popular, setPopular] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product data by ID
  useEffect(() => {
    axios
      .get(`/api/product/${_id}`)
      .then((res) => {
        const product = res.data;
        setName(product.name);
        setPrice(product.price);
        setSalePrice(product.salePrice || '');
        setOnSale(product.onSale || false);
        setSaleEndDate(product.saleEndDate ? new Date(product.saleEndDate).toISOString().slice(0, 16) : ''); // Handle date formatting
        setDescription(product.description);
        setStock(product.stock ? 'in_stock' : 'out_of_stock');
        setCategory(product.category);
        setPopular(product.popular);
        setExistingImages(product.image || []);
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
    setRemovedImages((prevRemoved) => [...prevRemoved, removed]);
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Remove a newly selected image
  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Submit form and send all images (both existing and new) to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Frontend validation for salePrice and stock
    if (onSale && (!salePrice || parseFloat(salePrice) >= parseFloat(price))) {
      toast.error('Çmimi i ofertës duhet të jetë më i vogël se çmimi origjinal.');
      return;
    }
  
    if (onSale && saleEndDate && new Date(saleEndDate) <= new Date()) {
      toast.error('Data e përfundimit të ofertës duhet të jetë në të ardhmen.');
      return;
    }
  
    if (!stock) {
      toast.error('Ju lutemi zgjidhni statusin e gjendjes për produktin.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      if (onSale && salePrice) {
        formData.append('salePrice', salePrice);
      }
      formData.append('onSale', onSale);
      formData.append('description', description);
      formData.append('stock', stock === 'in_stock');  // Convert to boolean
      formData.append('category', category);
      formData.append('popular', popular);
  
      // Append saleEndDate if the product is on sale and saleEndDate is set
      if (onSale && saleEndDate) {
        formData.append('saleEndDate', saleEndDate);
      }
  
      // Append images and send the request
      formData.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach((file) => {
        formData.append('image', file);
      });
  
      await axios.put(`/api/product/${_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      toast.success('Produkti u përditësua me sukses');
      navigate(-1);  // Go back to the previous page
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
        <h1 className="text-4xl font-bold text-center text-primary-deep mb-8">Edit Produktin</h1>
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Emri</label>
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
              <label className="block text-gray-700 text-sm font-bold mb-2">Pershkrimi</label>
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
              <label className="block text-gray-700 text-sm font-bold mb-2">Cmimi</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter product price"
                className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
                required
              />
            </div>

            {/* Sale Price */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Në Oferte</label>
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
                className="mr-2"
              />
              <span>On Sale</span>
            </div>

            {onSale && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Çmimi i Ofertës</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Enter sale price"
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep"
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

            {/* Stock */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Gjendje</label>
              <select
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Zgjidh statusin e Gjendjes</option>
                <option value="in_stock">Ka Gjendje</option>
                <option value="out_of_stock">Nuk ka Gjendje</option>
              </select>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Kategoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Zgjidh Kategorine</option>
                <option value="ProduktePerFemije">Produkte për Fëmijë</option>
                <option value="ElektronikeAksesore">Elektronikë dhe Aksesorë</option>
                <option value="ShtepiJetese">Shtëpi dhe Jetesë</option>
                <option value="ZyreTeknologji">Zyrë dhe Teknologji</option>
                <option value="SportAktivitet">Sport dhe Aktivitet në Natyrë</option>
                <option value="KuzhineUshqim">Kuzhinë dhe Ushqim</option>
                <option value="FestaEvente">Festa dhe Evente</option>
                <option value="Motorra">Motorra</option>
                <option value="Kafshë">Kafshë</option>
              </select>
            </div>

            {/* Popular */}
            <div className="mb-4 flex items-center">
              <label className="text-gray-700 text-sm font-bold mr-4">Shume e Blere</label>
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="p-3 border rounded-md focus:outline-none focus:border-primary-deep"
              />
              <span className="ml-2 text-sm text-gray-700">Perzgjedhe si shume e shitur</span>
            </div>

            {/* Image upload and existing images display */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Imazhe</label>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="w-full p-3 border rounded-md focus:outline-none focus:border-primary-deep mt-2"
              />

              {/* Display existing images */}
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
                Perditso Produktin
              </button>
              <Link
                to=".."
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
