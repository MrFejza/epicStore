const express = require('express');
const { 
  addCategoryToEnd, 
  insertCategoryAtIndex, 
  getAllCategories, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category.controller.js');

const router = express.Router();

// Route for adding a category at the end
router.post('/add-to-end', addCategoryToEnd);

// Route for inserting a category at a specified index
router.post('/insert-at-index', insertCategoryAtIndex);

// Route for retrieving all categories
router.get('/', getAllCategories);

// Route for updating a category
router.put('/:id', updateCategory);

// Route for deleting a category
router.delete('/:id', deleteCategory);

module.exports = router;
