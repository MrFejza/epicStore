import express from 'express';
import { 
  createCategory, 
  getAllCategories, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller.js';

const router = express.Router();

// Route for creating a category
router.post('/create', createCategory);

// Route for retrieving all categories
router.get('/', getAllCategories);

// Route for updating a category
router.put('/:id', updateCategory);

// Route for deleting a category
router.delete('/:id', deleteCategory);

export default router;
