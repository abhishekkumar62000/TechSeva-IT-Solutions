/**
 * Simple demo Express server that returns mock aggregated job data.
 *
 * Run: (from the project root)
 *   cd server; npm init -y; npm install express cors
 *   node jobs-api.js
 *
 * This is a demo only. For production, integrate with paid job APIs (Adzuna, Jooble, Indeed/Glassdoor partners)
 * or implement careful server-side scraping with respect to robots.txt and site terms.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Demo route: returns mock aggregated jobs using query params
app.get('/api/demo-jobs', (req, res) => {
  const title = (req.query.title || '').trim();
  const location = (req.query.location || '').trim();

  // In a real aggregator you'd fetch/process multiple sources here.
  // This demo returns deterministic mock results so frontend can be wired up.

  const sampleJobs = [
    { id: 'naukri-1', title: `${title || 'Frontend Developer'}`, company: 'TechSeva', location: location || 'Bangalore', snippet: 'Build responsive web apps using HTML/CSS/JS.', url: 'https://techsevasolutions.com/careers', source: 'Naukri' },
    { id: 'linkedin-1', title: `${title || 'Software Engineer'}`, company: 'Acme Corp', location: location || 'Remote', snippet: 'Full-stack engineer role — Node.js + React.', url: 'https://linkedin.com/jobs/view/1', source: 'LinkedIn' },
    { id: 'indeed-1', title: `${title || 'Data Scientist'}`, company: 'DataWorks', location: location || 'New York', snippet: 'Work on ML models and pipelines.', url: 'https://indeed.com/viewjob?jk=1', source: 'Indeed' }
  ];

  // Filter by title/location if provided (simple text contains)
  const filtered = sampleJobs.filter(j => {
    const matchTitle = !title || j.title.toLowerCase().includes(title.toLowerCase());
    const matchLoc = !location || j.location.toLowerCase().includes(location.toLowerCase());
    return matchTitle && matchLoc;
  });

  // return as JSON
  res.json(filtered);
});

const PORT = process.env.JOBS_PORT || 4001;
app.listen(PORT, () => console.log(`Demo jobs API running on http://localhost:${PORT}/api/demo-jobs`));

// ---- Notes for production integration ----
// 1) Use official job APIs where possible (Adzuna, Jooble, etc.)
// 2) If scraping, run it server-side with proper rate limiting, IP rotation and respect robots.txt.
// 3) Store/cach results and only fetch diffs to avoid frequent scraping.
