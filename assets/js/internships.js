// internships.js - handles inline apply form, search/filter for roles, and client-side submission UX
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const openBtn = document.getElementById('openApplyInline');
    const applyFormWrap = document.getElementById('apply-form');
    const closeBtn = document.getElementById('closeApply');
    const closeBtnBottom = document.getElementById('closeApplyBottom');
    const form = document.getElementById('internForm');
    const formSuccess = document.getElementById('formSuccess');
    const roleSearch = document.getElementById('roleSearch');
    const rolesGrid = document.getElementById('rolesGrid');
    const filterAll = document.getElementById('filterAll');
    const filterTech = document.getElementById('filterTech');
    const filterCreative = document.getElementById('filterCreative');

    let lastActiveElement = null;

    // Utility: get focusable elements in modal
    function getFocusable(container){
      if(!container) return [];
      const nodes = container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      return Array.from(nodes).filter(n => n.offsetParent !== null);
    }

    // small utility: debounce
    function debounce(fn, wait = 250){ let t; return function(...a){ clearTimeout(t); t = setTimeout(()=> fn.apply(this, a), wait); }; }

    function trapTabKey(e){
      if(!applyFormWrap) return;
      const focusables = getFocusable(applyFormWrap.querySelector('.modal-dialog'));
      if(!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if(e.key === 'Tab'){
        if(e.shiftKey){
          if(document.activeElement === first){ e.preventDefault(); last.focus(); }
        } else {
          if(document.activeElement === last){ e.preventDefault(); first.focus(); }
        }
      } else if(e.key === 'Escape'){
        e.preventDefault(); closeForm();
      }
    }

    function openForm(e){
      if(e) e.preventDefault();
      if(!applyFormWrap) return;
      lastActiveElement = document.activeElement;
      applyFormWrap.setAttribute('aria-hidden','false');
      applyFormWrap.style.display = 'flex';
      // small animation class
      applyFormWrap.classList.add('open');
      // restore draft if available
      try{ restoreDraft && restoreDraft(); }catch(e){}
      // focus first field
      const dlg = applyFormWrap.querySelector('.modal-dialog');
      const focusables = getFocusable(dlg);
      if(focusables.length) focusables[0].focus();
      // add listeners to trap focus and handle ESC
      document.addEventListener('keydown', trapTabKey);
      // overlay click -> close
      applyFormWrap.addEventListener('click', overlayClick);
    }

    function overlayClick(e){ if(e.target === applyFormWrap) closeForm(); }

    function closeForm(){
      if(!applyFormWrap) return;
      applyFormWrap.setAttribute('aria-hidden','true');
      applyFormWrap.style.display = 'none';
      applyFormWrap.classList.remove('open');
      if(formSuccess) formSuccess.style.display = 'none';
      document.removeEventListener('keydown', trapTabKey);
      applyFormWrap.removeEventListener('click', overlayClick);
      // restore focus
      try{ if(lastActiveElement) lastActiveElement.focus(); }catch(e){}
    }

    function showMessage(msg, type='success'){
      if(!form) return;
      const el = document.createElement('div');
      el.className = 'form-message ' + type;
      el.textContent = msg;
      form.parentElement.insertBefore(el, form);
      setTimeout(()=> el.remove(), 4000);
    }

    if(openBtn) openBtn.addEventListener('click', openForm);
    if(closeBtn) closeBtn.addEventListener('click', closeForm);
    if(closeBtnBottom) closeBtnBottom.addEventListener('click', closeForm);

    // Form submission
    if(form){
      // --- Draft save/restore (localStorage) ---
      const DRAFT_KEY = 'internFormDraft_v1';
      function getFormJSON(){
        const data = {};
        try{ new FormData(form).forEach((v,k)=>{ if(k !== 'resume') data[k]=v; }); }catch(e){}
        return data;
      }
      function saveDraft(){
        try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(getFormJSON())); }catch(e){}
      }
      const saveDraftDebounced = debounce(saveDraft, 800);
      function restoreDraft(){
        try{
          const raw = localStorage.getItem(DRAFT_KEY);
          if(!raw) return;
          const obj = JSON.parse(raw || '{}');
          Object.keys(obj).forEach(k=>{
            const el = form.elements[k];
            if(!el) return;
            try{ el.value = obj[k]; }catch(e){}
          });
        }catch(e){}
      }
      // auto-save on input/change (exclude file binary)
      form.addEventListener('input', saveDraftDebounced);
      form.addEventListener('change', saveDraftDebounced);
      // Setup a simple multi-step form: show one field group at a time for easier filling
      (function setupMultiStep(){
        const container = form.querySelector('.form-grid');
        if(!container) return;
        const steps = Array.from(container.children).filter(n => n.nodeType === 1);
        if(!steps.length) return;
        steps.forEach((s, i)=>{ s.classList.add('form-step'); if(i===0) s.classList.add('active'); else s.classList.remove('active'); });

        // inject Next and Back buttons into form-actions
        const actions = form.querySelector('.form-actions');
        if(!actions) return;
        const prevBtn = document.createElement('button'); prevBtn.type = 'button'; prevBtn.id = 'prevStep'; prevBtn.className = 'btn btn-ghost'; prevBtn.textContent = 'Back'; prevBtn.style.display = 'none';
        const nextBtn = document.createElement('button'); nextBtn.type = 'button'; nextBtn.id = 'nextStep'; nextBtn.className = 'btn'; nextBtn.textContent = 'Next';
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) submitBtn.style.display = 'none';

        // place prev before actions start, and next before submit
        actions.insertBefore(prevBtn, actions.firstChild);
        actions.insertBefore(nextBtn, submitBtn || actions.firstChild);

        let current = 0;
        function showStep(idx){
          if(idx < 0 || idx >= steps.length) return;
          steps.forEach((s,i)=> s.classList.toggle('active', i===idx));
          prevBtn.style.display = idx === 0 ? 'none' : 'inline-flex';
          nextBtn.style.display = idx === steps.length - 1 ? 'none' : 'inline-flex';
          if(submitBtn) submitBtn.style.display = idx === steps.length - 1 ? 'inline-flex' : 'none';
          // focus first input in step
          const focusEl = steps[idx].querySelector('input, select, textarea');
          if(focusEl) focusEl.focus();
          current = idx;
        }

        nextBtn.addEventListener('click', function(){
          // validate required fields in current step
          const required = steps[current].querySelectorAll('[required]');
          for(const r of required){
            if((r.type === 'checkbox' && !r.checked) || (r.type !== 'checkbox' && !r.value)){
              r.focus(); showMessage('Please fill the required field before continuing.', 'error'); return; }
          }
          showStep(Math.min(current + 1, steps.length - 1));
        });

        prevBtn.addEventListener('click', function(){ showStep(Math.max(current - 1, 0)); });

        // initialize
        showStep(0);
      })();

      const formProgress = document.getElementById('formProgress');
      const applySuccess = document.getElementById('applySuccess');
      const successMsg = document.getElementById('successMsg');
      const closeSuccess = document.getElementById('closeSuccess');

      // Resume file metadata display and validation (immediate feedback)
      try{
        const resumeInput = form.querySelector('#resume');
        if(resumeInput){
          const info = document.createElement('div'); info.className = 'resume-info'; info.style.marginTop = '8px'; info.style.fontSize = '13px'; info.style.color = 'var(--purple-navy)';
          resumeInput.parentNode.appendChild(info);
          resumeInput.addEventListener('change', function(){
            const f = resumeInput.files && resumeInput.files[0];
            if(!f){ info.textContent = ''; return; }
            const maxSize = 5 * 1024 * 1024; // 5MB
            if(f.size > maxSize){ info.textContent = 'File too large (max 5MB).'; resumeInput.value = ''; return; }
            if(!/pdf$/i.test(f.name) && !(f.type && f.type === 'application/pdf')){ info.textContent = 'Please upload PDF only.'; resumeInput.value = ''; return; }
            info.textContent = `${f.name} — ${(f.size/1024).toFixed(1)} KB`;
            // update draft (don't store file, only metadata)
            saveDraftDebounced();
          });
        }
      }catch(e){}

      function showProgress(on){ if(formProgress) formProgress.style.display = on ? 'block' : 'none'; }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        const data = new FormData(form);
        // Attach quizScore if present in hidden input (already handled in quiz submit)
        // Fire a simple analytics event for conversion
        try{ console.info('event: form_submit', { role: data.get('role') }); }catch(e){}
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const roleVal = (data.get('role') || '').toString().trim();
        if(!name || !email || !roleVal){ showMessage('Please fill required fields: name, email and role.', 'error'); return; }

        // validate resume if provided (simple client-side checks)
        const resumeInput = form.querySelector('#resume');
        if(resumeInput && resumeInput.files && resumeInput.files.length){
          const f = resumeInput.files[0];
          const maxSize = 5 * 1024 * 1024; // 5MB
          const okType = /pdf$/i.test(f.name) || (f.type && f.type === 'application/pdf');
          if(!okType){ showMessage('Please upload resume in PDF format.', 'error'); return; }
          if(f.size > maxSize){ showMessage('Resume is too large (max 5MB).', 'error'); return; }
        }

        // show progress
        showProgress(true);

        const action = form.getAttribute('action') || '';

        // If action still has the placeholder, we'll attempt to POST to local server at http://localhost:3000/apply
        // If the server isn't available, fall back to simulated submission to preserve UX.
        const isPlaceholder = action.includes('your-form-id') || action.trim() === '';
        const serverApplyUrl = 'http://localhost:3000/apply';

        function handleSuccess(){
          showProgress(false);
          // hide form, show success panel with a friendly greeting
          if(applySuccess){
              applySuccess.style.display = 'block';
              applySuccess.setAttribute('aria-hidden','false');
              // add a small pop animation class
              applySuccess.classList.add('burst');
          }
          if(form){ form.style.display = 'none'; }
          // generate a lightweight tracking token and persist application locally (for optional server integration later)
          try{
            const token = 'app-' + Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);
            const appData = { name, email, role: roleVal, submittedAt: new Date().toISOString() };
            // attach quiz details if present
            try{ const qd = form.querySelector('input[name="quizDetails"]'); if(qd) appData.quiz = JSON.parse(qd.value || '{}'); }catch(e){}
            try{ localStorage.setItem('app_' + token, JSON.stringify(appData)); }catch(e){}
            const trackUrl = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '') + 'application-status.html?token=' + encodeURIComponent(token);
            if(successMsg) successMsg.innerHTML = `Hi ${name.split(' ')[0] || name}! We've received your application for ${roleVal}. We'll review it and contact you at ${email}.<br><strong>Your tracking link:</strong> <a href="${trackUrl}" target="_blank" rel="noopener">${trackUrl}</a>`;
          }catch(e){ if(successMsg) successMsg.textContent = `Hi ${name.split(' ')[0] || name}! We've received your application for ${roleVal}. We'll review it and contact you at ${email}.`; }
          // reset form after a short delay so data isn't lost if they close
          setTimeout(()=> { try{ form.reset(); }catch(e){} localStorage.removeItem(DRAFT_KEY); }, 800);
          // Launch confetti celebration
          try{ launchCelebration(); }catch(e){/* ignore */}
        }

        function handleError(){ showProgress(false); showMessage('Submission failed. Please try again or email hello@techseva.co', 'error'); }

        if(isPlaceholder){
          // Prefer local server if available (health check). Otherwise simulate.
          const CHECK = 'http://localhost:3000/health';
          const timeoutMs = 500;
          const controller = new AbortController();
          const timer = setTimeout(()=> controller.abort(), timeoutMs);
          fetch(CHECK, { signal: controller.signal }).then(r => {
            clearTimeout(timer);
            if(r.ok){
              // send to local server with multipart formdata
              fetch(serverApplyUrl, { method: 'POST', body: data })
                .then(res => res.json())
                .then(j => { if(j && j.ok){
                  // show server-provided tracking URL when available
                  showProgress(false);
                  try{ const token = j.token; const trackUrl = (j.url && j.url.startsWith('http')) ? j.url : (window.location.origin + '/' + j.url.replace(/^\//,'')); if(successMsg) successMsg.innerHTML = `Hi ${name.split(' ')[0] || name}! We've received your application for ${roleVal}. Track it here: <a href="${trackUrl}" target="_blank" rel="noopener">${trackUrl}</a>`; }catch(e){}
                  // clear form and draft
                  try{ form.reset(); localStorage.removeItem(DRAFT_KEY); }catch(e){}
                  try{ launchCelebration(); }catch(e){}
                } else { handleError(); } })
                .catch(()=> handleError());
            } else {
              // server not available -> simulate
              setTimeout(()=>{ handleSuccess(); }, 700);
            }
          }).catch(()=>{ clearTimeout(timer); setTimeout(()=>{ handleSuccess(); }, 700); });
        } else {
          // Attempt to POST to specified action (e.g., Formspree)
          fetch(action, { method: form.method || 'POST', body: data })
            .then(response => { if(response.ok){ handleSuccess(); } else { handleError(); } })
            .catch(() => { handleError(); });
        }
      });

      // Close success and restore form state
      if(closeSuccess) closeSuccess.addEventListener('click', function(){
        if(applySuccess) { applySuccess.style.display = 'none'; applySuccess.setAttribute('aria-hidden','true'); }
        if(form) { form.style.display = ''; }
        closeForm();
      });

      // Celebration: confetti generator
      function launchCelebration(){
        const colors = ['#ff5f6d','#ffd371','#6ad6ff','#7be6ff','#b39cff','#9ae6b4','#ff9a9e'];
        const layer = document.createElement('div'); layer.className = 'celebration-layer';
        document.body.appendChild(layer);
        const count = 40;
        for(let i=0;i<count;i++){
          const el = document.createElement('div'); el.className = 'confetti-piece';
          const left = Math.random() * 100; // vw
          const tx = (Math.random() * 200 - 100) + 'px';
          const ty = '-20vh';
          const xend = (Math.random() * 400 - 200) + 'px';
          const rot = (Math.random() * 720 - 360) + 'deg';
          const delay = (Math.random() * 300) + 'ms';
          const dur = (2000 + Math.random() * 2000) + 'ms';
          el.style.left = left + 'vw';
          el.style.background = colors[Math.floor(Math.random() * colors.length)];
          el.style.width = (8 + Math.random() * 8) + 'px';
          el.style.height = (10 + Math.random() * 16) + 'px';
          el.style.setProperty('--tx', tx);
          el.style.setProperty('--ty', ty);
          el.style.setProperty('--xend', xend);
          el.style.setProperty('--rot', rot);
          el.style.animation = `confetti-fall ${dur} linear ${delay} forwards`;
          layer.appendChild(el);
        }
        // remove layer after animations finish
        setTimeout(()=>{ try{ layer.remove(); }catch(e){} }, 4200);
      }

      // If user cancels while submitting, hide progress
      if(closeBtnBottom) closeBtnBottom.addEventListener('click', function(){ showProgress(false); closeForm(); });
    }

    // Search/filter behavior for role cards
    // Prepare Fuse.js search data
    let fuse = null;
    const rolesData = [];
    if(rolesGrid){
      Array.from(rolesGrid.querySelectorAll('.intern-role-card')).forEach(card => {
        rolesData.push({
          id: rolesData.length,
          role: card.dataset.role || '',
          type: card.dataset.type || '',
          title: (card.querySelector('.irc-title') && card.querySelector('.irc-title').textContent) || '',
          desc: (card.querySelector('.irc-desc') && card.querySelector('.irc-desc').textContent) || ''
        });
      });
      try{ if(window.Fuse) fuse = new Fuse(rolesData, { keys: ['role','title','desc','type'], threshold: 0.35, includeScore:true }); }catch(e){ fuse = null; }
    }
    if(roleSearch && rolesGrid){
      const runSearch = function(){
        const q = (roleSearch.value || '').trim();
        // if Fuse available and query not empty, use fuzzy search
        let results = null;
        if(fuse && q.length){
          try{ results = fuse.search(q).map(r => r.item); }catch(e){ results = null; }
        }
        Array.from(rolesGrid.querySelectorAll('.intern-role-card')).forEach(card => {
          const id = Array.from(rolesGrid.querySelectorAll('.intern-role-card')).indexOf(card);
          const titleEl = card.querySelector('.irc-title');
          const descEl = card.querySelector('.irc-desc');
          let matches = true;
          if(q === ''){ matches = true; }
          else if(results){ matches = results.some(r => (r.role||'') === (card.dataset.role||'')); }
          else {
            const role = (card.dataset.role || '').toLowerCase();
            const type = (card.dataset.type || '').toLowerCase();
            matches = role.includes(q.toLowerCase()) || type.includes(q.toLowerCase()) || (titleEl && titleEl.textContent.toLowerCase().includes(q.toLowerCase())) || (descEl && descEl.textContent.toLowerCase().includes(q.toLowerCase()));
          }
          card.style.display = matches ? '' : 'none';

          // simple highlight in title and description (using plain substring match)
          function highlight(el){
            if(!el) return;
            const text = el.textContent || '';
            const low = q.toLowerCase();
            if(q === ''){ el.innerHTML = text; return; }
            const idx = text.toLowerCase().indexOf(low);
            if(idx === -1){ el.innerHTML = text; return; }
            const before = text.slice(0, idx);
            const match = text.slice(idx, idx + q.length);
            const after = text.slice(idx + q.length);
            el.innerHTML = before + '<span class="match-highlight">' + match + '</span>' + after;
          }
          highlight(titleEl);
          highlight(descEl);
        });
        updateRolesCount();
      };
      roleSearch.addEventListener('input', debounce(runSearch, 200));
    }

    function applyFilter(type){
      if(!rolesGrid) return;
      Array.from(rolesGrid.querySelectorAll('.intern-role-card')).forEach(card => {
        card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
      });
      updateRolesCount();
    }

    // make filter buttons keyboard & ARIA friendly
    function setFilterButtons(activeId){
      [filterAll, filterTech, filterCreative].forEach(btn=>{
        if(!btn) return;
        const on = btn.id === activeId;
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.classList.toggle('active', on);
      });
    }
    filterAll && filterAll.addEventListener('click', ()=>{ applyFilter('all'); setFilterButtons('filterAll'); });
    filterTech && filterTech.addEventListener('click', ()=>{ applyFilter('tech'); setFilterButtons('filterTech'); });
    filterCreative && filterCreative.addEventListener('click', ()=>{ applyFilter('creative'); setFilterButtons('filterCreative'); });
    // default state
    try{ setFilterButtons('filterAll'); }catch(e){}

    // Role card interactions: apply button prefill OR toggle expand on card body
    if(rolesGrid){
      // live role count and no-results element
      const rolesCountEl = document.getElementById('rolesCount');
      const noResults = document.getElementById('noResults');

      function updateRolesCount(){
        const visible = Array.from(rolesGrid.querySelectorAll('.intern-role-card')).filter(c => c.style.display !== 'none');
        const n = visible.length;
        if(rolesCountEl) rolesCountEl.textContent = n + (n === 1 ? ' role' : ' roles');
        if(noResults) noResults.style.display = n === 0 ? 'block' : 'none';
        // announce for screen readers
        const announcer = document.getElementById('intern-announce');
        if(announcer) announcer.textContent = n + ' roles visible';
      }

      // IntersectionObserver to reveal cards with a small stagger
      // Set per-card index for staggered animation and reveal on scroll
      const revealObserver = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('role-reveal');
            revealObserver.unobserve(entry.target);
          }
        })
      }, { threshold: 0.12 });
      const roleCards = Array.from(rolesGrid.querySelectorAll('.intern-role-card'));
      roleCards.forEach((c, i)=>{ c.style.setProperty('--i', i); revealObserver.observe(c); c.classList.add('anim-stagger'); });
      // stagger visible when in viewport
      // small timeout to add visible class for already-observed ones
      setTimeout(()=>{ roleCards.forEach((c, i)=> setTimeout(()=> c.classList.add('visible'), i * 80)); }, 160);
      
      // Add interactive tilt effect and hover micro-interactions
      Array.from(rolesGrid.querySelectorAll('.intern-role-card')).forEach(card => {
        // mousemove tilt (only on pointer fine devices)
        let rect = null;
        function handleMove(e){
          if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          rect = rect || card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const ry = (px - 0.5) * 10; // rotateY
          const rx = -(py - 0.5) * 6; // rotateX
          card.style.setProperty('--rx', rx + 'deg');
          card.style.setProperty('--ry', ry + 'deg');
          card.classList.add('tilted');
        }
        function handleLeave(){
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
          card.classList.remove('tilted');
          rect = null;
        }
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);
        card.addEventListener('blur', handleLeave);
      });
      // initial count
      updateRolesCount();
      // inject quick-quiz buttons to each card and enhanced quiz implementation
      const quizzes = {
        'Web Development': [
          { q: 'Which language structures web content?', a: ['CSS','JavaScript','HTML','SQL'], correct:2, explanation: 'HTML provides the structure of web pages.' },
          { q: 'Which is used for styling?', a: ['HTML','CSS','Python','PHP'], correct:1, explanation: 'CSS styles the appearance of HTML elements.' },
          { q: 'Which language adds interactivity?', a: ['HTML','CSS','JavaScript','SQL'], correct:2, explanation: 'JavaScript enables interactivity in browsers.' },
          { q: 'Which tag links CSS files?', a: ['<link>','<script>','<style>','<css>'], correct:0, explanation: 'The <link> tag is used to include external stylesheets.' },
          { q: 'Responsive design adapts to?', a: ['User intent','Different viewports','Server load','Time of day'], correct:1, explanation: 'Responsive design adapts layouts to various screen sizes.' },
          { q: 'Which is a semantic HTML element?', a: ['<div>','<span>','<header>','<b>'], correct:2, explanation: '<header> is semantic and describes the header of a section.' },
          { q: 'What does DOM stand for?', a: ['Document Object Model','Data Object Model','Document Oriented Map','Direct Object Model'], correct:0, explanation: 'DOM is the Document Object Model representing the page structure.' },
          { q: 'Which method finds an element by id in JS?', a: ['getElementById','querySelectorAll','getElementsByClassName','getTag'], correct:0, explanation: 'document.getElementById() selects an element by its id.' },
          { q: 'Which HTTP method retrieves data?', a: ['POST','PUT','GET','DELETE'], correct:2, explanation: 'GET requests retrieve resources from a server.' },
          { q: 'What is progressive enhancement?', a: ['Start with JS features','Mobile-only design','Build baseline then enhance','Ignore older browsers'], correct:2, explanation: 'Progressive enhancement provides a basic experience then layers enhancements.' }
        ],
        'App Development': [
          { q: 'Android official language now?', a: ['Java','Kotlin','Swift','C#'], correct:1, explanation: 'Kotlin is the preferred modern language for Android.' },
          { q: 'iOS primary language?', a: ['Objective-C','Kotlin','Swift','Dart'], correct:2, explanation: 'Swift is Apple’s modern language for iOS development.' },
          { q: 'Which is a cross-platform framework?', a: ['React Native','Xcode','Android Studio','CocoaPods'], correct:0, explanation: 'React Native allows building native apps with JS across platforms.' },
          { q: 'APK is for which platform?', a: ['iOS','Android','Web','Windows'], correct:1, explanation: 'APK (Android Package) is used to distribute Android apps.' },
          { q: 'What is an emulator?', a: ['Real device','Server','Software simulation of device','Database'], correct:2, explanation: 'Emulators simulate devices for testing apps.' },
          { q: 'Which pattern helps separate UI and logic?', a: ['MVC','SQL','HTML','CSS'], correct:0, explanation: 'MVC (Model-View-Controller) separates concerns in apps.' },
          { q: 'Which stores persistent data on device?', a: ['Cache only','Local storage/DB','RAM only','Temporary files'], correct:1, explanation: 'Databases or local storage persist app data across sessions.' },
          { q: 'Which tool for iOS UI design?', a: ['Android Studio','Xcode Interface Builder','Visual Studio Code','Eclipse'], correct:1, explanation: 'Xcode includes Interface Builder for designing iOS UIs.' },
          { q: 'Which package manager for Flutter?', a: ['npm','pip','pub','gem'], correct:2, explanation: 'pub is Dart/Flutter’s package manager.' },
          { q: 'What is push notification?', a: ['User-initiated alert','Server-sent alert','Local file','Database'], correct:1, explanation: 'Push notifications are server-sent messages to devices.' }
        ],
        'UI/UX': [
          { q: 'What does UX focus on?', a: ['Visual only','User experience','Server speed','Database design'], correct:1, explanation: 'UX focuses on the overall user experience.' },
          { q: 'What is a wireframe?', a: ['Detailed visuals','Low-fidelity layout','Final product','Test spec'], correct:1, explanation: 'Wireframes are low-fidelity layouts showing structure.' },
          { q: 'Primary tool for prototyping?', a: ['Figma','Node.js','MySQL','Git'], correct:0, explanation: 'Figma is widely used for UI design and prototyping.' },
          { q: 'What is usability testing?', a: ['Designing logos','Testing users on tasks','Deploying sites','Writing backend code'], correct:1, explanation: 'Usability testing verifies how real users perform tasks.' },
          { q: 'What is accessibility?', a: ['Ignoring users','Making product usable for all','Faster servers','More animations'], correct:1, explanation: 'Accessibility ensures product is usable by people with disabilities.' },
          { q: 'What is IA (in UX)?', a: ['Information Architecture','Internet Access','Image Asset','Input Array'], correct:0, explanation: 'Information Architecture organizes content and navigation.' },
          { q: 'Visual hierarchy helps users?', a: ['Get lost','Understand importance','Slow performance','Hide content'], correct:1, explanation: 'Hierarchy guides users to what’s most important.' },
          { q: 'What is a persona?', a: ['Real user','Fictional archetype','Design file','Colour palette'], correct:1, explanation: 'Personas are fictional user archetypes used in design.' },
          { q: 'What is a CTA?', a: ['Code Test Area','Call To Action','Content Type Attribute','Creative Template Asset'], correct:1, explanation: 'CTA prompts users to take action (e.g., Sign up).' },
          { q: 'What does affinity mapping help with?', a: ['Coding','Grouping ideas','Selling','Marketing'], correct:1, explanation: 'Affinity mapping clusters ideas during research synthesis.' }
        ],
        'AI/ML': [
          { q: 'Supervised learning uses?', a: ['Unlabeled data','Labeled data','No data','Only images'], correct:1, explanation: 'Supervised learning uses labeled examples.' },
          { q: 'What is overfitting?', a: ['Model generalizes well','Model fits noise','Faster training','Low variance'], correct:1, explanation: 'Overfitting means model learns noise and fails to generalize.' },
          { q: 'Common evaluation metric for classification?', a: ['Accuracy','CSS','HTML','SQL'], correct:0, explanation: 'Accuracy measures correct predictions rate.' },
          { q: 'Which is used for deep learning?', a: ['TensorFlow','MySQL','PHP','Excel'], correct:0, explanation: 'TensorFlow is a popular deep learning framework.' },
          { q: 'What is a feature?', a: ['Model output','Input variable','Database','API'], correct:1, explanation: 'Features are input variables used by models.' },
          { q: 'What is train/test split?', a: ['Split teams','Split data into sets','Split code','Split UI'], correct:1, explanation: 'Splitting data helps measure generalization.' },
          { q: 'Which reduces dimensionality?', a: ['PCA','HTML','CSS','SQL'], correct:0, explanation: 'PCA reduces feature dimensionality.' },
          { q: 'What is classification?', a: ['Predict continuous value','Predict categories','Store data','Run servers'], correct:1, explanation: 'Classification predicts discrete categories.' },
          { q: 'What is gradient descent?', a: ['Optimization algorithm','Storage system','UI layout','Testing tool'], correct:0, explanation: 'Gradient descent optimizes model parameters.' },
          { q: 'What is cross-validation?', a: ['Single train run','Multiple train/test folds','UI test','Database index'], correct:1, explanation: 'Cross-validation uses multiple folds for reliable evaluation.' }
        ],
        'Content Creator': [
          { q: 'What makes a headline effective?', a: ['Lengthy details','Clarity and benefit','Random words','Hidden text'], correct:1, explanation: 'Headlines should be clear and convey value.' },
          { q: 'What is SEO?', a: ['Design term','Search Engine Optimization','Programming','File format'], correct:1, explanation: 'SEO improves visibility in search engines.' },
          { q: 'Which is good for readability?', a: ['Long dense paragraphs','Short paragraphs and bullets','Tiny fonts','Hidden links'], correct:1, explanation: 'Short paragraphs and bullets improve readability.' },
          { q: 'What is a CTA in content?', a: ['Call To Action','Content Type Attribute','Code Test Area','Creative Asset'], correct:0, explanation: 'CTA prompts reader to act (subscribe, read more).' },
          { q: 'Ideal blog intro should?', a: ['Confuse readers','Hook and summarize','Be empty','Use only images'], correct:1, explanation: 'Introductions should hook readers and state purpose.' },
          { q: 'What is repurposing content?', a: ['Deleting old posts','Reusing content in new formats','Stealing content','Only images'], correct:1, explanation: 'Repurposing adapts content for other formats/channels.' },
          { q: 'What metric shows engagement?', a: ['Bounce rate','Open rate','Likes/comments','Server logs'], correct:2, explanation: 'Likes and comments are direct engagement signals.' },
          { q: 'What is a content calendar?', a: ['Random schedule','Planned publishing schedule','Database table','Design mockup'], correct:1, explanation: 'A content calendar schedules content publishing.' },
          { q: 'What is tone of voice?', a: ['Font choice','Style of writing','Server config','Color scheme'], correct:1, explanation: 'Tone defines personality and style in writing.' },
          { q: 'What is UGC?', a: ['User-Generated Content','Unique Good Content','Universal Graphic Code','User Global Config'], correct:0, explanation: 'UGC is content created by users/customers.' }
        ],
        'Social Media': [
          { q: 'Best time to post depends on?', a: ['Platform and audience','Server speed','Code quality','Database size'], correct:0, explanation: 'Posting time depends on audience and platform behavior.' },
          { q: 'What is engagement rate?', a: ['Ad cost','Interactions relative to reach','Image size','Hashtag count'], correct:1, explanation: 'Engagement rate measures interactions vs audience reach.' },
          { q: 'Which is important for reach?', a: ['Consistency','Only one post','No hashtags','Ignoring comments'], correct:0, explanation: 'Consistent posting helps grow reach.' },
          { q: 'What are hashtags for?', a: ['Styling text','Categorizing content','Encrypting data','Improving server'], correct:1, explanation: 'Hashtags categorize content and improve discoverability.' },
          { q: 'What is A/B testing?', a: ['Testing two variants','Merging accounts','Deleting posts','Buying followers'], correct:0, explanation: 'A/B testing compares two versions to see which performs better.' },
          { q: 'What is a social media KPI?', a: ['Key Performance Indicator','Image format','Page color','Script language'], correct:0, explanation: 'KPIs like engagement, reach, clicks measure performance.' },
          { q: 'What is influencer marketing?', a: ['Using influential people to promote','Server hosting','Designing logos','Database optimization'], correct:0, explanation: 'Influencer marketing leverages creators to promote products.' },
          { q: 'Why respond to comments?', a: ['Decrease engagement','Build community','Hurt brand','Ignore users'], correct:1, explanation: 'Responses help build community and trust.' },
          { q: 'What is social listening?', a: ['Audio editing','Monitoring brand conversations','Deleting posts','Coding tool'], correct:1, explanation: 'Social listening monitors mentions and sentiment.' },
          { q: 'What increases organic reach?', a: ['Buying followers','Engaging content and timing','Using spammy tactics','Ignoring audience'], correct:1, explanation: 'Quality content and engagement boost organic reach.' }
        ],
        'WordPress': [
          { q: 'What is a WP theme?', a: ['Database','Design template','Plugin','Server'], correct:1, explanation: 'Themes control the site’s appearance and layout.' },
          { q: 'What is a plugin?', a: ['Core file','Extension adding features','Theme','Image'], correct:1, explanation: 'Plugins extend WordPress functionality.' },
          { q: 'Safe login practice?', a: ['Weak password','Strong password & 2FA','Share creds','No password'], correct:1, explanation: 'Strong passwords and 2FA improve security.' },
          { q: 'What is wp-admin?', a: ['Public page','Admin dashboard','Image folder','Plugin'], correct:1, explanation: 'wp-admin is the WordPress admin backend.' },
          { q: 'How to back up WP?', a: ['Never back up','Use plugins or export tools','Edit core directly','Delete files'], correct:1, explanation: 'Backups via plugins or hosting tools keep data safe.' },
          { q: 'What is a child theme?', a: ['Standalone site','Inherits and overrides parent theme','Plugin type','Media file'], correct:1, explanation: 'Child themes allow safe customizations to parent themes.' },
          { q: 'Which file handles template hierarchy?', a: ['functions.php','index.php','style.css','readme.txt'], correct:1, explanation: 'index.php is part of the WP template hierarchy.' },
          { q: 'What improves WP performance?', a: ['Unoptimized images','Caching and optimization','Too many plugins','Large uncompressed files'], correct:1, explanation: 'Caching and image optimization speed up sites.' },
          { q: 'How to secure WP site?', a: ['Open permissions','Keep core/plugins updated','Use default admin','Disable backups'], correct:1, explanation: 'Keep software updated and use secure practices.' },
          { q: 'What is Gutenberg?', a: ['Old editor','Block editor','Plugin store','Theme engine'], correct:1, explanation: 'Gutenberg is WordPress’s block editor for content.' }
        ],
        'Data Entry': [
          { q: 'Key for copying in many apps?', a: ['Ctrl+C','Ctrl+V','Alt+Tab','Ctrl+Z'], correct:0, explanation: 'Ctrl+C copies selected content.' },
          { q: 'Best practice for accuracy?', a: ['Rushing','Double-checking entries','Guessing values','Ignoring validation'], correct:1, explanation: 'Double-checking reduces errors.' },
          { q: 'Which tool for spreadsheets?', a: ['Photoshop','Excel/Google Sheets','Visual Studio','Xcode'], correct:1, explanation: 'Excel and Google Sheets are standard for data entry.' },
          { q: 'What is data validation?', a: ['Validating users','Ensuring correct input formats','Deleting data','Formatting only'], correct:1, explanation: 'Validation enforces correct data formats and ranges.' },
          { q: 'What speeds up entry?', a: ['Manual re-typing','Using shortcuts and templates','No tools','Random typing'], correct:1, explanation: 'Shortcuts and templates increase speed and consistency.' },
          { q: 'Why keep backups?', a: ['Never needed','Prevent data loss','Create duplicates only','Slow system'], correct:1, explanation: 'Backups protect against accidental loss.' },
          { q: 'Which reduces mistakes?', a: ['No checks','Automation and formulas','Blind typing','Ignore errors'], correct:1, explanation: 'Automation and formulas reduce manual errors.' },
          { q: 'What is CSV?', a: ['Image format','Comma-separated values','Programming language','Database engine'], correct:1, explanation: 'CSV stores tabular data in plain text with commas.' },
          { q: 'What to do with sensitive data?', a: ['Share publicly','Encrypt and restrict access','Ignore it','Post online'], correct:1, explanation: 'Sensitive data should be protected and access-limited.' },
        { q: 'Which improves quality?', a: ['No review','Peer review and QA','Random changes','Delete history'], correct:1, explanation: 'Peer review and QA improve data quality.' }
        ]
      };

      // helper to show badge on card after quiz
      function showCardBadge(role, percent){
        const card = Array.from(rolesGrid.querySelectorAll('.intern-role-card')).find(c => (c.dataset.role||'') === role);
        if(!card) return;
        let badge = card.querySelector('.quiz-badge');
        if(!badge){ badge = document.createElement('div'); badge.className = 'quiz-badge'; badge.style.marginTop = '8px'; badge.style.fontSize = '13px'; badge.style.fontWeight = '700'; badge.style.color = 'var(--white)'; badge.style.background = 'linear-gradient(90deg,#6ad6ff,#7be6ff)'; badge.style.padding = '6px 8px'; badge.style.borderRadius = '999px'; card.querySelector('.irc-body').appendChild(badge); }
        badge.textContent = `Quiz: ${percent}%`;
      }

      Array.from(rolesGrid.querySelectorAll('.intern-role-card')).forEach(card => {
        const btnWrap = card.querySelector('.irc-body');
        if(btnWrap && !card.querySelector('.quiz-btn')){
          const quizBtn = document.createElement('button'); quizBtn.className = 'btn btn-small quiz-btn'; quizBtn.type = 'button'; quizBtn.textContent = 'Quick Quiz';
          quizBtn.style.marginLeft = '8px';
          btnWrap.appendChild(quizBtn);
          quizBtn.addEventListener('click', function(e){ e.stopPropagation(); openQuizForRole(card.dataset.role || ''); });
        }
      });
      // add decorative deco and role-chip to each card
      Array.from(rolesGrid.querySelectorAll('.intern-role-card')).forEach(card => {
        if(!card.querySelector('.card-deco')){
          const deco = document.createElement('div'); deco.className = 'card-deco'; card.appendChild(deco);
        }
        // add small role-chip if missing
        if(!card.querySelector('.role-chip')){
          const chip = document.createElement('div'); chip.className = 'role-chip'; chip.textContent = card.dataset.type || ''; chip.style.marginLeft = '8px'; const body = card.querySelector('.irc-body'); if(body) body.insertBefore(chip, body.firstChild);
        }
      });

      // Quiz modal handlers
      const quizModal = document.getElementById('quiz-modal');
      const quizContent = quizModal && quizModal.querySelector('#quizContent');
      const closeQuiz = document.getElementById('closeQuiz');
      const cancelQuiz = document.getElementById('cancelQuiz');
      const submitQuiz = document.getElementById('submitQuiz');
      const quizResult = document.getElementById('quizResult');
      let currentQuiz = null;
      let lastActiveQuizElement = null;
      let quizKeyHandler = null;

      // timer and navigation elements
      function buildQuizUI(role){
        if(!quizContent) return;
        const qlist = quizzes[role] || [];
        quizContent.innerHTML = '';
        // announcer for screenreaders (ensure exists)
        let announcer = document.getElementById('quiz-announcer');
        if(!announcer){ announcer = document.createElement('div'); announcer.id = 'quiz-announcer'; announcer.className = 'visually-hidden'; announcer.setAttribute('aria-live','polite'); quizContent.parentElement.insertBefore(announcer, quizContent); }
        // progress bar and timer
        const meta = document.createElement('div'); meta.className = 'quiz-meta'; meta.style.display='flex'; meta.style.gap='12px'; meta.style.alignItems='center';
        const progressWrap = document.createElement('div'); progressWrap.className = 'quiz-progress-wrap'; progressWrap.style.flex='1'; progressWrap.style.background='#eef6ff'; progressWrap.style.borderRadius='999px'; progressWrap.style.height='10px';
        const progressBar = document.createElement('div'); progressBar.className='quiz-progress'; progressBar.style.width='0%'; progressBar.style.height='100%'; progressBar.style.background='linear-gradient(90deg,#ffd371,#ff9a9e)'; progressBar.style.borderRadius='999px'; progressWrap.appendChild(progressBar);
        const timer = document.createElement('div'); timer.className='quiz-timer'; timer.style.minWidth='68px'; timer.style.fontSize='13px'; timer.style.color='var(--purple-navy)'; timer.textContent = '';
        meta.appendChild(progressWrap); meta.appendChild(timer);
        quizContent.appendChild(meta);
        // questions container (will display one question at a time)
        const questionsContainer = document.createElement('div'); questionsContainer.className = 'quiz-questions'; questionsContainer.style.marginTop='12px';
        qlist.forEach((qq, idx)=>{
          const qEl = document.createElement('div'); qEl.className = 'question'; qEl.setAttribute('data-index', idx); qEl.style.display='none';
          const p = document.createElement('p'); p.textContent = (idx+1) + '. ' + qq.q; p.style.fontWeight='700'; qEl.appendChild(p);
          const opts = document.createElement('div'); opts.className = 'options'; opts.style.display='flex'; opts.style.flexDirection='column'; opts.style.gap='8px'; opts.style.marginTop='8px';
          qq.a.forEach((opt, oi)=>{
            const id = 'q_' + idx + '_' + oi;
            const label = document.createElement('label'); label.style.display='flex'; label.style.alignItems='center'; label.style.gap='8px'; label.style.padding='8px'; label.style.borderRadius='8px'; label.style.cursor='pointer';
            const input = document.createElement('input'); input.type = 'radio'; input.name = 'q_' + idx; input.value = oi; input.id = id; input.style.marginRight='8px';
            label.appendChild(input);
            const span = document.createElement('span'); span.textContent = opt; label.appendChild(span);
            opts.appendChild(label);
            // make label keyboard-focusable and support Enter/Space to select
            label.tabIndex = 0;
            label.addEventListener('keydown', (ev)=>{
              if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); const inp = label.querySelector('input'); if(inp && !inp.disabled){ inp.checked = true; inp.dispatchEvent(new Event('change', { bubbles: true })); } }
              else if(ev.key === 'ArrowDown' || ev.key === 'ArrowRight'){
                ev.preventDefault(); const next = label.nextElementSibling; if(next) next.focus(); }
              else if(ev.key === 'ArrowUp' || ev.key === 'ArrowLeft'){
                ev.preventDefault(); const prev = label.previousElementSibling; if(prev) prev.focus(); }
            });
            // click feedback (select)
            label.addEventListener('click', ()=>{ /* nothing extra here, selection tracked on submit */ });
          });
          qEl.appendChild(opts);
          // explanation area (hidden until answer review)
          const explain = document.createElement('div'); explain.className='explain'; explain.style.marginTop='8px'; explain.style.display='none'; explain.style.fontSize='13px'; explain.style.color='var(--space-cadet-1)'; qEl.appendChild(explain);
          questionsContainer.appendChild(qEl);
        });
        quizContent.appendChild(questionsContainer);
        // navigation controls (Prev/Next handled via existing Submit/Cancel too)
        const nav = document.createElement('div'); nav.className='quiz-nav'; nav.style.display='flex'; nav.style.gap='8px'; nav.style.marginTop='12px'; nav.style.alignItems='center';
        const prev = document.createElement('button'); prev.type='button'; prev.className='btn btn-ghost'; prev.textContent='Prev'; prev.style.display='none';
        const next = document.createElement('button'); next.type='button'; next.className='btn'; next.textContent='Next';
        nav.appendChild(prev); nav.appendChild(next);
        quizContent.appendChild(nav);
        return { progressBar, timer, questionsContainer, prev, next };
      }

      let quizUI = null; let quizTimerId = null; let perQuestionSeconds = 40; // per-question timer
      function startQuestionTimer(seconds, timerEl, onExpire){
        let remaining = seconds; timerEl.textContent = `${remaining}s`;
        quizTimerId && clearInterval(quizTimerId);
        quizTimerId = setInterval(()=>{
          remaining--; if(remaining < 0){ clearInterval(quizTimerId); quizTimerId=null; if(onExpire) onExpire(); return; }
          timerEl.textContent = `${remaining}s`;
          // announce time left every 10s for screenreaders
          try{ const announcer = document.getElementById('quiz-announcer'); if(announcer && remaining % 10 === 0) announcer.textContent = `${remaining} seconds remaining`; }catch(e){}
        }, 1000);
      }

      function openQuizForRole(role){
        if(!quizModal || !quizContent) return;
        const qlist = quizzes[role] || [];
        currentQuiz = { role, answers: Array(qlist.length).fill(null), startedAt: Date.now() };
        // focus management: remember previous active element and trap focus inside quiz
        lastActiveQuizElement = document.activeElement;
        quizModal.classList.add('open'); quizModal.setAttribute('aria-hidden','false');
        quizResult.style.display = 'none'; quizContent.innerHTML = '';
        quizUI = buildQuizUI(role);
        if(!quizUI) return;
        // show first question
        renderQuestion(0);
        // wire nav
        quizUI.prev.addEventListener('click', ()=> { renderQuestion(Math.max(0, currentQuiz.index - 1)); });
        quizUI.next.addEventListener('click', ()=> { renderQuestion(Math.min(currentQuiz.total - 1, currentQuiz.index + 1)); });
        // trap tab and handle keyboard shortcuts inside quiz modal
        const dialog = quizModal.querySelector('.quiz-dialog');
        quizKeyHandler = function(e){
          // Tab trapping
          if(e.key === 'Tab'){
            const focusables = getFocusable(dialog);
            if(!focusables.length) return;
            const first = focusables[0], last = focusables[focusables.length - 1];
            if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
            else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
          }
          if(e.key === 'Escape'){ e.preventDefault(); closeQuizModal(); }
          // convenient keys: N or ArrowRight -> next, P or ArrowLeft -> prev
          if(e.key === 'ArrowRight' || e.key === 'N' || e.key === 'n'){ e.preventDefault(); try{ quizUI.next.click(); }catch(_){} }
          if(e.key === 'ArrowLeft' || e.key === 'P' || e.key === 'p'){ e.preventDefault(); try{ quizUI.prev.click(); }catch(_){} }
        };
        document.addEventListener('keydown', quizKeyHandler);
        // focus first interactive element in dialog
        setTimeout(()=>{
          const firstFocus = dialog.querySelector('label[tabindex], input, button'); if(firstFocus) firstFocus.focus();
        }, 40);
      }

      function renderQuestion(idx){
        const role = currentQuiz.role; const qlist = quizzes[role] || [];
        currentQuiz.total = qlist.length; currentQuiz.index = idx;
        const qEls = quizUI.questionsContainer.querySelectorAll('.question');
        qEls.forEach((el, i)=> el.style.display = i === idx ? '' : 'none');
        // update progress bar
        const pct = Math.round(((idx) / Math.max(1, qlist.length)) * 100);
        quizUI.progressBar.style.width = pct + '%';
        // show/hide nav buttons
        quizUI.prev.style.display = idx === 0 ? 'none' : 'inline-flex';
        quizUI.next.style.display = idx === qlist.length - 1 ? 'none' : 'inline-flex';
        // update timer for this question
        startQuestionTimer(perQuestionSeconds, quizUI.timer, ()=>{
          // mark unanswered as skipped (null) and move next
          currentQuiz.answers[idx] = currentQuiz.answers[idx] === undefined ? null : currentQuiz.answers[idx];
          if(idx < qlist.length -1) renderQuestion(idx+1); else finalizeQuiz();
        });
        // restore previous selection if any
        const radios = qEls[idx].querySelectorAll('input[type="radio"]');
        radios.forEach(r => r.checked = false);
        if(currentQuiz.answers[idx] !== null && currentQuiz.answers[idx] !== undefined){
          const choice = currentQuiz.answers[idx];
          const sel = qEls[idx].querySelector('input[value="' + choice + '"]'); if(sel) sel.checked = true;
        }
        // selection handler: immediate feedback, save and auto-advance
        radios.forEach(r => {
          r.addEventListener('change', ()=>{
            const chosen = parseInt(r.value,10);
            currentQuiz.answers[idx] = chosen;
            saveQuizDraft(role, currentQuiz.answers);
            // show immediate feedback visually
            try{
              const qarr = quizzes[role] || [];
              const correctIdx = (qarr[idx] && typeof qarr[idx].correct !== 'undefined') ? qarr[idx].correct : 0;
              const labels = qEls[idx].querySelectorAll('label');
              labels.forEach((lab)=>{ lab.style.opacity = '0.6'; });
              // mark correct and chosen
              labels.forEach((lab)=>{
                const inp = lab.querySelector('input');
                if(!inp) return;
                const val = parseInt(inp.value,10);
                if(val === correctIdx){ lab.style.background = '#e6ffef'; lab.style.borderColor = '#b8f0c6'; }
                if(val === chosen && val !== correctIdx){ lab.style.background = '#fff0f0'; lab.style.borderColor = '#ffbdbd'; }
              });
              const explain = qEls[idx].querySelector('.explain');
              if(explain){ explain.style.display = 'block'; explain.textContent = qarr[idx] && qarr[idx].explanation ? qarr[idx].explanation : ''; }
            }catch(e){}
            // disable all inputs for this question to lock answer
            radios.forEach(x=> x.disabled = true);
            // auto-advance after a short delay
            setTimeout(()=>{
              if(idx < (currentQuiz.total - 1)) renderQuestion(idx + 1);
              else finalizeQuiz();
            }, 900);
          });
        });
        // allow keyboard arrow navigation between options: focus first label
        try{ const labels = qEls[idx].querySelectorAll('label'); if(labels && labels.length) labels[0].focus(); }catch(e){}
      }

      function saveQuizDraft(role, answers){
        try{ localStorage.setItem('quizDraft_' + role, JSON.stringify({ answers, savedAt: Date.now() })); }catch(e){}
      }

      function finalizeQuiz(){
        quizTimerId && clearInterval(quizTimerId); quizTimerId = null;
        const role = currentQuiz.role; const qlist = quizzes[role] || [];
        let correct = 0; const total = qlist.length; const details = [];
        qlist.forEach((qq, idx)=>{
          const chosen = currentQuiz.answers[idx];
          const isCorrect = chosen !== null && chosen !== undefined && parseInt(chosen,10) === qq.correct;
          if(isCorrect) correct++;
          details.push({ q: qq.q, choices: qq.a, chosen: chosen, correct: qq.correct, explanation: qq.explanation || '' });
        });
        const percent = total ? Math.round((correct/total)*100) : 0;
        // show detailed feedback inside modal
        quizContent.innerHTML = '';
        const summary = document.createElement('div'); summary.className='quiz-summary'; summary.innerHTML = `<h4>Result: ${percent}% (${correct}/${total})</h4>`;
        quizContent.appendChild(summary);
        details.forEach((d, i)=>{
          const item = document.createElement('div'); item.className = 'quiz-review'; item.style.marginTop='10px';
          const qh = document.createElement('p'); qh.style.fontWeight='700'; qh.textContent = (i+1) + '. ' + d.q; item.appendChild(qh);
          d.choices.forEach((c, ci)=>{
            const li = document.createElement('div'); li.style.display='flex'; li.style.gap='8px'; li.style.alignItems='center';
            const mark = document.createElement('div'); mark.style.width='10px'; mark.style.height='10px'; mark.style.borderRadius='50%';
            if(ci === d.correct) mark.style.background = '#2ecc71'; else if(ci === d.chosen) mark.style.background = '#ff6b6b'; else mark.style.background = '#eee';
            const span = document.createElement('span'); span.textContent = c; span.style.marginLeft='6px';
            li.appendChild(mark); li.appendChild(span); item.appendChild(li);
          });
          if(d.explanation){ const ex = document.createElement('div'); ex.style.marginTop='6px'; ex.style.fontSize='13px'; ex.style.color='var(--space-cadet-1)'; ex.textContent = 'Explanation: ' + d.explanation; item.appendChild(ex); }
          quizContent.appendChild(item);
        });
        // attach detailed result to form
        try{
          let hidden = form.querySelector('input[name="quizDetails"]');
          if(!hidden){ hidden = document.createElement('input'); hidden.type='hidden'; hidden.name='quizDetails'; form.appendChild(hidden); }
          hidden.value = JSON.stringify({ role, percent, correct, total, details, attemptedAt: new Date().toISOString() });
          let hidden2 = form.querySelector('input[name="quizScore"]');
          if(!hidden2){ hidden2 = document.createElement('input'); hidden2.type='hidden'; hidden2.name='quizScore'; form.appendChild(hidden2); }
          hidden2.value = percent;
        }catch(e){}
        // save attempt history
        try{
          const key = 'quizAttempts_' + role; const prev = JSON.parse(localStorage.getItem(key) || '[]'); prev.push({ percent, correct, total, at: new Date().toISOString() }); localStorage.setItem(key, JSON.stringify(prev));
        }catch(e){}
        // show badge on card
        showCardBadge(role, percent);
        // show retake button
        const retake = document.createElement('button'); retake.className='btn'; retake.textContent='Retake Quiz'; retake.style.marginTop='14px'; retake.addEventListener('click', ()=>{ openQuizForRole(role); });
        quizContent.appendChild(retake);
        // announce final score for screen readers
        try{ const announcer = document.getElementById('quiz-announcer'); if(announcer) announcer.textContent = `Quiz complete. You scored ${percent} percent.`; }catch(e){}
        // focus retake button so keyboard users can act
        try{ setTimeout(()=> retake.focus(), 40); }catch(e){}
      }

      function closeQuizModal(){ if(!quizModal) return; quizModal.classList.remove('open'); quizModal.setAttribute('aria-hidden','true'); quizTimerId && clearInterval(quizTimerId); try{ document.removeEventListener('keydown', quizKeyHandler); }catch(e){} try{ if(lastActiveQuizElement) lastActiveQuizElement.focus(); }catch(e){} }
      if(closeQuiz) closeQuiz.addEventListener('click', closeQuizModal);
      if(cancelQuiz) cancelQuiz.addEventListener('click', closeQuizModal);
      if(submitQuiz) submitQuiz.addEventListener('click', function(){ finalizeQuiz(); });
      rolesGrid.addEventListener('click', function(e){
        const btn = e.target.closest('.select-role');
        const quizBtn = e.target.closest('.quiz-btn');
        const card = e.target.closest('.intern-role-card');
        if(!card) return;

        // If user clicked the Apply button, open inline apply form (existing behavior)
        if(btn && form){
          const role = card.dataset.role || (card.querySelector('.irc-title') && card.querySelector('.irc-title').textContent) || '';
          const roleField = form.querySelector('[name="role"]');
          if(roleField) roleField.value = role;
          openForm();
          const nameField = form.querySelector('[name="name"]');
          if(nameField) nameField.focus();
          return;
        }

        // If user clicked Quick Quiz button, the existing quiz handler is already wired on each quizBtn.
        if(quizBtn){ return; }

        // Otherwise: navigate to role detail page. Preserve existing UX by opening in same tab.
        try{
          const roleName = card.dataset.role || (card.querySelector('.irc-title') && card.querySelector('.irc-title').textContent) || '';
          const href = 'role.html?role=' + encodeURIComponent(roleName);
          window.location.href = href;
        }catch(e){
          // fallback: toggle expand if navigation fails
          const isExpanded = card.classList.contains('expanded');
          if(isExpanded){ card.classList.remove('expanded'); card.setAttribute('aria-expanded','false'); }
          else { card.classList.add('expanded'); card.setAttribute('aria-expanded','true'); }
        }
      });

      // View-role modal open (from the view buttons added earlier)
      const rolePreviewModal = document.getElementById('rolePreviewModal');
      const closeRolePreview = document.getElementById('closeRolePreview');
      const rolePreviewClose = document.getElementById('rolePreviewClose');
      const rolePreviewApply = document.getElementById('rolePreviewApply');
      let _lastActiveRolePreview = null;
      let _rolePreviewKeyHandler = null;
      function openRolePreview(card){
        if(!rolePreviewModal || !card) return;
        _lastActiveRolePreview = document.activeElement;
        const title = card.querySelector('.irc-title') ? card.querySelector('.irc-title').textContent : (card.dataset.role || 'Role');
        const short = card.querySelector('.irc-desc') ? card.querySelector('.irc-desc').textContent : '';
        const long = card.dataset.longdesc || short;
        document.getElementById('rolePreviewTitle').textContent = title;
        document.getElementById('rolePreviewShort').textContent = (card.dataset.role || title);
        document.getElementById('rolePreviewDesc').textContent = long;
        const learn = document.getElementById('rolePreviewLearn'); learn.innerHTML = '';
        // derive a few learning bullets from description heuristically
        const bullets = [ 'Hands-on project experience', 'Mentor feedback & code reviews', 'Certificate on completion' ];
        bullets.forEach(b => { const li = document.createElement('li'); li.textContent = b; learn.appendChild(li); });
        // show modal and trap focus
        rolePreviewModal.style.display = 'flex'; rolePreviewModal.setAttribute('aria-hidden','false');
        const dlg = rolePreviewModal.querySelector('.modal-dialog'); const focusables = getFocusable(dlg); if(focusables.length) focusables[0].focus();
        // focus trap and ESC handling
        _rolePreviewKeyHandler = function(e){
          if(e.key === 'Escape'){ e.preventDefault(); closeRolePreviewModal(); }
          if(e.key === 'Tab'){
            const nodes = getFocusable(dlg);
            if(!nodes.length) return;
            const first = nodes[0], last = nodes[nodes.length - 1];
            if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
            else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
          }
        };
        document.addEventListener('keydown', _rolePreviewKeyHandler);
      }
      // attach view button listeners
      Array.from(rolesGrid.querySelectorAll('.view-role')).forEach(v => v.addEventListener('click', function(e){ e.stopPropagation(); const card = e.target.closest('.intern-role-card'); openRolePreview(card); }));
      function closeRolePreviewModal(){ if(rolePreviewModal){ rolePreviewModal.style.display='none'; rolePreviewModal.setAttribute('aria-hidden','true'); } try{ if(_rolePreviewKeyHandler) document.removeEventListener('keydown', _rolePreviewKeyHandler); }catch(e){} try{ if(_lastActiveRolePreview) _lastActiveRolePreview.focus(); }catch(e){} _rolePreviewKeyHandler = null; _lastActiveRolePreview = null; }
      if(closeRolePreview) closeRolePreview.addEventListener('click', closeRolePreviewModal);
      if(rolePreviewClose) rolePreviewClose.addEventListener('click', closeRolePreviewModal);
      if(rolePreviewApply) rolePreviewApply.addEventListener('click', function(){ const card = Array.from(rolesGrid.querySelectorAll('.intern-role-card')).find(c => c.querySelector('.irc-title') && c.querySelector('.irc-title').textContent === document.getElementById('rolePreviewTitle').textContent); if(card){ const form = document.getElementById('internForm'); if(form){ const roleField = form.querySelector('[name="role"]'); if(roleField) roleField.value = card.dataset.role || ''; const openBtn = document.getElementById('openApplyInline'); if(openBtn) openBtn.click(); } } closeRolePreviewModal(); });

      // subtle chip animation on hover for polish
      Array.from(rolesGrid.querySelectorAll('.role-chip')).forEach(ch => {
        ch.addEventListener('mouseenter', () => { ch.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0px)' }], { duration: 520, easing: 'cubic-bezier(.2,.9,.2,1)' }); });
      });

      // animate filter buttons (visual feedback)
      [filterAll, filterTech, filterCreative].forEach(btn => { if(!btn) return; btn.addEventListener('click', function(){ btn.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 360, easing: 'cubic-bezier(.2,.9,.2,1)' }); }); });

      // keyboard: Enter toggles expand, Space opens apply if focused on select-role
      rolesGrid.addEventListener('keydown', function(e){
        const card = e.target.closest('.intern-role-card');
        if(!card) return;
        if(e.key === 'Enter'){
          // behave like click
          const roleField = form && form.querySelector('[name="role"]');
          if(roleField) roleField.value = card.dataset.role || '';
          openForm();
        }
        if(e.key === ' '){
          e.preventDefault();
          const expanded = card.classList.toggle('expanded');
          card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
      });
    }

  });
})();

// Extra: Schedule Interview CTA animations (ripple, particle burst, icon spin, inline slide)
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('calendlyOpenBtn');
    const inline = document.getElementById('calendlyInlineMain');
    if(!btn) return;

    // create particle container (absolute relative to body)
    function particleBurst(x, y){
      const colors = ['#ffd371','#ff9a9e','#6ad6ff','#7be6ff','#b39cff'];
      const count = 12;
      for(let i=0;i<count;i++){
        const p = document.createElement('div'); p.className = 'cal-particle';
        p.style.background = colors[Math.floor(Math.random()*colors.length)];
        document.body.appendChild(p);
        // position center
        p.style.left = (x - 4) + 'px'; p.style.top = (y - 4) + 'px';
        const ang = (Math.random() * Math.PI * 2);
        const dist = 40 + Math.random()*80;
        const tx = Math.cos(ang) * dist;
        const ty = Math.sin(ang) * dist - (20 + Math.random()*20);
        const rot = (Math.random() * 360) + 'deg';
        p.animate([
          { transform: 'translate3d(0,0,0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: `translate3d(${tx}px, ${ty}px, 0) scale(.7) rotate(${rot})`, opacity: 0 }
        ], { duration: 700 + Math.random()*500, easing: 'cubic-bezier(.2,.9,.2,1)' });
        setTimeout(()=> p.remove(), 1400);
      }
    }

    function createRipple(e){
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX || (rect.left + rect.width/2));
      const y = (e.clientY || (rect.top + rect.height/2));
      const r = document.createElement('span'); r.className = 'ripple';
      r.style.left = (x - rect.left) + 'px'; r.style.top = (y - rect.top) + 'px';
      r.style.width = r.style.height = Math.max(rect.width, rect.height) + 'px';
      btn.appendChild(r);
      // trigger animation
      requestAnimationFrame(()=> r.classList.add('animate'));
      setTimeout(()=>{ try{ r.remove(); }catch(e){} }, 700);
    }

    function spinIcon(){
      const icon = btn.querySelector('.btn-icon'); if(!icon) return;
      icon.classList.add('icon-spin'); setTimeout(()=> icon.classList.remove('icon-spin'), 800);
    }

    // pointerdown to start ripple & spin quickly
    btn.addEventListener('pointerdown', function(ev){ try{ createRipple(ev); spinIcon(); }catch(e){} });

    // click: particle burst and small pop animation (will not interrupt existing calendly handler)
    btn.addEventListener('click', function(ev){
      try{
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width/2; const cy = rect.top + rect.height/2;
        particleBurst(cx, cy);
        // subtle scale pop
        btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.2,.9,.2,1)' });
      }catch(e){}
    }, true);

    // dblclick: toggle inline open class for slide animation
    btn.addEventListener('dblclick', function(){
      if(!inline) return;
      const isOpen = inline.classList.toggle('open');
      if(isOpen){ inline.setAttribute('aria-hidden','false'); inline.style.display = ''; }
      else { inline.setAttribute('aria-hidden','true'); /* keep display but animation will collapse */ }
    });

    // If inline container created by HTML script, ensure initial state closed
    if(inline){ inline.setAttribute('aria-hidden', 'true'); inline.classList.remove('open'); inline.style.display = 'none'; }

    // expose a small helper on window for debugging
    window.__techseva_calendly_anim = { particleBurst, createRipple, spinIcon };
  });
})();

  // Schedule header entrance + sparkle interactivity
  (function(){
    try{
      const title = document.getElementById('scheduleTitle');
      if(!title) return;
      // Ensure reduced-motion respects user preference
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Entrance: observe when it comes into view
      if(!prefersReduced){
        try{
          const io = new IntersectionObserver((entries, obs)=>{
            entries.forEach(ent => { if(ent.isIntersecting){ title.classList.add('in-view'); obs.unobserve(title); } });
          }, { threshold: 0.25 });
          io.observe(title);
        }catch(e){ title.classList.add('in-view'); }
      } else { title.classList.add('in-view'); }

          // Toggle inline Calendly and sparkle on click; keyboard support
          const inline = document.getElementById('calendlyInlineMain');
          function toggleInline(open){
            if(!inline) return;
            const willOpen = typeof open === 'boolean' ? open : !inline.classList.contains('open');
            inline.classList.toggle('open', willOpen);
            inline.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
            inline.style.display = willOpen ? '' : (prefersReduced ? 'none' : '');
            title.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          }

          title.addEventListener('click', function(ev){
            // toggle inline scheduler first
            try{ toggleInline(); }catch(e){}
            // then sparkle (if allowed)
            if(!prefersReduced){
              const rect = title.getBoundingClientRect();
              const x = ev.clientX - rect.left; const y = ev.clientY - rect.top;
              const s = document.createElement('span'); s.className = 'spark'; s.style.left = x + 'px'; s.style.top = y + 'px';
              const dx = (Math.random() - 0.5) * 48 + 'px'; const dy = (Math.random() - 0.8) * -38 + 'px';
              s.style.setProperty('--dx', dx); s.style.setProperty('--dy', dy);
              s.style.background = 'radial-gradient(circle, rgba(255,213,74,1) 0%, rgba(255,107,107,1) 60%)';
              title.appendChild(s);
              setTimeout(()=>{ try{ s.remove(); }catch(e){} }, 780);
            }
          });

          // keyboard: Enter / Space toggles inline scheduler
          title.addEventListener('keydown', function(e){
            if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); try{ toggleInline(); }catch(ex){} }
            if(e.key === 'Escape'){ try{ toggleInline(false); }catch(ex){} }
          });
    }catch(e){/* noop */}
  })();

/* ---------- NEW: Hero rotate, '/' search shortcut, floating Apply CTA, flip behavior ---------- */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Rotating hero keywords (non-blocking)
    try{
      const title = document.querySelector('.wd-title');
      if(title){
        const container = document.createElement('span'); container.className = 'rotate';
        const rotating = document.createElement('span'); rotating.className = 'rotate-text'; container.appendChild(rotating);
        title.appendChild(container);
        const words = ['Web','App','UI/UX','AI/ML','Content']; let i=0;
        function showNext(){ rotating.textContent = words[i]; container.classList.add('animate'); setTimeout(()=> container.classList.remove('animate'), 900); i = (i+1) % words.length; }
        showNext(); setInterval(showNext, 2400);
      }
    }catch(e){/* ignore */}

    // Keyboard: focus search on pressing '/'
    try{
      const search = document.getElementById('roleSearch');
      window.addEventListener('keydown', function(e){
        if(e.key === '/' && document.activeElement !== search && !(e.metaKey||e.ctrlKey||e.altKey)){
          if(search){ e.preventDefault(); search.focus(); search.select(); }
        }
      });
    }catch(e){ }

    // Floating Apply CTA: create and wire up
    try{
      const floating = document.createElement('button'); floating.className = 'floating-apply'; floating.id = 'floatingApply'; floating.setAttribute('aria-label','Apply Now');
      floating.innerHTML = '<span class="label">Apply</span>';
      document.body.appendChild(floating);
      const openBtn = document.getElementById('openApplyInline');
      floating.addEventListener('click', function(){ if(openBtn) openBtn.click(); else { const formWrap = document.getElementById('apply-form'); if(formWrap){ formWrap.style.display = 'flex'; formWrap.setAttribute('aria-hidden','false'); } } });
      // hide floating when near footer/when the form is visible
      const footer = document.querySelector('footer');
      function updateFloating(){ try{
        const rect = footer && footer.getBoundingClientRect();
        if(rect && rect.top < window.innerHeight - 120){ floating.style.opacity = '0'; floating.style.pointerEvents = 'none'; } else { floating.style.opacity = ''; floating.style.pointerEvents = ''; }
      }catch(e){}
      }
      document.addEventListener('scroll', throttle(updateFloating, 150)); updateFloating();
    }catch(e){ }

    // small throttle helper
    function throttle(fn, wait){ let busy = false; return function(){ if(busy) return; busy = true; setTimeout(()=>{ fn(); busy = false; }, wait); }; }

    // Flip card toggle on double-click or keyboard 'f'
    try{
      const grid = document.getElementById('rolesGrid');
      if(grid){
        grid.addEventListener('dblclick', function(e){ const card = e.target.closest('.intern-role-card'); if(!card) return; card.classList.toggle('flipped'); const back = card.querySelector('.card-back'); if(back) back.setAttribute('aria-hidden', card.classList.contains('flipped') ? 'false' : 'true'); });
        grid.addEventListener('keydown', function(e){ const card = e.target.closest('.intern-role-card'); if(!card) return; if(e.key.toLowerCase() === 'f'){ e.preventDefault(); card.classList.toggle('flipped'); const back = card.querySelector('.card-back'); if(back) back.setAttribute('aria-hidden', card.classList.contains('flipped') ? 'false' : 'true'); } });
      }
    }catch(e){ }

    // IntersectionObserver to reveal elements with .reveal-up class (benefits etc.)
    try{
      const ro = new IntersectionObserver((entries, obs)=>{ entries.forEach(ent=>{ if(ent.isIntersecting){ ent.target.classList.add('visible'); obs.unobserve(ent.target); } }); }, { threshold: 0.12 });
      document.querySelectorAll('.reveal-up').forEach(el=> ro.observe(el));
    }catch(e){ }
  });
})();
