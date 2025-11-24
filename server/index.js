// Example Express server to create Razorpay orders.
// 1) Install dependencies: npm install express razorpay dotenv
// 2) Set environment variables: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
// 3) Run: node index.js

require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // allow CORS for local testing; tighten this in production
app.use(bodyParser.json());

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment');
  process.exit(1);
}

const razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

app.post('/create_order', async (req, res) => {
  try {
    const { amount, currency = 'INR', notes = {} } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const options = { amount: amount, currency, receipt: 'rcpt_' + Date.now(), notes };
    const order = await razorpay.orders.create(options);
    // return order object and public key to client
    res.json({ id: order.id, amount: order.amount, currency: order.currency, key: KEY_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'order_creation_failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Razorpay example server running on port', PORT));
