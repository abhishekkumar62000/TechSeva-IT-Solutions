'use strict';



/**
 * navbar toggle
 */

document.addEventListener('DOMContentLoaded', function () {
  // Typewriter effect for hero
  (function typewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const phrases = ['Design that converts', 'Performance & security', 'SEO-ready, mobile-first', 'Built to scale'];
    let pi = 0, idx = 0, forward = true;
    function tick() {
      const text = phrases[pi];
      el.textContent = text.slice(0, idx);
      if (forward) { idx++; if (idx > text.length) { forward = false; setTimeout(tick, 1200); return; } }
      else { idx--; if (idx < 0) { forward = true; pi = (pi + 1) % phrases.length; idx = 0; } }
      setTimeout(tick, forward ? 80 : 30);
    }
    tick();
  })();

  // Reveal on scroll
  (function revealOnScroll() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.18 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  })();

  const navOpenBtn = document.querySelector('[data-nav-open-btn]');
  const navCloseBtn = document.querySelector('[data-nav-close-btn]');
  const navbar = document.querySelector('[data-navbar]');
  const overlay = document.querySelector('[data-overlay]');

  navOpenBtn.addEventListener('click', function () {
    navbar.classList.add('active');
    overlay.classList.add('active');
  });

  navCloseBtn.addEventListener('click', function () {
    navbar.classList.remove('active');
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', function () {
    navbar.classList.remove('active');
    overlay.classList.remove('active');
  });

  const navbarLinks = document.querySelectorAll("[data-navbar-link]");

  for (let i = 0; i < navbarLinks.length; i++) {
    navbarLinks[i].addEventListener("click", function () {
      navbar.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

});

/**
 * header & go-top-btn active
 * when window scroll down to 400px
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 400) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});


/* Custom Tidio integration removed */

/* Website Development page interactivity: accordion + preview theme toggles */
document.addEventListener('DOMContentLoaded', function () {
  // Accordion FAQ
  const accBtns = document.querySelectorAll('.wd-accordion button');
  accBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isActive = panel.classList.contains('active');
      // collapse all
      document.querySelectorAll('.wd-accordion .panel').forEach(p => p.classList.remove('active'));
      if (!isActive) panel.classList.add('active');
    });
  });

  // Preview theme toggles (live mock)
  const preview = document.querySelector('.preview-mock');
  document.querySelectorAll('[data-preview-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-preview-theme');
      if (!preview) return;
      preview.dataset.theme = theme;
      // simple visual change
      if (theme === 'dark') {
        preview.style.background = 'linear-gradient(180deg,#0f1724,#0b1020)';
        preview.style.color = '#fff';
      } else if (theme === 'light') {
        preview.style.background = '#fff';
        preview.style.color = '#0b1020';
      } else if (theme === 'accent') {
        preview.style.background = 'linear-gradient(90deg, var(--razzmatazz), var(--rajah))';
        preview.style.color = '#fff';
      }
    });
  });

  // Request Quote CTA: prefill mailto if present
  const quoteBtns = document.querySelectorAll('[data-mailto]');
  quoteBtns.forEach(b => b.addEventListener('click', (e) => {
    const mailto = b.getAttribute('data-mailto');
    if (mailto) window.location.href = mailto;
  }));

});

/* --- Enhancements: form endpoint & helpers --- */
// If you have a Formspree or other endpoint, paste it here (e.g. 'https://formspree.io/f/xxxxx')
const FORM_ENDPOINT = '';

// Razorpay public key (safe to include in client). Do NOT put the secret key here.
const RAZORPAY_KEY_ID = 'rzp_live_Ri0GsLreivAUvY';
// Order creation endpoint (server). Prefer configuring via `assets/js/site-config.js`.
const ORDER_ENDPOINT = (window.SITE_CONFIG && window.SITE_CONFIG.ORDER_ENDPOINT) ? window.SITE_CONFIG.ORDER_ENDPOINT : '/create_order';

function animateNumber(el, start, end, duration = 500) {
  const startTime = performance.now();
  function frame(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (end - start) * t);
    el.textContent = '₹' + value.toLocaleString('en-IN');
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function showStep(modal, step) {
  const steps = modal.querySelectorAll('.step');
  steps.forEach(s => s.classList.remove('active'));
  const active = modal.querySelector(`.step[data-step="${step}"]`);
  if (active) active.classList.add('active');
  // progress dots
  const dots = modal.querySelectorAll('.modal-progress .dot');
  dots.forEach((d, i) => d.classList.toggle('active', i < step));
}


// ripple effect for featured service card and make it keyboard-focusable
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.service-card--link').forEach(el => {
    // allow keyboard activation
    el.tabIndex = 0;
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') el.click(); });

    el.addEventListener('click', function (ev) {
      // create ripple
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (ev.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (ev.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
});

/* Additional interactions for website-development page */
document.addEventListener('DOMContentLoaded', function () {
  // Pricing toggle
  const pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.querySelectorAll('.price').forEach(el => {
        const m = el.getAttribute('data-price-month');
        const y = el.getAttribute('data-price-year');
        const val = checked && y ? y : m;
        if (val) {
          el.textContent = '₹' + Number(val).toLocaleString('en-IN');
          el.classList.add('animated');
          setTimeout(() => el.classList.remove('animated'), 400);
        }
      });
    });
  }

  // Modal contact
  const openContact = document.getElementById('openContact');
  let modal = document.querySelector('.modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-progress">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <h3>Start a Project — Quick Brief</h3>
        <div class="step active" data-step="1">
          <div class="modal-row">
            <input id="m-name" placeholder="Your name" />
            <input id="m-email" placeholder="Email" />
          </div>
          <div style="margin-top:10px; font-size:0.9rem; color:var(--purple-navy);">Step 1 — contact</div>
          <div class="modal-actions">
            <button type="button" id="modalCancel" class="btn">Cancel</button>
            <button type="button" id="modalNext1" class="btn">Next</button>
          </div>
        </div>

        <div class="step" data-step="2">
          <div style="margin-top:10px;"><textarea id="m-msg" placeholder="Short project brief, goals & must-haves" rows="4"></textarea></div>
          <div style="margin-top:10px; display:flex; gap:8px; align-items:center;"><input type="file" id="m-file" /><small style="color:#666">Upload attachments (mockups, brief)</small></div>
          <div style="margin-top:8px; font-size:0.9rem; color:var(--purple-navy);">Step 2 — project details</div>
          <div class="modal-actions">
            <button type="button" id="modalPrev2" class="btn">Back</button>
            <button type="button" id="modalNext2" class="btn">Next</button>
          </div>
        </div>

        <div class="step" data-step="3">
          <div style="margin-top:8px;"><strong>Review & send</strong></div>
          <div id="reviewBox" style="margin-top:8px; font-size:0.95rem; color:#333; white-space:pre-wrap;"></div>
          <div class="modal-actions">
            <button type="button" id="modalPrev3" class="btn">Back</button>
            <button type="button" id="modalSend" class="btn">Send</button>
          </div>
          <div id="modalStatus" style="margin-top:8px;font-size:13px;color:#666"></div>
        </div>

      </div>`;
    document.body.appendChild(modal);

    // hold file in memory for optional upload
    modal._file = null;

    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) modal.classList.remove('active');
    });

    // step controls (scoped and defensive)
    const btnCancel = modal.querySelector('#modalCancel');
    const btnNext1 = modal.querySelector('#modalNext1');
    const btnPrev2 = modal.querySelector('#modalPrev2');
    const btnNext2 = modal.querySelector('#modalNext2');
    const btnPrev3 = modal.querySelector('#modalPrev3');
    const btnSend = modal.querySelector('#modalSend');
    const statusEl = modal.querySelector('#modalStatus');

    btnCancel && btnCancel.addEventListener('click', () => modal.classList.remove('active'));
    btnNext1 && btnNext1.addEventListener('click', () => {
      const name = modal.querySelector('#m-name').value.trim();
      const email = modal.querySelector('#m-email').value.trim();
      if (!name || !email) { statusEl && (statusEl.textContent = 'Please enter name and email'); statusEl && (statusEl.style.color='red'); return; }
      statusEl && (statusEl.textContent = ''); showStep(modal, 2);
    });
    btnPrev2 && btnPrev2.addEventListener('click', () => showStep(modal, 1));
    btnNext2 && btnNext2.addEventListener('click', () => {
      const msg = modal.querySelector('#m-msg').value.trim();
      if (!msg) { statusEl && (statusEl.textContent = 'Please enter a short project brief'); statusEl && (statusEl.style.color='red'); return; }
      // populate review
      const name = modal.querySelector('#m-name').value.trim();
      const email = modal.querySelector('#m-email').value.trim();
      const review = `Name: ${name}\nEmail: ${email}\n\nBrief:\n${msg}`;
      modal.querySelector('#reviewBox').textContent = review;
      statusEl && (statusEl.textContent = ''); showStep(modal, 3);
    });
    btnPrev3 && btnPrev3.addEventListener('click', () => showStep(modal, 2));

    // file input
    const fileInput = modal.querySelector('#m-file');
    fileInput && fileInput.addEventListener('change', (e) => { modal._file = e.target.files[0] || null; });

    // send handler (scoped, robust)
    if (btnSend) {
      btnSend.addEventListener('click', async () => {
        try {
          const name = modal.querySelector('#m-name').value.trim();
          const email = modal.querySelector('#m-email').value.trim();
          const msg = modal.querySelector('#m-msg').value.trim();
          const file = modal._file;
          if (!name || !email || !msg) { statusEl && (statusEl.textContent = 'Missing fields'); statusEl && (statusEl.style.color='red'); return; }

          statusEl && (statusEl.style.color = '#666'); statusEl && (statusEl.textContent = 'Sending...'); btnSend.disabled = true; btnSend.textContent = 'Sending...';

          // if FORM_ENDPOINT provided, submit via fetch
          if (FORM_ENDPOINT) {
            const fd = new FormData();
            fd.append('name', name); fd.append('email', email); fd.append('message', msg);
            if (file) fd.append('attachment', file, file.name);
            const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: fd });
            if (res.ok) { statusEl && (statusEl.style.color='green'); statusEl && (statusEl.textContent = 'Thanks — we received your request'); modal.classList.remove('active'); }
            else { statusEl && (statusEl.style.color='red'); statusEl && (statusEl.textContent = 'Submission failed — please try mail client or contact us'); console.error('Form submission failed', res.status, await res.text().catch(()=>'')); }
            btnSend.disabled = false; btnSend.textContent = 'Send';
            return;
          }

          // fallback: create mailto but also show in-modal confirmation so user has feedback
          const subject = encodeURIComponent('Website Development Inquiry from ' + name);
          const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
          // try to open mail client, but always show confirmation in UI
          try { window.location.href = `mailto:info@techsevasolutions.com?subject=${subject}&body=${body}`; } catch (err) { console.warn('mailto failed', err); }
          statusEl && (statusEl.style.color='green'); statusEl && (statusEl.textContent = 'Prepared mailto — check your mail client. We also saved a local copy.');

          // save local copy
          try {
            const key = 'quick_modal_submissions';
            const stored = JSON.parse(localStorage.getItem(key) || '[]');
            stored.push({ name, email, msg, ts: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(stored));
          } catch (err) { console.error('Saving local submission failed', err); }

          btnSend.disabled = false; btnSend.textContent = 'Send';
        } catch (err) {
          console.error('Send handler error', err);
          statusEl && (statusEl.style.color='red'); statusEl && (statusEl.textContent = 'Unexpected error — check console');
          try { btnSend.disabled = false; btnSend.textContent = 'Send'; } catch (e) {}
        }
      });
    }
  }

  if (openContact) openContact.addEventListener('click', () => modal.classList.add('active'));

  // Floating CTA: open same modal when floating button clicked
  const floatingBtn = document.getElementById('floatingQuote');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      if (modal) modal.classList.add('active');
      // focus the first input for accessibility
      setTimeout(() => {
        const inpt = modal && modal.querySelector('#m-name');
        if (inpt) inpt.focus();
      }, 150);
    });
  }

  // Download spec (generate simple text file)
  const dl = document.getElementById('downloadSpec');
  if (dl) dl.addEventListener('click', () => {
    const spec = `TechSeva Website Spec\n\nPlease provide:\n- Business goals\n- Target audience\n- Key pages\n- Reference websites\n- Required integrations\n`;
    const blob = new Blob([spec], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'techseva-website-spec.txt';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  // App download spec: collect basic inputs and generate a TXT spec
  const dlApp = document.getElementById('downloadAppSpec');
  if (dlApp) dlApp.addEventListener('click', () => {
    try {
      const name = prompt('Your name (required):');
      if (!name) return alert('Name is required to generate the spec.');
      const email = prompt('Email (required):');
      if (!email) return alert('Email is required to generate the spec.');
      const project = prompt('Project name / app idea (brief):') || '';
      const platforms = prompt('Target platforms (e.g. Android, iOS, Both, Web):') || '';
      const audience = prompt('Target audience / users (brief):') || '';
      const features = prompt('List core features (comma separated):') || '';
      const timeline = prompt('Estimated timeline (e.g. 8–12 weeks):') || '';
      const budget = prompt('Estimated budget (optional):') || '';

      const spec = `TechSeva App Spec\n\nContact:\nName: ${name}\nEmail: ${email}\n\nProject:\nTitle/Idea: ${project}\nPlatforms: ${platforms}\nTarget audience: ${audience}\nEstimated timeline: ${timeline}\nEstimated budget: ${budget}\n\nCore features:\n${features.split(',').map((f,i)=>`${i+1}. ${f.trim()}`).join('\n')}\n\nAdditional notes:\n`;

      const blobApp = new Blob([spec], { type: 'text/plain' });
      const urlApp = URL.createObjectURL(blobApp);
      const aApp = document.createElement('a');
      aApp.href = urlApp; aApp.download = 'techseva-app-spec.txt';
      document.body.appendChild(aApp); aApp.click(); aApp.remove(); URL.revokeObjectURL(urlApp);
    } catch (err) {
      console.error('Download spec error', err);
      alert('Could not generate the spec. Please try again.');
    }
  });

  // Counters animate on scroll
  const counters = document.querySelectorAll('.counter .num');
  const runCounters = () => {
    counters.forEach(el => {
      if (el.dataset.done) return;
      const end = parseInt(el.getAttribute('data-end') || '0', 10);
      if (end <= 0) return;
      const start = 0; const duration = 1200;
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(progress * (end - start) + start).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(step); else el.dataset.done = '1';
      };
      requestAnimationFrame(step);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) runCounters(); });
  }, { threshold: 0.5 });
  const counterWrap = document.querySelector('.counters');
  if (counterWrap) observer.observe(counterWrap);

  // Pricing toggle: initialize to monthly values
  if (pricingToggle) pricingToggle.dispatchEvent(new Event('change'));

});

/* Pricing calculator + Quote generation + add-to-form */
document.addEventListener('DOMContentLoaded', function () {
  // feature cards (click to select)
  const featureBoxes = Array.from(document.querySelectorAll('.feature'));
  const calcTotalEl = document.getElementById('calcTotal');
  const pricingToggleCalc = document.getElementById('pricingToggleCalc');
  const pricingModeLabel = document.getElementById('pricingMode');
  const priceFlip = document.getElementById('priceFlip');
  const breakdownEl = document.getElementById('calcBreakdown');
  const pageCount = document.getElementById('pageCount');
  const pageCountLabel = document.getElementById('pageCountLabel');
  const perPageRateEl = document.getElementById('perPageRate');
  const perPageRate = 1200; // per page price

  function computeTotal() {
    let total = 0;
    const selected = [];
    featureBoxes.forEach(el => {
      const price = Number(el.getAttribute('data-price') || 0);
      if (el.classList.contains('selected')) { total += price; selected.push({ name: el.querySelector('.fc-body strong').textContent, price }); }
    });
    const pages = pageCount ? Number(pageCount.value) : 0;
    const pagesCost = pages * perPageRate;
    total += pagesCost;

    // monthly/yearly: if yearly, apply 10% discount on yearly (12x)
    let numericTarget = total;
    if (pricingToggleCalc && pricingToggleCalc.checked) {
      numericTarget = Math.round(total * 12 * 0.9);
    }

    // update breakdown UI
    if (breakdownEl) {
      breakdownEl.innerHTML = '';
      selected.forEach(s => {
        const li = document.createElement('li'); li.textContent = `${s.name} — ₹${s.price.toLocaleString('en-IN')}`; breakdownEl.appendChild(li);
      });
      const li2 = document.createElement('li'); li2.textContent = `Pages (${pages}) — ₹${pagesCost.toLocaleString('en-IN')}`; breakdownEl.appendChild(li2);
    }

    // animate price flip
    if (priceFlip) {
      priceFlip.classList.add('flip');
      setTimeout(() => { priceFlip.classList.remove('flip'); }, 700);
      // update back value (pf-back)
      const back = priceFlip.querySelector('.pf-back');
      if (back) back.textContent = '₹' + numericTarget.toLocaleString('en-IN');
    }

    // also update quick quote
    updateQuickQuoteTotal();

    return total;
  }

  // feature card click handlers
  featureBoxes.forEach(cb => {
    cb.addEventListener('click', (e) => {
      cb.classList.toggle('selected');
      computeTotal();
    });
  });
  if (pricingToggleCalc) {
    pricingToggleCalc.addEventListener('change', function () {
      pricingModeLabel.textContent = pricingToggleCalc.checked ? 'Yearly (10% off)' : 'Monthly';
      computeTotal();
    });
  }
  computeTotal();

    // pages slider
    if (pageCount) {
      pageCount.addEventListener('input', () => {
        if (pageCountLabel) pageCountLabel.textContent = pageCount.value;
        if (perPageRateEl) perPageRateEl.textContent = '₹' + perPageRate.toLocaleString('en-IN');
        computeTotal();
      });
      // initial label
      if (pageCountLabel) pageCountLabel.textContent = pageCount.value;
      if (perPageRateEl) perPageRateEl.textContent = '₹' + perPageRate.toLocaleString('en-IN');
    }

  // Generate quote: try jsPDF, fallback to text file. Use cart if available.
  const genBtn = document.getElementById('generateQuote');
  if (genBtn) genBtn.addEventListener('click', async () => {
    const items = Object.values(CART.items);
    const lines = [];
    lines.push('TechSeva — Quote');
    lines.push('Date: ' + new Date().toLocaleString());
    lines.push('');
    lines.push('Selected features:');
    if (items.length) {
      items.forEach(it => lines.push(`${it.name} x${it.qty} — ₹${(it.price * it.qty).toLocaleString('en-IN')}`));
    } else {
      // fallback to selected feature cards
      const selected = featureBoxes.filter(cb => cb.classList.contains('selected'));
      selected.forEach(cb => lines.push(`- ${(cb.querySelector('.fc-body strong')||{textContent:'Feature'}).textContent}`));
    }
    const pages = document.getElementById('pageCount') ? Number(document.getElementById('pageCount').value) : 0;
    const perPage = 1200; const pagesCost = pages * perPage;
    if (pages) lines.push(`Pages: ${pages} — ₹${pagesCost.toLocaleString('en-IN')}`);

    const subtotal = CART.subtotal() + pagesCost;
    const yearly = document.getElementById('pricingToggleCalc') && document.getElementById('pricingToggleCalc').checked;
    const total = yearly ? Math.round(subtotal * 12 * 0.9) : subtotal;
    lines.push(''); lines.push('Total: ₹' + total.toLocaleString('en-IN'));

    // try jsPDF
    try {
      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;
        lines.forEach(line => { doc.text(line, 10, y); y += 8; });
        doc.save('techseva-quote.pdf');
        return;
      }
    } catch (e) { /* ignore */ }

    // fallback text download
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'techseva-quote.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  // Add to quote form: prefill modal inputs if form modal exists (uses cart)
  const addToFormBtn = document.getElementById('addToForm');
  if (addToFormBtn) addToFormBtn.addEventListener('click', () => {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    prefillModalFromCart(modal);
    modal.classList.add('active');
  });

});

/* Carousel + before/after slider */
document.addEventListener('DOMContentLoaded', function () {
  // insert a simple case studies carousel if container not present
  const container = document.createElement('section');
  container.className = 'section case-studies reveal';
  container.innerHTML = `
    <div class="container">
      <h2 class="h2 section-title underline">Case Studies</h2>
      <p class="text">Selected projects with interactive before/after previews.</p>
      <div class="case-carousel">
        <div class="carousel-track" id="carouselTrack">
          <div class="case-card">
            <h4>Furniture Store — Redesign</h4>
            <div class="before-after" data-preview>
              <img src="./assets/images/before-1.jpg" alt="before">
              <div class="ba-clip" style="width:50%"><img src="./assets/images/after-1.jpg" alt="after"></div>
              <div class="ba-handle" role="slider" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
          <div class="case-card">
            <h4>Startup SaaS — Landing</h4>
            <div class="before-after" data-preview>
              <img src="./assets/images/before-2.jpg" alt="before">
              <div class="ba-clip" style="width:50%"><img src="./assets/images/after-2.jpg" alt="after"></div>
              <div class="ba-handle" role="slider" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
        <div class="carousel-controls">
          <button id="carPrev" class="btn">Prev</button>
          <button id="carNext" class="btn">Next</button>
        </div>
      </div>
    </div>`;

  // insert after deliverables section
  const deliverables = document.getElementById('deliverables');
  if (deliverables && deliverables.parentNode) deliverables.parentNode.insertBefore(container, deliverables.nextSibling);

  // before/after handlers
  function setupBA(ba) {
    const clip = ba.querySelector('.ba-clip');
    const handle = ba.querySelector('.ba-handle');
    let dragging = false;
    function setPos(clientX) {
      const rect = ba.getBoundingClientRect();
      let pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      clip.style.width = (pct * 100) + '%';
      handle.style.left = (pct * 100) + '%';
    }
    handle.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });
    // touch
    handle.addEventListener('touchstart', () => dragging = true);
    window.addEventListener('touchend', () => dragging = false);
    window.addEventListener('touchmove', (e) => { if (dragging && e.touches[0]) setPos(e.touches[0].clientX); });
    // click to jump
    ba.addEventListener('click', (e) => setPos(e.clientX));
  }

  document.querySelectorAll('.case-carousel [data-preview]').forEach(setupBA);

  // simple carousel scroll
  const track = document.getElementById('carouselTrack');
  const prev = document.getElementById('carPrev');
  const next = document.getElementById('carNext');
  if (prev && next && track) {
    prev.addEventListener('click', () => { track.scrollBy({ left: -300, behavior: 'smooth' }); });
    next.addEventListener('click', () => { track.scrollBy({ left: 300, behavior: 'smooth' }); });
  }

});

/* Floating chat and schedule CTA */
document.addEventListener('DOMContentLoaded', function () {
  const floating = document.createElement('div'); floating.className = 'floating-cta';
  floating.innerHTML = `
    <a href="#" id="openChat">💬 Chat</a>
    <a href="#" id="openSchedule">📅 Schedule</a>
    <a href="#" id="openQuickQuote">💼 Quick Quote</a>
  `;
  document.body.appendChild(floating);
  document.getElementById('openChat').addEventListener('click', (e) => { e.preventDefault(); const modal = document.querySelector('.modal'); if (modal) modal.classList.add('active'); });
  document.getElementById('openQuickQuote').addEventListener('click', (e) => { e.preventDefault(); toggleQuickQuote(); });

  // Calendly schedule handler: try popup widget, fall back to opening Calendly page
  const scheduleBtn = document.getElementById('openSchedule');
  if (scheduleBtn) {
    scheduleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = 'https://calendly.com/abhiydv23096/new-meeting';
      try {
        if (window.Calendly && typeof Calendly.showPopupWidget === 'function') {
          Calendly.showPopupWidget(url);
        } else {
          window.open(url, '_blank');
        }
      } catch (err) {
        window.open(url, '_blank');
      }
    });
  }
});

// Mini-cart / Quick Quote (acts like a cart panel)
const CART = {
  items: {}, // key -> { key, name, price, qty }
  add(item) {
    const k = item.key;
    if (!this.items[k]) this.items[k] = { ...item, qty: 0 };
    this.items[k].qty += item.qty || 1;
    renderCart();
  },
  remove(key) { delete this.items[key]; renderCart(); },
  updateQty(key, qty) { if (this.items[key]) { this.items[key].qty = qty; if (qty <= 0) delete this.items[key]; renderCart(); } },
  clear() { this.items = {}; renderCart(); },
  subtotal() { return Object.values(this.items).reduce((s, it) => s + (it.price * (it.qty || 1)), 0); }
};

function ensureQuickQuote() {
  if (document.querySelector('.quick-quote')) return document.querySelector('.quick-quote');
  const el = document.createElement('aside'); el.className = 'quick-quote';
  el.setAttribute('role', 'complementary'); el.setAttribute('aria-label', 'Quick quote cart');
  el.innerHTML = `
    <div class="qq-head"><h4>Quick Quote</h4><button class="qq-close" aria-label="Close">×</button></div>
    <div class="qq-list" id="qqList" style="min-height:80px"></div>

    <div class="qq-controls" style="margin-top:10px;">
      <label style="display:flex;align-items:center;gap:8px">Pages: <input id="pageCount" type="number" min="0" value="0" style="width:80px;margin-left:6px;padding:6px;border-radius:6px;border:1px solid #e6eefc;"/></label>
      <label style="display:flex;align-items:center;gap:6px;margin-left:8px"><input id="pricingToggleCalc" type="checkbox"/> Annual (10% off)</label>
    </div>

    <div class="qq-row" style="margin-top:12px;align-items:center"><div class="qq-total" id="qqTotal">₹0</div><div style="margin-left:auto;display:flex;gap:8px"><button type="button" class="btn" id="qqCheckout">Checkout</button><button type="button" class="btn outline" id="qqSubmit">Submit Quote</button><button type="button" class="btn" id="qqClear">Clear</button></div></div>

    <div style="margin-top:12px">
      <input id="qqName" placeholder="Your name" style="width:100%;padding:8px;border-radius:8px;border:1px solid #eef4ff;margin-bottom:8px" />
      <input id="qqEmail" placeholder="Email" style="width:100%;padding:8px;border-radius:8px;border:1px solid #eef4ff;margin-bottom:8px" />
      <textarea id="qqMsg" rows="3" placeholder="Optional message" style="width:100%;padding:8px;border-radius:8px;border:1px solid #eef4ff"></textarea>
      <div id="qqStatus" style="margin-top:8px;font-size:13px;color:#666"></div>
    </div>
    <p style="margin-top:10px; font-size:13px; color:#666">Select features and pages, then submit to request a quote.</p>
  `;
  document.body.appendChild(el);

  // wire controls
  el.querySelector('.qq-close').addEventListener('click', () => toggleQuickQuote(false));
  const pageCount = el.querySelector('#pageCount');
  const pricingToggleCalc = el.querySelector('#pricingToggleCalc');
  pageCount.addEventListener('input', () => { saveCartToStorage(); renderCart(); });
  pricingToggleCalc.addEventListener('change', () => { saveCartToStorage(); renderCart(); });

  const checkoutBtn = el.querySelector('#qqCheckout');
  const clearBtn = el.querySelector('#qqClear');
  const submitBtnEl = el.querySelector('#qqSubmit');
  checkoutBtn && checkoutBtn.addEventListener('click', () => { const modal = document.querySelector('.modal'); if (modal) { prefillModalFromCart(modal); modal.classList.add('active'); } });
  clearBtn && clearBtn.addEventListener('click', () => { CART.clear(); saveCartToStorage(); });

  submitBtnEl && submitBtnEl.addEventListener('click', async () => {
    const status = document.getElementById('qqStatus');
    const name = (document.getElementById('qqName')||{}).value?.trim() || '';
    const email = (document.getElementById('qqEmail')||{}).value?.trim() || '';
    const message = (document.getElementById('qqMsg')||{}).value || '';
    // basic validation
    if (!name) { status.style.color = 'red'; status.textContent = 'Please enter your name.'; document.getElementById('qqName').focus(); return; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.style.color = 'red'; status.textContent = 'Please enter a valid email.'; document.getElementById('qqEmail').focus(); return; }

    const payload = {
      name, email, message,
      items: Object.values(CART.items),
      pages: Number(document.getElementById('pageCount').value || 0),
      annual: !!document.getElementById('pricingToggleCalc').checked,
      subtotal: (CART.subtotal() + (Number(document.getElementById('pageCount').value || 0) * 1200)),
      ts: new Date().toISOString()
    };

    // show sending state
    const submitBtn = submitBtnEl || document.getElementById('qqSubmit');
    try {
      submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; status.style.color = '#666'; status.textContent = 'Sending...';
    } catch (err) {
      console.error('Submit button not available', err);
    }

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Submission failed');
        status.style.color = 'green'; status.textContent = 'Quote request sent — we will contact you soon.';
      } else {
        // No server endpoint configured — save locally and show success with actions
        const key = 'quick_quote_submissions';
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        stored.push(payload);
        localStorage.setItem(key, JSON.stringify(stored));
        status.style.color = 'green'; status.textContent = 'Quote saved locally — you can download or copy it.';

        // show action buttons (download/copy)
        const actionsId = 'qqActions';
        let actions = document.getElementById(actionsId);
        if (!actions) {
          actions = document.createElement('div'); actions.id = actionsId; actions.style.marginTop = '8px';
          const download = document.createElement('button'); download.className = 'btn'; download.textContent = 'Download PDF'; download.style.marginRight='8px';
          const copy = document.createElement('button'); copy.className = 'btn outline'; copy.textContent = 'Copy Summary';
          actions.appendChild(download); actions.appendChild(copy);
          document.getElementById('qqStatus').parentNode.appendChild(actions);

          download.addEventListener('click', () => downloadQuotePDF(payload));
          copy.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(formatQuoteText(payload));
              status.style.color = 'green'; status.textContent = 'Quote copied to clipboard.';
            } catch (err) {
              status.style.color = 'red'; status.textContent = 'Copy failed. Please select and copy manually.';
            }
          });
        }
      }

      // clear cart after success
      CART.clear(); saveCartToStorage(); renderCart();

    } catch (err) {
      console.error(err);
      status.style.color = 'red'; status.textContent = 'Failed to send quote. Try again or use the mail option.';
    } finally {
      try { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Quote'; } } catch (err) { console.error(err); }
    }
  });

  function formatQuoteText(payload) {
    const lines = [];
    lines.push(`Name: ${payload.name}`);
    lines.push(`Email: ${payload.email}`);
    lines.push(`Date: ${payload.ts}`);
    lines.push('Items:');
    payload.items.forEach(it => lines.push(`- ${it.name} x${it.qty} — ₹${(it.price * it.qty).toLocaleString('en-IN')}`));
    lines.push(`Pages: ${payload.pages}`);
    lines.push(`Annual: ${payload.annual ? 'Yes' : 'No'}`);
    lines.push(`Subtotal: ₹${payload.subtotal.toLocaleString('en-IN')}`);
    if (payload.message) lines.push('\nMessage:\n' + payload.message);
    return lines.join('\n');
  }

  function downloadQuotePDF(payload) {
    try {
      const { jsPDF } = window.jspdf || (window.jspdf ? window.jspdf : {});
      const doc = (jsPDF) ? new jsPDF() : null;
      const text = formatQuoteText(payload);
      if (!doc) {
        // fallback: create simple text blob
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'quote.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        return;
      }
      const lines = doc.splitTextToSize(text, 170);
      doc.setFontSize(12);
      doc.text(lines, 10, 10);
      doc.save('quote.pdf');
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('PDF download failed. Try copying the summary instead.');
    }
  }

  // persist and restore
  loadCartFromStorage();
  renderCart();
  return el;
}

// persist cart & controls to localStorage
function saveCartToStorage() {
  try {
    const data = { items: CART.items };
    const pc = document.getElementById('pageCount'); if (pc) data.pages = Number(pc.value || 0);
    const tg = document.getElementById('pricingToggleCalc'); if (tg) data.annual = !!tg.checked;
    localStorage.setItem('quick_quote', JSON.stringify(data));
  } catch (err) { /* ignore */ }
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem('quick_quote');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.items) CART.items = data.items;
    const pc = document.getElementById('pageCount'); if (pc && typeof data.pages !== 'undefined') pc.value = data.pages;
    const tg = document.getElementById('pricingToggleCalc'); if (tg && typeof data.annual !== 'undefined') tg.checked = !!data.annual;
  } catch (err) { console.error('Failed to load quick quote from storage', err); }
}

function toggleQuickQuote(open) {
  const el = ensureQuickQuote();
  if (typeof open === 'undefined') open = !el.classList.contains('open');
  el.classList.toggle('open', open);
  renderCart();
}

function renderCart() {
  const el = ensureQuickQuote();
  const list = el.querySelector('#qqList');
  list.innerHTML = '';
  const items = Object.values(CART.items);
  if (items.length === 0) {
    list.innerHTML = '<div style="color:#666">Your cart is empty. Add features to build your quote.</div>';
  } else {
    items.forEach(it => {
      const row = document.createElement('div'); row.className = 'qq-item';
      const lineTotal = (it.price * (it.qty || 1));
      row.innerHTML = `<div class="qq-left"><strong>${it.name}</strong><div class="qq-meta">₹${it.price.toLocaleString('en-IN')} each • ₹${lineTotal.toLocaleString('en-IN')} total</div></div>
        <div class="qq-right"><button class="qq-dec" data-key="${it.key}">-</button><span class="qq-qty">${it.qty}</span><button class="qq-inc" data-key="${it.key}">+</button><button class="qq-rem" data-key="${it.key}">×</button></div>`;
      list.appendChild(row);
    });
  }
  // pages cost (as info, not a cart item)
  const pages = document.getElementById('pageCount') ? Number(document.getElementById('pageCount').value) : 0;
  const perPage = 1200;
  const pagesCost = pages * perPage;
  const subtotal = CART.subtotal() + pagesCost;
  const yearly = document.getElementById('pricingToggleCalc') && document.getElementById('pricingToggleCalc').checked;
  const total = yearly ? Math.round(subtotal * 12 * 0.9) : subtotal;
  const qqTotal = document.getElementById('qqTotal');
  if (qqTotal) animateNumber(qqTotal, parseInt((qqTotal.textContent||'0').replace(/[^0-9]/g,''))||0, total);

  // wire buttons
  list.querySelectorAll('.qq-inc').forEach(b => b.addEventListener('click', (e) => { const k = e.currentTarget.getAttribute('data-key'); CART.updateQty(k, (CART.items[k]?.qty||0) + 1); }));
  list.querySelectorAll('.qq-dec').forEach(b => b.addEventListener('click', (e) => { const k = e.currentTarget.getAttribute('data-key'); CART.updateQty(k, (CART.items[k]?.qty||0) - 1); }));
  list.querySelectorAll('.qq-rem').forEach(b => b.addEventListener('click', (e) => { const k = e.currentTarget.getAttribute('data-key'); CART.remove(k); }));

  // save state after interactions
  saveCartToStorage();
}

function updateQuickQuoteTotal() { renderCart(); }

// Delegated fallback: handle clicks on #qqSubmit even if original handler didn't attach
document.addEventListener('click', function (e) {
  try {
    const target = e.target;
    if (!target) return;
    // support clicking icon/text inside button by closest
    const isSubmit = (target.id === 'qqSubmit') || (target.closest && target.closest('#qqSubmit'));
    if (!isSubmit) return;
    e.preventDefault();
    const status = document.getElementById('qqStatus');
    const nameEl = document.getElementById('qqName');
    const emailEl = document.getElementById('qqEmail');
    if (!nameEl || !emailEl) return; // nothing to do
    const name = (nameEl.value || '').trim();
    const email = (emailEl.value || '').trim();
    if (!name) { if (status) { status.style.color = 'red'; status.textContent = 'Please enter your name.'; } return; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { if (status) { status.style.color = 'red'; status.textContent = 'Please enter a valid email.'; } return; }

    // build payload
    const payload = {
      name, email, message: (document.getElementById('qqMsg')||{}).value || (document.getElementById('m-msg')||{}).value || '',
      items: Object.values(CART.items),
      pages: Number(document.getElementById('pageCount')?.value || 0),
      annual: !!document.getElementById('pricingToggleCalc')?.checked,
      subtotal: (CART.subtotal() + (Number(document.getElementById('pageCount')?.value || 0) * 1200)),
      ts: new Date().toISOString()
    };

    // show quick feedback
    if (status) { status.style.color = '#666'; status.textContent = 'Processing...'; }

    // If FORM_ENDPOINT exists try POST, otherwise save locally
    (async function () {
      try {
        if (FORM_ENDPOINT) {
          const fd = new FormData(); fd.append('name', payload.name); fd.append('email', payload.email); fd.append('message', payload.message);
          const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: fd });
          if (!res.ok) throw new Error('Submission failed: ' + res.status);
          if (status) { status.style.color = 'green'; status.textContent = 'Quote sent successfully.'; }
        } else {
          const key = 'quick_quote_submissions';
          const stored = JSON.parse(localStorage.getItem(key) || '[]');
          stored.push(payload);
          localStorage.setItem(key, JSON.stringify(stored));
          if (status) { status.style.color = 'green'; status.textContent = 'Quote saved locally — open Quick Quote later to download.'; }
        }
        CART.clear(); saveCartToStorage(); renderCart();
      } catch (err) {
        console.error('Fallback submit error', err);
        if (status) { status.style.color = 'red'; status.textContent = 'Failed to submit. Check console or try again.'; }
      }
    })();
  } catch (err) { console.error('Delegated submit listener error', err); }
});

// prefill modal with cart summary
function prefillModalFromCart(modal) {
  const nameEl = modal.querySelector('#m-name'); if (nameEl) nameEl.value = '';
  const msgEl = modal.querySelector('#m-msg'); if (msgEl) {
    const items = Object.values(CART.items).map(it => `${it.name} x${it.qty} — ₹${(it.price * it.qty).toLocaleString('en-IN')}`);
    const pages = document.getElementById('pageCount') ? Number(document.getElementById('pageCount').value) : 0;
    items.push(`Pages: ${pages}`);
    msgEl.value = 'Quote request:\n' + items.join('\n') + '\n\nPlease contact me with next steps.';
  }
}

// add-to-cart buttons for feature cards
document.querySelectorAll('.feature').forEach(fc => {
  // add a small control bar if not present
  let ctrl = fc.querySelector('.fc-controls');
  if (!ctrl) {
    ctrl = document.createElement('div'); ctrl.className = 'fc-controls';
    const btn = document.createElement('button'); btn.className = 'btn small add-to-cart'; btn.textContent = 'Add to Cart';
    ctrl.appendChild(btn); fc.appendChild(ctrl);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = fc.getAttribute('data-key') || ('feat-' + Math.random().toString(36).slice(2,8));
      const name = (fc.querySelector('.fc-body strong') && fc.querySelector('.fc-body strong').textContent) || 'Feature';
      const price = Number(fc.getAttribute('data-price') || 0);
      // animate fly-to-cart
      flyToCart(fc, () => { CART.add({ key, name, price, qty: 1 }); toggleQuickQuote(true); });
    });
  }
});

function flyToCart(sourceEl, cb) {
  const cartEl = ensureQuickQuote();
  const icon = sourceEl.querySelector('.fc-icon');
  const rect = (icon || sourceEl).getBoundingClientRect();
  const clone = (icon || sourceEl).cloneNode(true);
  clone.style.position = 'fixed'; clone.style.left = rect.left + 'px'; clone.style.top = rect.top + 'px'; clone.style.zIndex = 9999; clone.style.transition = 'transform 700ms ease, opacity 700ms ease';
  document.body.appendChild(clone);
  const cartRect = cartEl.getBoundingClientRect();
  const dx = cartRect.left + cartRect.width/2 - rect.left;
  const dy = cartRect.top + cartRect.height/2 - rect.top;
  requestAnimationFrame(() => { clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`; clone.style.opacity = '0.2'; });
  setTimeout(() => { clone.remove(); if (typeof cb === 'function') cb(); }, 750);
}

/* Make package cards purchasable: add Buy buttons and wire into CART */
document.addEventListener('DOMContentLoaded', function () {
  const pkgToggle = document.getElementById('pricingToggle');
  document.querySelectorAll('.package-card').forEach(pkg => {
    // add control container
    let ctrl = pkg.querySelector('.pkg-controls');
    if (!ctrl) {
      ctrl = document.createElement('div'); ctrl.className = 'pkg-controls';
      const btn = document.createElement('button'); btn.className = 'btn small buy-package'; btn.textContent = 'Buy';
      ctrl.appendChild(btn);
      pkg.appendChild(ctrl);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const titleEl = pkg.querySelector('.title') || pkg.querySelector('h3');
        const name = titleEl ? titleEl.textContent.trim() : 'Package';
        const priceEl = pkg.querySelector('.price');
        let price = 0;
        if (priceEl) {
          const pm = priceEl.getAttribute('data-price-month');
          const py = priceEl.getAttribute('data-price-year');
          const yearly = pkgToggle && pkgToggle.checked;
          if (yearly && py) price = Number(py);
          else if (pm) price = Number(pm);
          else {
            // parse displayed text
            const txt = priceEl.textContent || ''; price = Number(txt.replace(/[^0-9]/g,'')) || 0;
          }
        }
        const key = 'pkg-' + name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
        flyToCart(pkg, () => { CART.add({ key, name, price, qty: 1 }); toggleQuickQuote(true); });
      });
    }
  });
});




