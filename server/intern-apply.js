// Simple Express endpoint to accept internship applications (example)
// Usage:
// 1) npm init -y
// 2) npm install express multer cors body-parser
// 3) node intern-apply.js
// This naive example saves metadata to server/applications.json and files to server/uploads/

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9\-]/ig, '_');
    cb(null, name + '_' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE = path.join(__dirname, 'applications.json');
function appendApplication(obj){
  let arr = [];
  try{ if(fs.existsSync(DB_FILE)){ arr = JSON.parse(fs.readFileSync(DB_FILE,'utf8')||'[]'); } }catch(e){}
  arr.push(obj);
  fs.writeFileSync(DB_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

app.post('/apply', upload.single('resume'), (req, res) => {
  try{
    const body = req.body || {};
    const file = req.file;
    const entry = {
      id: 'app_' + Date.now(),
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      role: body.role || '',
      college: body.college || '',
      degree: body.degree || '',
      semester: body.semester || '',
      linkedin: body.linkedin || '',
      portfolio: body.portfolio || '',
      skills: body.skills || '',
      availability: body.availability || '',
      message: body.message || '',
      consent: !!body.consent,
      quizScore: body.quizScore || null,
      receivedAt: new Date().toISOString(),
      resumePath: file ? file.path : null
    };
    appendApplication(entry);
    // In production: send email to admins, store in DB, scan file for viruses, etc.
    res.json({ ok: true, id: entry.id });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, error: 'server_error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Intern apply endpoint listening on port', PORT));
