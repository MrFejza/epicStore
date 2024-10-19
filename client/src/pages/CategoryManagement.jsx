import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Track the category being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addInRowIndex, setAddInRowIndex] = useState(null); // Track the index where a new category will be inserted

  // Fetch all categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

// Add a new category and shift the others down
const addCategoryInRow = async (index) => {
  if (newCategoryName.trim() === '') {
    toast.error('Emri i kategorisë nuk mund të jetë bosh.');
    return;
  }

  const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');

  try {
    const response = await axios.post('/api/category/create', { name: newCategoryName, slug, insertAtIndex: index + 1 });
    const newCategory = response.data.category;

    // Insert the new category at the specified index, shifting the others down
    const updatedCategories = [...categories];
    updatedCategories.splice(index, 0, newCategory); // Insert at the specified index (pushing others down)
    setCategories(updatedCategories);

    toast.success('Kategoria u shtua me sukses.');
    setNewCategoryName('');
    setAddInRowIndex(null);  // Close the input field
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Error adding category.');
  }
};

// Add a new category at the bottom
const addCategoryAtBottom = async () => {
  if (newCategoryName.trim() === '') {
    toast.error('Emri i kategorisë nuk mund të jetë bosh.');
    return;
  }

  const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');

  try {
    const response = await axios.post('/api/category/create', { name: newCategoryName, slug, insertAtIndex: categories.length + 1 });
    const newCategory = response.data.category;

    // Add the new category at the bottom of the list
    setCategories([...categories, newCategory]);

    toast.success('Kategoria u shtua në fund me sukses.');
    setNewCategoryName('');
    setIsAdding(false); // Close the input field after adding
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Error adding category.');
  }
};


  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/category/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      toast.success('Kategoria u fshi me sukses.');
    } catch (error) {
      toast.error('Error deleting category.');
    }
  };

  const updateCategory = async (id, updatedName) => {
    if (!updatedName.trim()) {
      toast.error('Emri i kategorisë nuk mund të jetë bosh.');
      return;
    }

    const updatedSlug = updatedName.toLowerCase().replace(/\s+/g, '-');

    try {
      const response = await axios.put(`/api/category/${id}`, { name: updatedName, slug: updatedSlug });
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, name: response.data.updatedCategory.name } : category
        )
      );
      toast.success('Kategoria u përditësua me sukses.');
      setIsEditing(null);
    } catch (error) {
      toast.error('Error updating category.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menaxhimi i Kategorive</h1>

      {categories.length === 0 ? (
        <p className="text-lg text-gray-500 mb-4">Nuk ka asnje kategori</p>
      ) : (
        <ul className="mb-4">
          {categories.map((category, index) => (
            <li key={category._id} className="py-2 px-4 bg-gray-100 mb-2 rounded flex justify-between items-center">
              {isEditing === category._id ? (
                <input
                  type="text"
                  defaultValue={category.name}
                  onBlur={(e) => updateCategory(category._id, e.target.value)}
                  className="px-3 py-2 border rounded"
                />
              ) : (
                <span>{category.name}</span>
              )}
              <div>
                <button
                  className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => setIsEditing(category._id)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Fshij
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setAddInRowIndex(index)}
                >
                  Shto në këtë rresht
                </button>
              </div>

              {/* Display input field to add category in the current row */}
              {addInRowIndex === index && (
                <div className="mt-4 flex w-full">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Shkruani emrin e kategorisë"
                    className="w-full px-3 py-2 border rounded mr-2"
                  />
                  <button
                    onClick={() => addCategoryInRow(index)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Krijo Kategorinë
                  </button>
                  <button
                    onClick={() => setAddInRowIndex(null)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Anulo
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add category at the bottom of the list */}
      {!isAdding && addInRowIndex === null ? (
        <button
          onClick={() => setIsAdding(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Shto krijo një kategori të re
        </button>
      ) : (
        addInRowIndex === null && (
          <div className="mb-4 flex">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Shkruani emrin e kategorisë"
              className="w-full px-3 py-2 border rounded mr-2"
            />
            <button
              onClick={addCategoryAtBottom}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Krijo Kategorinë
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Anulo
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default CategoryManagement;
