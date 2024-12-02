const Category = require('../models/category.model.js');

exports.normalizeCategoryOrder = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });

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

exports.addCategoryToEnd = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || slug === undefined) {
    return res.status(400).json({ error: 'Category name and slug are required' });
  }

  try {
    const maxOrderCategory = await Category.findOne().sort({ order: -1 });
    const newOrder = maxOrderCategory ? maxOrderCategory.order + 1 : 1;

    const category = new Category({ name, slug, order: newOrder });
    await category.save();

    res.status(201).json({ message: 'Category added at the end successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.insertCategoryAtIndex = async (req, res) => {
  const { name, slug, insertAtIndex } = req.body;

  if (!name || slug === undefined || insertAtIndex === undefined) {
    return res.status(400).json({ error: 'Category name, slug, and insert index are required' });
  }

  try {
    const categoriesToShift = await Category.find({ order: { $gte: insertAtIndex } }).sort({ order: 1 });

    for (let i = categoriesToShift.length - 1; i >= 0; i--) {
      categoriesToShift[i].order += 1;
      await categoriesToShift[i].save();
    }

    const newCategory = new Category({ name, slug, order: insertAtIndex });
    await newCategory.save();

    res.status(201).json({ message: 'Category inserted at specified index successfully', category: newCategory });
  } catch (error) {
    console.error("Error in insertCategoryAtIndex:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 });

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].order !== i + 1) {
        for (let j = 0; j < categories.length; j++) {
          categories[j].order = j + 1;
          await categories[j].save();
        }
        break;
      }
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

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

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
};
