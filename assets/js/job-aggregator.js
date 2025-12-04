// Job Aggregator frontend (demo)
// - Fetches from a demo backend endpoint at /api/demo-jobs
// - Stores/simple personalized alerts in localStorage

(function(){
  const searchBtn = document.getElementById('searchBtn');
  const searchTitle = document.getElementById('searchTitle');
  const searchLocation = document.getElementById('searchLocation');
  const aggregatedResults = document.getElementById('aggregatedResults');
  const saveAlert = document.getElementById('saveAlert');
  const alertEmail = document.getElementById('alertEmail');
  const clearAlerts = document.getElementById('clearAlerts');

  const ALERTS_KEY = 'techseva_job_alerts';
  const KNOWN_IDS_KEY = 'techseva_job_seen_ids';

  function setLoading(on){ aggregatedResults.innerHTML = on ? '<p class="text">Searching jobs…</p>' : ''; }

  async function searchJobs(q, location){
    setLoading(true);
    try{
      const params = new URLSearchParams({ title: q||'', location: location||'' });

      // Try a couple of endpoints (localhost demo server, then relative path)
      const endpoints = [
        'http://localhost:4001/api/demo-jobs',
        (window.location.origin || '') + '/api/demo-jobs'
      ];

      for(const ep of endpoints){
        try{
          const res = await fetch(ep + '?' + params.toString(), { mode: 'cors' });
          if(res.ok){
            const data = await res.json();
            renderResults(data);
            setLoading(false);
            return data;
          }
        }catch(e){
          // continue to next endpoint
        }
      }

      // Fallback: built-in mock data so the UI always shows something even without a server
      const builtIn = getBuiltinMock(q, location);
      renderResults(builtIn);
      setLoading(false);
      return builtIn;
    }catch(err){
      setLoading(false);
      aggregatedResults.innerHTML = '<p class="text">Unable to fetch jobs. Showing local demo results.</p>';
      console.error(err);
      const builtIn = getBuiltinMock(q, location);
      renderResults(builtIn);
      return builtIn;
    }
  }

  // Simple built-in mock data generator (used when no API available)
  function getBuiltinMock(q, location){
    const now = Date.now();
    const base = [
      { id: `mock-1-${now}`, title: q || 'Frontend Developer', company: 'TechSeva', location: location || 'Bangalore', snippet: 'Build responsive web applications using React/HTML/CSS.', url: 'https://techsevasolutions.com/careers', source: 'Aggregated' },
      { id: `mock-2-${now}`, title: q || 'Software Engineer', company: 'Acme Corp', location: location || 'Remote', snippet: 'Work on backend services, Node.js/Express.', url: '#', source: 'Aggregated' },
      { id: `mock-3-${now}`, title: q || 'Data Scientist', company: 'DataWorks', location: location || 'New York', snippet: 'Build ML models and data pipelines.', url: '#', source: 'Aggregated' }
    ];

    // simple filter by text
    const tq = (q || '').toLowerCase();
    const tl = (location || '').toLowerCase();
    return base.filter(j => {
      const matchTitle = !tq || j.title.toLowerCase().includes(tq) || (j.company||'').toLowerCase().includes(tq);
      const matchLoc = !tl || j.location.toLowerCase().includes(tl);
      return matchTitle && matchLoc;
    });
  }

  function renderResults(jobs){
    if(!jobs || !jobs.length){ aggregatedResults.innerHTML = '<p class="text">No jobs found for this query.</p>'; return; }
    aggregatedResults.innerHTML = jobs.map(j=>`
      <div style="margin-bottom:12px;padding:12px;border-radius:8px;background:#fff;box-shadow:0 6px 18px rgba(18,36,71,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:10px;">
          <div style="flex:1">
            <h3 class="h3">${escapeHtml(j.title)}</h3>
            <p class="text"><strong>${escapeHtml(j.company || '')}</strong> — ${escapeHtml(j.location || '')}</p>
            <p class="text">${escapeHtml(j.snippet || '')}</p>
          </div>
          <div style="text-align:right;min-width:160px">
            <p class="text" style="font-size:12px;color:#666">Source: ${escapeHtml(j.source || 'aggregator')}</p>
            <p><a class="btn btn-small" href="${escapeHtml(j.url || '#')}" target="_blank">Apply</a></p>
          </div>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(s){ return (s||'').replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\'' : '&#39;','"':'&quot;'}[c])); }

  // Alerts management
  function loadAlerts(){ try{ return JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]'); }catch(e){ return []; } }
  function saveAlerts(arr){ localStorage.setItem(ALERTS_KEY, JSON.stringify(arr)); }

  function loadSeenIds(){ try{ return JSON.parse(localStorage.getItem(KNOWN_IDS_KEY) || '[]'); }catch(e){ return []; } }
  function saveSeenIds(arr){ localStorage.setItem(KNOWN_IDS_KEY, JSON.stringify(arr)); }

  async function pollAlerts(){
    const alerts = loadAlerts();
    if(!alerts.length) return;
    const seen = loadSeenIds();
    for(const a of alerts){
      const jobs = await searchJobs(a.title, a.location);
      const newJobs = jobs.filter(j=> !seen.includes(j.id));
      if(newJobs.length){
        // Notify user (Notification API if allowed)
        const message = `${newJobs.length} new jobs for ${a.title} (${a.location||'anywhere'})`;
        try{ if(window.Notification && Notification.permission === 'granted'){ newJobs.slice(0,3).forEach(j=>new Notification(j.title || 'New job', { body: `${j.company || ''} — ${j.location || ''}` })); }
        }catch(e){ console.warn(e); }
        // add to seen list
        newJobs.forEach(j=> seen.push(j.id));
        saveSeenIds(seen);
        // show in page
        aggregatedResults.insertAdjacentHTML('afterbegin', `<div style="padding:8px;background:#fff3cd;border-radius:8px;margin-bottom:8px;"><strong>Alert:</strong> ${escapeHtml(message)}</div>`);
      }
    }
  }

  // Wire events
  searchBtn && searchBtn.addEventListener('click', ()=>{
    const q = searchTitle.value.trim();
    const loc = searchLocation.value.trim();
    // Immediate UX: show built-in mock results first so user sees instant feedback
    try{
      const instant = getBuiltinMock(q, loc);
      renderResults(instant);
    }catch(e){ console.warn('instant fallback failed', e); }
    // then perform async search which will replace results when ready
    searchJobs(q, loc).then(res=>{
      console.log('searchJobs returned', res && res.length ? res.length : 0);
    }).catch(err=>{
      console.error('searchJobs error', err);
      aggregatedResults.insertAdjacentHTML('afterbegin', '<div style="padding:8px;background:#f8d7da;border-radius:8px;margin-bottom:8px;color:#721c24">Error fetching live jobs — showing local results.</div>');
    });
  });

  saveAlert && saveAlert.addEventListener('click', ()=>{
    const title = searchTitle.value.trim();
    const location = searchLocation.value.trim();
    const email = alertEmail.value.trim();
    if(!title) return alert('Enter a job title to save an alert');
    const alerts = loadAlerts();
    alerts.push({ title, location, email, createdAt: Date.now() });
    saveAlerts(alerts);
    alert('Alert saved locally. Keep this page open for periodic checks.');
    // ask for notification permission
    if(window.Notification && Notification.permission !== 'granted') Notification.requestPermission();
  });

  clearAlerts && clearAlerts.addEventListener('click', ()=>{
    if(!confirm('Clear saved alerts?')) return;
    saveAlerts([]); saveSeenIds([]);
    alert('Alerts cleared.');
  });

  // Poll saved alerts every 2 minutes
  setInterval(()=>{ pollAlerts().catch(()=>{}) }, 120000);

  // Expose a manual check when page loads (but don't run automatically if no alerts)
  window.techseva_job_search = searchJobs;
})();
