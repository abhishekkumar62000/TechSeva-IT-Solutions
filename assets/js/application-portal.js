(function(){
  const baseUrl = 'http://localhost:3000';
  const tokenInput = document.getElementById('tokenInput');
  const loadBtn = document.getElementById('loadBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const demoBtn = document.getElementById('demoBtn');
  const portalContent = document.getElementById('portalContent');
  const portalEmpty = document.getElementById('portalEmpty');
  const appName = document.getElementById('appName');
  const appRole = document.getElementById('appRole');
  const appStatus = document.getElementById('appStatus');
  const appSubmitted = document.getElementById('appSubmitted');
  const timelineList = document.getElementById('timelineList');
  const quizWrap = document.getElementById('quizWrap');
  const resumeWrap = document.getElementById('resumeWrap');
  const downloadResume = document.getElementById('downloadResume');
  const askUpdateBtn = document.getElementById('askUpdateBtn');

  function showError(msg){
    // prefer inline error display (falls back to alert)
    try{
      let el = document.getElementById('portalError');
      if(!el){ el = document.createElement('div'); el.id = 'portalError'; el.style.marginTop = '12px'; el.style.color = '#b91c1c'; el.style.fontWeight = '600'; portalEmpty.parentElement.insertBefore(el, portalEmpty.nextSibling); }
      el.textContent = msg;
    }catch(e){ alert(msg); }
  }

  async function fetchApplication(token){
    if(!token) return null;
    try{
      const res = await fetch(baseUrl + '/api/applications/' + encodeURIComponent(token));
      if(!res.ok) return null;
      const j = await res.json();
      return j.application || null;
    }catch(e){ return null; }
  }

  // Demo record so the page shows meaningful content even without a running server
  function demoRecord(){
    return {
      token: 'demo-1234', name: 'Demo Candidate', role: 'Web Development', status: 'Under Review', submittedAt: new Date().toISOString(), resumeFile: null,
      history: [{ status: 'Applied', at: new Date().toISOString() }], quiz: { percent: 80, correct: 8, total: 10, details: [] }
    };
  }

  function renderApplication(rec){
    if(!rec) return;
    portalEmpty.style.display = 'none';
    portalContent.style.display = '';
    appName.textContent = rec.name || 'Applicant';
    appRole.textContent = rec.role || '-';
    appStatus.textContent = rec.status || 'Applied';
    // color the status
    const s = (rec.status || 'Applied').toLowerCase();
    appStatus.className = 'status-badge';
    if(s.includes('offer') || s.includes('hired')) appStatus.style.background = '#e6ffef';
    else if(s.includes('interview')) appStatus.style.background = '#fff8e6';
    else if(s.includes('review')) appStatus.style.background = '#eef6ff';
    else appStatus.style.background = '#eef2ff';

    appSubmitted.textContent = rec.submittedAt || '-';
    // resume
    if(rec.resumeFile){
      const url = baseUrl + '/uploads/' + rec.resumeFile;
      resumeWrap.innerHTML = `<strong>Resume:</strong> <a href="${url}" target="_blank">Download</a>`;
      downloadResume.href = url; downloadResume.style.display = '';
    } else { resumeWrap.innerHTML = '<strong>Resume:</strong> Not provided'; downloadResume.style.display='none'; }

    // timeline
    timelineList.innerHTML = '';
    const hist = rec.history || [];
    hist.forEach(h => {
      const li = document.createElement('li'); li.textContent = `${h.status} — ${h.at}`; timelineList.appendChild(li);
    });

    // quiz
    if(rec.quiz){
      const q = rec.quiz;
      quizWrap.innerHTML = `<p><strong>Score:</strong> ${q.percent || 'N/A'}% (${q.correct || 0}/${q.total || 0})</p>`;
      if(q.details && q.details.length){
        const ul = document.createElement('ul'); q.details.forEach(d=>{ const li = document.createElement('li'); li.textContent = d.q + ' — chosen: ' + (d.chosen===null? 'skipped': d.choices[d.chosen] || d.chosen) + ' (correct: ' + d.choices[d.correct] + ')'; ul.appendChild(li); }); quizWrap.appendChild(ul);
      }
    } else { quizWrap.innerHTML = 'No quiz data available.'; }
  }

  async function loadFromToken(token){
    const rec = token ? await fetchApplication(token) : null;
    if(!rec){
      // if server is not reachable, allow demo fallback
      showError('Live application not found or server unreachable. Loading demo record instead.');
      renderApplication(demoRecord());
      return;
    }
    // clear any previous portal error
    const errEl = document.getElementById('portalError'); if(errEl) errEl.remove();
    renderApplication(rec);
  }

  loadBtn.addEventListener('click', ()=>{
    const t = (tokenInput.value || '').trim();
    if(!t) return showError('Please paste your tracking token.');
    loadFromToken(t);
  });
  refreshBtn.addEventListener('click', ()=>{ const t = (tokenInput.value || '').trim(); if(t) loadFromToken(t); });

  demoBtn && demoBtn.addEventListener('click', ()=>{ tokenInput.value = ''; loadFromToken(''); });

  askUpdateBtn.addEventListener('click', ()=>{
    alert('We received your request. The recruiter will be notified (demo).');
  });

  // if token present in querystring, auto-load
  (function autoLoad(){
    const params = new URLSearchParams(window.location.search);
    const tk = params.get('token');
    if(tk){ tokenInput.value = tk; loadFromToken(tk); }
  })();

  // Calendly popup prefill when portal has applicant info
  (function wireCalendlyPrefill(){
    const popupBtn = document.getElementById('calendlyPopupBtn');
    if(!popupBtn) return;
    popupBtn.addEventListener('click', function(){
      const t = (tokenInput.value || '').trim();
      if(!t) return alert('Load your application first to prefill details.');
      // fetch rec then open popup with prefill
      fetch(baseUrl + '/api/applications/' + encodeURIComponent(t)).then(r=> r.json()).then(j=>{
        const rec = j && j.application ? j.application : null;
        if(!rec) { window.open('https://calendly.com/abhiydv23096/new-meeting-1','_blank'); return; }
        try{
          if(window.Calendly && typeof Calendly.initPopupWidget === 'function'){
            Calendly.initPopupWidget({ url: 'https://calendly.com/abhiydv23096/new-meeting-1', prefill: { name: rec.name || '', email: rec.email || '' } });
            return false;
          }
        }catch(e){}
        // fallback
        const qp = [];
        if(rec && rec.name) qp.push('name=' + encodeURIComponent(rec.name));
        if(rec && rec.email) qp.push('email=' + encodeURIComponent(rec.email));
        const fu = qp.length ? ('https://calendly.com/abhiydv23096/new-meeting-1?' + qp.join('&')) : 'https://calendly.com/abhiydv23096/new-meeting-1';
        window.open(fu,'_blank');
      }).catch(()=> window.open('https://calendly.com/abhiydv23096/new-meeting-1','_blank'));
    });
  })();

})();
