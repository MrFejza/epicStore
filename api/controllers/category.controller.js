import Category from '../models/category.model.js';

// Create a new category
export const createCategory = async (req, res) => {
  const { name, slug, insertAtIndex } = req.body;

  if (!name || slug === undefined) {
    return res.status(400).json({ error: 'Category name and slug are required' });
  }

  try {
    // Update order of existing categories after the insert position
    await Category.updateMany({ order: { $gte: insertAtIndex } }, { $inc: { order: 1 } });

    // Create the new category with the specified order
    const category = new Category({ name, slug, order: insertAtIndex });
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 }); // Sort by order (ascending)
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Category ID from request
    const { name, slug } = req.body; // New name and slug for the category

    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    // Find and update the category (using both name and slug)
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category updated successfully.', updatedCategory });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};


// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the category
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};
