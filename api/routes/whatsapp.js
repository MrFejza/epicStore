const express = require('express');
const { sendWhatsAppMessage } = require('../controllers/whatsappController.js');

const router = express.Router();

// POST route to send WhatsApp message when an order is placed
router.post('/', sendWhatsAppMessage);

module.exports = router;
