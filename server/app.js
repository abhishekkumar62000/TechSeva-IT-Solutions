require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const crypto = require('crypto');

const SENDGRID_KEY = process.env.SENDGRID_API_KEY || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'applications.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// ensure uploads and data file exist
(async function ensure(){
  try{ await fs.mkdir(UPLOAD_DIR, { recursive: true }); }catch(e){}
  try{ await fs.access(DATA_FILE); }catch(e){ await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf8'); }
})();

// multer setup
const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, UPLOAD_DIR); },
  filename: function(req, file, cb){ const ext = path.extname(file.originalname); const name = Date.now() + '-' + crypto.randomBytes(4).toString('hex') + ext; cb(null, name); }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Serve uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Create application
app.post('/apply', upload.single('resume'), async (req, res) => {
  try{
    const body = req.body || {};
    const file = req.file;
    // basic required fields
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const role = (body.role || '').trim();
    if(!name || !email || !role) return res.status(400).json({ error: 'missing_required' });

    // generate token
    const token = 'app-' + crypto.randomBytes(6).toString('hex');
    const record = {
      token,
      name,
      email,
      role,
      skills: body.skills || '',
      message: body.message || '',
      quiz: body.quizDetails ? JSON.parse(body.quizDetails) : null,
      resumeFile: file ? path.basename(file.path) : null,
      status: 'Applied',
      history: [{ status: 'Applied', at: new Date().toISOString() }],
      submittedAt: new Date().toISOString()
    };

    // store in JSON file
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const db = JSON.parse(raw || '{}');
    db[token] = record;
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');

    // optional: send notification/email to admin or applicant (SendGrid)
    if(SENDGRID_KEY && SENDER_EMAIL){
      try{
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(SENDGRID_KEY);
        const trackingUrl = `${req.protocol}://${req.get('host')}/applications/${token}`;
        const msgToApplicant = {
          to: email,
          from: SENDER_EMAIL,
          subject: 'Thanks for applying to TechSeva — track your application',
          html: `<p>Hi ${name},</p><p>Thanks for applying for <strong>${role}</strong>. You can track your application here: <a href="${trackingUrl}">${trackingUrl}</a></p>`
        };
        await sgMail.send(msgToApplicant);
        if(ADMIN_EMAIL){
          const msgAdmin = { to: ADMIN_EMAIL, from: SENDER_EMAIL, subject: `New application: ${name} — ${role}`, text: `New application received. Token: ${token}` };
          await sgMail.send(msgAdmin);
        }
      }catch(e){ console.warn('sendgrid error', e && e.message); }
    }

    return res.json({ ok: true, token, url: `/applications/${token}` });
  }catch(err){ console.error(err); return res.status(500).json({ error: 'server_error' }); }
});

// Simple application status page (server-side rendered minimal HTML)
app.get('/applications/:token', async (req, res) => {
  try{
    const t = req.params.token;
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const db = JSON.parse(raw || '{}');
    const rec = db[t];
    if(!rec) return res.status(404).send('<h3>Application not found</h3>');
    // render minimal HTML
    const resumeLink = rec.resumeFile ? `/uploads/${rec.resumeFile}` : '#';
    const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Application ${rec.token}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:18px;color:#1f2937} .card{max-width:760px;margin:12px auto;padding:18px;border-radius:8px;border:1px solid #e6eefb;background:#fff} .k{font-weight:700;color:#111827}</style></head><body><div class="card"><h2>Application status</h2><p><strong>${rec.name}</strong> — ${rec.role}</p><p><strong>Status:</strong> ${rec.status}</p><p><strong>Submitted:</strong> ${rec.submittedAt}</p><p><strong>Resume:</strong> ${rec.resumeFile ? `<a href="${resumeLink}" target="_blank">Download</a>` : 'Not provided'}</p>${rec.quiz? `<h3>Quiz</h3><p>Score: ${rec.quiz.percent || 'N/A'}</p>` : ''}<h4>History</h4><ul>${rec.history.map(h=>`<li>${h.status} — ${h.at}</li>`).join('')}</ul></div></body></html>`;
    res.send(html);
  }catch(e){ console.error(e); res.status(500).send('Server error'); }
});

// JSON API: return application record as JSON (for portal frontend)
app.get('/api/applications/:token', async (req, res) => {
  try{
    const t = req.params.token;
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const db = JSON.parse(raw || '{}');
    const rec = db[t];
    if(!rec) return res.status(404).json({ error: 'not_found' });
    return res.json({ ok: true, application: rec });
  }catch(e){ console.error(e); return res.status(500).json({ error: 'server_error' }); }
});

// Admin: update status for an application (simple key protection via ADMIN_KEY env var)
app.post('/api/applications/:token/status', async (req, res) => {
  try{
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey || '';
    if(process.env.ADMIN_KEY && adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'forbidden' });
    const t = req.params.token;
    const { status } = req.body || {};
    if(!status) return res.status(400).json({ error: 'missing_status' });
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const db = JSON.parse(raw || '{}');
    const rec = db[t];
    if(!rec) return res.status(404).json({ error: 'not_found' });
    rec.status = status;
    rec.history = rec.history || [];
    rec.history.push({ status, at: new Date().toISOString() });
    db[t] = rec;
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
    return res.json({ ok: true, application: rec });
  }catch(e){ console.error(e); return res.status(500).json({ error: 'server_error' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Intern application server running on port', PORT));
