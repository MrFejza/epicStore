import express from 'express';
import { signin, signup, checkAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/check-admin', checkAdmin, (req, res) => {
  res.json({ isAdmin: req.user.isAdmin });
});

export default router;
