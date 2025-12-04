Job Portal demo — how to run

This folder contains a small demo API that returns mock job results to help wire the frontend in `job-portal.html`.

Run the demo server (Windows PowerShell):

cd 'C:\Users\DELL\Desktop\TechSeva-IT-Solutions-Agency Agency\server'

npm init -y
npm install express cors
node jobs-api.js

Open `job-portal.html` in a browser (or serve the repository with a static server). The frontend will call `http://localhost:4001/api/demo-jobs`.

Important production notes:
- Many job boards (LinkedIn, Indeed, Naukri, Glassdoor) have rate limits and Terms of Service that disallow unauthorized scraping.
- For reliable production use, integrate with official job APIs or aggregator services (Adzuna, Jooble, CareerJet) or partner programs.
- If scraping, perform it server-side, respect robots.txt, implement caching, rate limits and proper legal review.
