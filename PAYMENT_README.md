Razorpay Integration (Example)

This project includes a simple example server to create Razorpay orders. Do NOT store your Razorpay secret key in client-side code or commit it to version control.

Steps to run the example server (Node.js):

1. Install Node.js (if not installed).
2. Change directory to `server` and install dependencies:

```powershell
cd 'C:\Users\DELL\Desktop\TechSeva-IT-Solutions-main\server'
npm init -y
npm install express razorpay dotenv body-parser
```

3. Create a `.env` file in `server/` with your keys (do not commit):

```
RAZORPAY_KEY_ID=rzp_live_Ri0GsLreivAUvY
RAZORPAY_KEY_SECRET=REPLACE_WITH_YOUR_SECRET
```

4. Run the server:

```powershell
node index.js
```

5. From the frontend, the code calls `/create_order` to create an order and then opens Razorpay Checkout with the returned `order.id`.

Notes:
- Always keep `RAZORPAY_KEY_SECRET` on the server only.
- After payment, verify the signature on your server to ensure payment integrity.
- For production, serve the frontend and server over HTTPS and secure the endpoints.
