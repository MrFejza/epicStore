const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

// Use the phone number from the .env file for the website owner
const specificClientNumber = process.env.OWNER_PHONE_NUMBER || 'whatsapp:+355688697389';

exports.sendWhatsAppMessage = async (req, res) => {
  const { customerName, customerLastName, phone, email, qyteti, rruga, products, totalAmount } = req.body;

  try {
    if (!customerName || !customerLastName || !phone || !qyteti || !rruga || !products || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const productDetails = products.map(product =>
      `${product.quantity}x ${product.productName} (${product.price.toFixed(2)} Lek)`
    ).join(', ');

    const message = `
      New Order Placed:
      - Customer: ${customerName} ${customerLastName}
      - Phone: ${phone}
      - Email: ${email || 'N/A'}
      - Qyteti: ${qyteti}
      - Rruga: ${rruga}
      - Total: ${totalAmount.toFixed(2)} Lek
      - Products: ${productDetails}
    `;

    const response = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: specificClientNumber,
      body: message,
    });

    return res.status(200).json({ success: true, message: 'Message sent!', sid: response.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};
