import express from 'express';
import { sendWhatsAppMessage } from '../controllers/whatsappController.js';

const router = express.Router();

// POST route to send WhatsApp message when an order is placed
router.post('/send', sendWhatsAppMessage);

export default router;
