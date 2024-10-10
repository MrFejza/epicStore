import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken =  process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// Use the phone number from the .env file for the website owner 
const specificClientNumber = process.env.OWNER_PHONE_NUMBER || 'whatsapp:+355688697389';

export const sendWhatsAppMessage = async (req, res) => {
  const { customerName, customerLastName, phone, email, address, products, totalAmount } = req.body;

  try {
    // Ensure all required fields are present
    if (!customerName || !customerLastName || !phone || !address || !products || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Format the product details
    const productDetails = products.map(product =>
      `${product.quantity}x ${product.productName} (${product.price.toFixed(2)} Lek)`
    ).join(', ');

    // Format the message to be sent via WhatsApp
    const message = `
      New Order Placed:
      - Customer: ${customerName} ${customerLastName}
      - Phone: ${phone}
      - Email: ${email || 'N/A'}
      - Address: ${address}
      - Total: $${totalAmount.toFixed(2)}
      - Products: ${productDetails}
    `;

    // Send the WhatsApp message using Twilio's API
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886',  // Twilio sandbox number for WhatsApp
      to: specificClientNumber,        // Send to the hardcoded owner's WhatsApp number
      body: message,                   // Message body with order details
    });

    return res.status(200).json({ success: true, message: 'Message sent!', sid: response.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};