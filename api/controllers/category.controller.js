import Category from '../models/category.model.js';

export const normalizeCategoryOrder = async (req, res) => {
  try {
    // Find all categories sorted by the current `order` field
    const categories = await Category.find().sort({ order: 1 });

    // Reassign `order` values sequentially starting from 1
    for (let i = 0; i < categories.length; i++) {
      categories[i].order = i + 1;
      await categories[i].save();
    }

    res.status(200).json({ message: 'Category order normalized successfully' });
  } catch (error) {
    console.error("Error normalizing category order:", error);
    res.status(500).json({ error: 'Failed to normalize category order' });
  }
};


// Create a new category
export const addCategoryToEnd = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || slug === undefined) {
    return res.status(400).json({ error: 'Category name and slug are required' });
  }

  try {
    // Find the maximum order value in the categories collection
    const maxOrderCategory = await Category.findOne().sort({ order: -1 });
    const newOrder = maxOrderCategory ? maxOrderCategory.order + 1 : 1; // If no categories exist, start with order 1

    // Create the new category with the next order value
    const category = new Category({ name, slug, order: newOrder });
    await category.save();

    res.status(201).json({ message: 'Category added at the end successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Controller to insert a category at a specified index
export const insertCategoryAtIndex = async (req, res) => {
  const { name, slug, insertAtIndex } = req.body;

  if (!name || slug === undefined || insertAtIndex === undefined) {
    return res.status(400).json({ error: 'Category name, slug, and insert index are required' });
  }

  

  try {
    // Retrieve categories with order >= insertAtIndex, sorted in ascending order
    const categoriesToShift = await Category.find({ order: { $gte: insertAtIndex } }).sort({ order: 1 });

    // Shift categories down by incrementing the order, from last to first to avoid conflicts
    for (let i = categoriesToShift.length - 1; i >= 0; i--) {
      categoriesToShift[i].order += 1;
      await categoriesToShift[i].save();
    }

    // Now create the new category with the specified insertAtIndex
    const newCategory = new Category({ name, slug, order: insertAtIndex });
    await newCategory.save();

    res.status(201).json({ message: 'Category inserted at specified index successfully', category: newCategory });
  } catch (error) {
    console.error("Error in insertCategoryAtIndex:", error);
    res.status(500).json({ error: 'Server error' });
  }
};




// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories sorted by order
    const categories = await Category.find({}).sort({ order: 1 });

    // Check if orders are sequential; if not, normalize them
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].order !== i + 1) {
        // Normalize the order values
        for (let j = 0; j < categories.length; j++) {
          categories[j].order = j + 1;
          await categories[j].save();
        }
        break;
      }
    }

    // Send the sorted and normalized categories
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error in getAllCategories:', error);
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