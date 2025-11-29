TechSeva Internship Server

This minimal Express server accepts internship applications, saves resume uploads, generates a tracking token, and persists application data to `applications.json`.

Quick start (Windows PowerShell):

1. Install node dependencies

```powershell
cd 'C:\Users\DELL\Desktop\TechSeva-IT-Solutions-Agency Agency\server'
npm install
```

2. Create a `.env` file in the `server` folder with optional SendGrid settings:

```
PORT=3000
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDER_EMAIL=hello@yourdomain.com
ADMIN_EMAIL=hr@yourdomain.com
```

3. Start the server

```powershell
npm start
```

4. Endpoints
- `GET /health` - simple health check
- `POST /apply` - accepts `multipart/form-data` including `resume` file and form fields. Returns `{ ok: true, token, url }` on success.
- `GET /applications/:token` - small HTML status page for applicant tracking (demo).

Notes
- This server stores uploaded files in `server/uploads` and application data in `server/applications.json`.
- For production, replace file storage with a secure object store (S3), add authentication for the admin dashboard, validate & sanitize inputs, and integrate proper email sending with retries.
